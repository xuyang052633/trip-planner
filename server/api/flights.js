const express = require('express');
const router = express.Router();
const { searchFlights } = require('../crawler/flightCrawler');
const { calculateLeaveCost } = require('../utils/leaveCost');
const { findOptimalCombination, generateRecommendation } = require('../utils/optimizer');

/**
 * 综合查询接口
 * POST /api/flights/optimize
 *
 * 请求体：
 * {
 *   origin: "SHA",           // 出发地（机场代码）
 *   destination: "PEK",      // 目的地
 *   date: "2026-03-10",     // 出发日期
 *   dailySalary: 500,         // 日薪
 *   leaveHours: 16,          // 请假小时数
 *   workSchedule: {           // 工作时间配置（可选）
 *     hoursPerDay: 8
 *   },
 *   platforms: ["ctrip", "qunar", "fliggy"]  // 查询平台
 * }
 */
router.post('/optimize', async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      dailySalary,
      leaveHours,
      workSchedule = {},
      platforms = ['ctrip', 'qunar', 'fliggy']
    } = req.body;

    // 验证参数
    if (!origin || !destination || !date) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：出发地、目的地、日期'
      });
    }

    if (!dailySalary || !leaveHours) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：日薪、请假小时数'
      });
    }

    console.log(`\n📊 开始计算最优方案`);
    console.log(`📍 路线：${origin} → ${destination}`);
    console.log(`📅 日期：${date}`);
    console.log(`💰 日薪：¥${dailySalary}/天`);
    console.log(`⏰ 请假：${leaveHours}小时`);

    // 1. 计算请假损失
    const leaveCostResult = calculateLeaveCost({
      dailySalary,
      leaveHours,
      workSchedule
    });

    console.log(`\n💵 请假损失：¥${leaveCostResult.totalCost}`);

    // 2. 爬取机票价格
    console.log(`\n🔍 正在查询机票价格...`);
    const flightResults = await searchFlights({
      origin,
      destination,
      date,
      platforms
    });

    // 合并所有航班数据
    const allFlights = [];
    flightResults.forEach(result => {
      if (result.success && result.flights) {
        allFlights.push(...result.flights);
      }
    });

    console.log(`✅ 找到 ${allFlights.length} 个航班选项`);

    if (allFlights.length === 0) {
      return res.json({
        success: true,
        leaveCost: leaveCostResult,
        flights: [],
        message: '未找到航班信息，请尝试其他日期或路线'
      });
    }

    // 3. 计算最优组合
    const optimalResult = findOptimalCombination(allFlights, leaveCostResult.totalCost);

    console.log(`\n🎯 最优方案：${optimalResult.optimal.platform}`);
    console.log(`💰 最优总成本：¥${optimalResult.optimal.totalCost}`);

    // 4. 返回结果
    res.json({
      success: true,
      query: {
        origin,
        destination,
        date,
        dailySalary,
        leaveHours
      },
      leaveCost: leaveCostResult,
      flights: allFlights,
      optimization: optimalResult,
      recommendation: generateRecommendation(optimalResult.optimal)
    });

  } catch (error) {
    console.error('❌ API 错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 单独计算请假损失
 * POST /api/flights/leave-cost
 */
router.post('/leave-cost', (req, res) => {
  try {
    const { dailySalary, leaveHours, workSchedule = {} } = req.body;

    const result = calculateLeaveCost({
      dailySalary,
      leaveHours,
      workSchedule
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 健康检查
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'flight-api' });
});

module.exports = router;
