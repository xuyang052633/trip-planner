const express = require('express');
const router = express.Router();
const { 
  getDateRangePrices, 
  findCheapestDates,
  getOptimalTravelDates 
} = require('../utils/dateOptimizer');

/**
 * 获取日期范围内的价格明细
 * POST /api/dates/prices
 * 
 * 请求体：
 * {
 *   origin: 'SHA',
 *   destination: 'SYX',
 *   startDate: '2026-03-01',
 *   endDate: '2026-03-31'
 * }
 */
router.post('/prices', (req, res) => {
  try {
    const { origin, destination, startDate, endDate } = req.body;
    
    if (!origin || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: '请提供出发地、目的地、开始日期和结束日期'
      });
    }
    
    const prices = getDateRangePrices(origin, destination, startDate, endDate);
    
    res.json({
      success: true,
      query: { origin, destination, startDate, endDate },
      prices
    });
    
  } catch (error) {
    console.error('❌ 日期价格API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 找出最便宜的出行日期
 * POST /api/dates/cheapest
 * 
 * 请求体：
 * {
 *   origin: 'SHA',
 *   destination: 'SYX',
 *   startDate: '2026-03-01',
 *   endDate: '2026-03-31',
 *   topN: 5
 * }
 */
router.post('/cheapest', (req, res) => {
  try {
    const { origin, destination, startDate, endDate, topN = 5 } = req.body;
    
    if (!origin || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: '请提供完整参数'
      });
    }
    
    const result = findCheapestDates(origin, destination, startDate, endDate, topN);
    
    res.json({
      success: true,
      query: { origin, destination, startDate, endDate, topN },
      ...result
    });
    
  } catch (error) {
    console.error('❌ 最便宜日期API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取最优出行建议（综合请假成本）
 * POST /api/dates/optimal
 * 
 * 请求体：
 * {
 *   origin: 'SHA',
 *   destination: 'SYX',
 *   startDate: '2026-03-01',
 *   endDate: '2026-03-31',
 *   dailySalary: 500,
 *   leaveHours: 16
 * }
 */
router.post('/optimal', (req, res) => {
  try {
    const { 
      origin, 
      destination, 
      startDate, 
      endDate, 
      dailySalary = 500, 
      leaveHours = 8 
    } = req.body;
    
    if (!origin || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: '请提供完整参数'
      });
    }
    
    const result = getOptimalTravelDates(
      origin, 
      destination, 
      startDate, 
      endDate, 
      dailySalary,
      leaveHours
    );
    
    res.json({
      success: true,
      query: { origin, destination, startDate, endDate, dailySalary, leaveHours },
      ...result
    });
    
  } catch (error) {
    console.error('❌ 最优日期API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 价格趋势分析
 * POST /api/dates/trend
 */
router.post('/trend', (req, res) => {
  try {
    const { origin, destination, startDate, endDate } = req.body;
    
    if (!origin || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: '请提供完整参数'
      });
    }
    
    const prices = getDateRangePrices(origin, destination, startDate, endDate);
    
    // 计算周平均
    const weekAvgs = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      const weekStart = new Date(d);
      const weekEnd = new Date(d);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekPrices = prices.filter(p => {
        const pd = new Date(p.date);
        return pd >= weekStart && pd <= weekEnd;
      });
      
      if (weekPrices.length > 0) {
        const avg = weekPrices.reduce((s, p) => s + p.estimatedPrice, 0) / weekPrices.length;
        weekAvgs.push({
          week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
          avgPrice: Math.round(avg),
          minPrice: Math.min(...weekPrices.map(p => p.estimatedPrice))
        });
      }
    }
    
    // 找出最低价周
    const cheapestWeek = weekAvgs.reduce((min, w) => 
      w.avgPrice < min.avgPrice ? w : min
    , weekAvgs[0] || { week: 'N/A', avgPrice: 0 });
    
    res.json({
      success: true,
      weeklyTrend: weekAvgs,
      cheapestWeek,
      summary: {
        totalDays: prices.length,
        avgPrice: Math.round(prices.reduce((s, p) => s + p.estimatedPrice, 0) / prices.length),
        cheapestDay: prices.reduce((min, p) => 
          p.estimatedPrice < min.estimatedPrice ? p : min
        , prices[0])
      }
    });
    
  } catch (error) {
    console.error('❌ 价格趋势API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
