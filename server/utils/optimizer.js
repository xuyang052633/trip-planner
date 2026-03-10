/**
 * 旅游方案优化算法
 */

/**
 * 找出最优旅游组合
 * @param {Array} flightOptions - 航班选项数组
 * @param {number} leaveCost - 请假损失（元）
 * @returns {Object} - 最优方案和所有排序后的方案
 */
function findOptimalCombination(flightOptions, leaveCost) {
  // 计算每个方案的总成本
  const optimizedOptions = flightOptions.map(flight => {
    const totalCost = leaveCost + flight.price;
    return {
      ...flight,
      leaveCost,
      totalCost: Math.round(totalCost * 100) / 100,
      savings: 0 // 相对最高价格的节省
    };
  });

  // 按总成本排序
  optimizedOptions.sort((a, b) => a.totalCost - b.totalCost);

  // 计算节省金额（相对于最贵方案）
  if (optimizedOptions.length > 1) {
    const maxCost = optimizedOptions[optimizedOptions.length - 1].totalCost;
    optimizedOptions.forEach(opt => {
      opt.savings = Math.round((maxCost - opt.totalCost) * 100) / 100;
    });
  }

  return {
    optimal: optimizedOptions[0], // 最优方案
    allOptions: optimizedOptions,  // 所有方案（已排序）
    summary: {
      totalOptions: optimizedOptions.length,
      bestPlatform: optimizedOptions[0]?.platform || '无',
      minTotalCost: optimizedOptions[0]?.totalCost || 0,
      maxTotalCost: optimizedOptions[optimizedOptions.length - 1]?.totalCost || 0,
      maxSavings: optimizedOptions[0]?.savings || 0
    }
  };
}

/**
 * 跨日期优化（可选扩展）
 * @param {Array} multiDayResults - 多天的结果 [{date, flights, leaveCost}]
 * @returns {Object} - 跨日期最优分析
 */
function optimizeMultiDay(multiDayResults) {
  const analysis = multiDayResults.map(day => {
    const optimal = findOptimalCombination(day.flights, day.leaveCost);
    return {
      date: day.date,
      ...optimal
    };
  });

  // 找出全局最优日期
  const globalOptimal = analysis
    .filter(d => d.optimal)
    .sort((a, b) => a.optimal.totalCost - b.optimal.totalCost)[0];

  return {
    byDate: analysis,
    globalOptimal: globalOptimal
  };
}

/**
 * 生成推荐文本
 * @param {Object} optimal - 最优方案
 * @returns {string} - 推荐文本
 */
function generateRecommendation(optimal) {
  if (!optimal) {
    return '暂无可用方案';
  }

  const { platform, airline, departureTime, arrivalTime, price, totalCost, savings } = optimal;

  let recommendation = `🎯 **最优方案推荐**\n\n`;
  recommendation += `🛫 **航班信息**\n`;
  recommendation += `• 平台：${platform}\n`;
  recommendation += `• 航空公司：${airline}\n`;
  recommendation += `• 起飞：${departureTime}\n`;
  recommendation += `• 到达：${arrivalTime}\n`;
  recommendation += `• 机票价格：¥${price}\n\n`;

  recommendation += `💰 **成本分析**\n`;
  recommendation += `• 机票：¥${price}\n`;
  recommendation += `• 请假损失：¥${optimal.leaveCost}\n`;
  recommendation += `• **总成本：¥${totalCost}**\n`;

  if (savings > 0) {
    recommendation += `\n💎 **比最贵方案节省 ¥${savings}**`;
  }

  return recommendation;
}

module.exports = {
  findOptimalCombination,
  optimizeMultiDay,
  generateRecommendation
};
