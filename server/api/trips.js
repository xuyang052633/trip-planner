const express = require('express');
const router = express.Router();
const { getFlights, findBestFlightCombination } = require('../data/flights');
const { calculateLeaveCost } = require('../utils/leaveCost');
const { getRecommendedDestinations, getHotDestinations, searchDestinations } = require('../data/destinations');
const { getOptimalTravelDates } = require('../utils/dateOptimizer');
const amadeusService = require('../services/amadeus');

/**
 * 获取详细行程推荐（含往返）
 * POST /api/trips/recommend
 */
router.post('/recommend', async (req, res) => {
  try {
    const { 
      budget, 
      days, 
      origin, 
      destination,
      departureDate,
      returnDate,
      dailySalary = 500, 
      workHours = 8,
      leaveHours 
    } = req.body;
    
    if (!budget || !days) {
      return res.status(400).json({
        success: false,
        error: '请提供预算和天数'
      });
    }
    
    if (!origin) {
      return res.status(400).json({
        success: false,
        error: '请提供出发地'
      });
    }
    
    // 计算请假成本
    const leaveHoursActual = leaveHours || days * workHours;
    const leaveCostResult = calculateLeaveCost({
      dailySalary,
      leaveHours: leaveHoursActual,
      workSchedule: { hoursPerDay: workHours }
    });
    
    // 使用指定的日期或自动推荐
    const travelDate = departureDate || getRecommendedDate(dailySalary, days);
    const retDate = returnDate || getReturnDate(travelDate, days);
    
    // 尝试从 Amadeus 获取真实航班数据
    let outboundFlights = [];
    let returnFlights = [];
    
    try {
      console.log(`🌐 正在从 Amadeus 获取真实航班数据...`);
      // 去程：origin → destination
      // 返程：destination → origin
      const [outbound, returning] = await Promise.all([
        amadeusService.searchFlights(origin, destination, travelDate),
        amadeusService.searchFlights(destination, origin, retDate)
      ]);
      
      outboundFlights = outbound || [];
      returnFlights = returning || [];
      console.log(`✅ Amadeus 返回: 去程 ${outboundFlights.length} 航班, 返程 ${returnFlights.length} 航班`);
    } catch (err) {
      console.error('❌ Amadeus 调用失败:', err.message);
    }
    
    // 如果 Amadeus 没有数据，使用模拟数据
    if (outboundFlights.length === 0) {
      console.log('📝 使用模拟航班数据');
      outboundFlights = getFlights(origin, destination, travelDate).slice(0, 10);
    }
    if (returnFlights.length === 0) {
      returnFlights = getFlights(destination, origin, retDate).slice(0, 10);
    }
    
    // 计算往返最优组合
    const roundTripAnalysis = calculateRoundTrip(outboundFlights, returnFlights, leaveCostResult.totalCost);
    
    let recommendations = [];
    
    if (destination) {
      // 指定了目的地
      recommendations = [{
        destination: destination,
        departureDate: travelDate,
        returnDate: retDate,
        days: days,
        outboundFlights: outboundFlights.slice(0, 10),
        returnFlights: returnFlights.slice(0, 10),
        roundTrip: roundTripAnalysis,
        leaveCost: leaveCostResult
      }];
    } else {
      // 未指定目的地，获取推荐目的地列表
      const recommendedDestinations = getRecommendedDestinations({
        budget,
        days,
        origin
      });
      
      recommendations = recommendedDestinations.slice(0, 5).map(dest => {
        const outFlights = getFlights(origin, dest.code, travelDate);
        const retFlights = getFlights(dest.code, origin, retDate);
        const rtAnalysis = calculateRoundTrip(outFlights, retFlights, leaveCostResult.totalCost);
        
        return {
          destination: dest,
          departureDate: travelDate,
          returnDate: retDate,
          days: days,
          outboundFlights: outFlights.slice(0, 10),
          returnFlights: retFlights.slice(0, 10),
          roundTrip: rtAnalysis,
          leaveCost: leaveCostResult
        };
      });
    }
    
    res.json({
      success: true,
      query: {
        budget,
        days,
        origin,
        destination,
        departureDate: travelDate,
        returnDate: retDate,
        dailySalary,
        workHours,
        leaveHours: leaveHoursActual
      },
      leaveCost: leaveCostResult,
      recommendations
    });
    
  } catch (error) {
    console.error('❌ 行程推荐API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 计算往返最优组合
 */
function calculateRoundTrip(outboundFlights, returnFlights, leaveCost) {
  const results = [];
  
  // 组合所有去程和返程航班
  for (const outbound of outboundFlights.slice(0, 8)) {
    for (const ret of returnFlights.slice(0, 8)) {
      const totalFlightCost = outbound.price + ret.price;
      const totalCost = totalFlightCost + leaveCost;
      
      results.push({
        outbound,
        return: ret,
        outboundPrice: outbound.price,
        returnPrice: ret.price,
        totalFlightCost,
        totalCost,
        reason: ''
      });
    }
  }
  
  // 按总成本排序
  results.sort((a, b) => a.totalCost - b.totalCost);
  
  // 最优方案
  const optimal = results[0];
  optimal.reason = '往返总价最优';
  
  // 最便宜去程
  const cheapestOutbound = [...outboundFlights].sort((a, b) => a.price - b.price)[0];
  
  // 最便宜返程  
  const cheapestReturn = [...returnFlights].sort((a, b) => a.price - b.price)[0];
  
  // 最便宜往返组合
  const cheapestRoundTrip = {
    outbound: cheapestOutbound,
    return: cheapestReturn,
    outboundPrice: cheapestOutbound.price,
    returnPrice: cheapestReturn.price,
    totalFlightCost: cheapestOutbound.price + cheapestReturn.price,
    totalCost: cheapestOutbound.price + cheapestReturn.price + leaveCost,
    reason: '单程最便宜组合'
  };
  
  // 最早去程 + 最早返程
  const earliestOutbound = outboundFlights[0];
  const earliestReturn = returnFlights[0];
  const earliestRoundTrip = {
    outbound: earliestOutbound,
    return: earliestReturn,
    outboundPrice: earliestOutbound.price,
    returnPrice: earliestReturn.price,
    totalFlightCost: earliestOutbound.price + earliestReturn.price,
    totalCost: earliestOutbound.price + earliestReturn.price + leaveCost,
    reason: '最早航班组合'
  };
  
  return {
    optimal,
    cheapestRoundTrip,
    earliestRoundTrip,
    all: results.slice(0, 20)
  };
}

/**
 * 获取完整行程计划（包含多个日期选项）
 * POST /api/trips/full
 */
router.post('/full', (req, res) => {
  try {
    const { 
      origin, 
      destination,
      dateRange,
      dailySalary = 500, 
      workHours = 8,
      leaveHours 
    } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: '请提供出发地和目的地'
      });
    }
    
    // 计算请假成本
    const leaveHoursActual = leaveHours || (dateRange ? Math.ceil((new Date(dateRange[1]) - new Date(dateRange[0])) / (1000 * 60 * 60 * 24)) * workHours : workHours);
    const leaveCostResult = calculateLeaveCost({
      dailySalary,
      leaveHours: leaveHoursActual,
      workSchedule: { hoursPerDay: workHours }
    });
    
    // 获取日期范围内的价格
    let datePrices = [];
    if (dateRange && dateRange.length === 2) {
      const dateOptimizer = require('../utils/dateOptimizer');
      datePrices = dateOptimizer.getOptimalTravelDates(
        origin, 
        destination, 
        dateRange[0], 
        dateRange[1], 
        dailySalary,
        workHours
      );
    }
    
    // 获取所有航班选项
    const flights = getFlights(origin, destination, dateRange ? dateRange[0] : getRecommendedDate(dailySalary, 3));
    const flightCombinations = findBestFlightCombination(flights, leaveCostResult.totalCost, 99999);
    
    res.json({
      success: true,
      query: {
        origin,
        destination,
        dateRange,
        dailySalary,
        workHours,
        leaveHours: leaveHoursActual
      },
      leaveCost: leaveCostResult,
      dateAnalysis: datePrices,
      flights: flightCombinations
    });
    
  } catch (error) {
    console.error('❌ 完整行程API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 辅助函数：获取推荐日期
 */
function getRecommendedDate(dailySalary, days) {
  // 找到最近的一个好价格日期
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // 如果今天是工作日，推荐下周一
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const daysUntilMonday = 8 - dayOfWeek;
    today.setDate(today.getDate() + daysUntilMonday);
  } else {
    // 周末则推荐下周一
    today.setDate(today.getDate() + (8 - dayOfWeek));
  }
  
  return today.toISOString().substring(0, 10);
}

/**
 * 辅助函数：获取返程日期
 */
function getReturnDate(departureDate, days) {
  const dep = new Date(departureDate);
  dep.setDate(dep.getDate() + days - 1);
  return dep.toISOString().substring(0, 10);
}

module.exports = router;
