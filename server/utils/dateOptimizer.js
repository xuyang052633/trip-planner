/**
 * 日期价格数据 - 历史价格模式分析
 * 实际项目中应该从数据库或API获取真实历史数据
 */

// 热门航线的基础价格和价格波动模式
const ROUTE_PRICE_PATTERNS = {
  'SHA-SYX': { basePrice: 800, peakMultiplier: 1.8, offPeakMultiplier: 0.7, peakDays: ['05-01', '10-01', '10-02', '10-03', '10-04', '01-01', '05-02', '05-03'] },
  'SHA-CTU': { basePrice: 650, peakMultiplier: 1.5, offPeakMultiplier: 0.75, peakDays: ['05-01', '10-01', '01-01', '02-14', '02-15'] },
  'SHA-PEK': { basePrice: 550, peakMultiplier: 1.6, offPeakMultiplier: 0.7, peakDays: ['05-01', '10-01', '01-01', '02-14'] },
  'SHA-XMN': { basePrice: 450, peakMultiplier: 1.4, offPeakMultiplier: 0.65, peakDays: ['05-01', '10-01', '01-01'] },
  'SHA-HGH': { basePrice: 280, peakMultiplier: 1.3, offPeakMultiplier: 0.8, peakDays: ['05-01', '10-01'] },
  'SHA-KMG': { basePrice: 700, peakMultiplier: 1.5, offPeakMultiplier: 0.7, peakDays: ['05-01', '10-01', '01-01'] },
  'SHA-DLC': { basePrice: 750, peakMultiplier: 1.6, offPeakMultiplier: 0.7, peakDays: ['05-01', '10-01', '07-15', '07-16', '07-17'] },
  'SHA-CKG': { basePrice: 500, peakMultiplier: 1.4, offPeakMultiplier: 0.7, peakDays: ['05-01', '10-01'] },
  'PEK-SYX': { basePrice: 1100, peakMultiplier: 2.0, offPeakMultiplier: 0.6, peakDays: ['05-01', '10-01', '10-02', '10-03', '10-04', '01-01', '07-01', '07-02', '07-03'] },
  'PEK-CTU': { basePrice: 750, peakMultiplier: 1.5, offPeakMultiplier: 0.7, peakDays: ['05-01', '10-01', '01-01'] },
  'CAN-SYX': { basePrice: 500, peakMultiplier: 1.7, offPeakMultiplier: 0.65, peakDays: ['05-01', '10-01', '10-02', '10-03'] },
  'SZX-SYX': { basePrice: 450, peakMultiplier: 1.6, offPeakMultiplier: 0.6, peakDays: ['05-01', '10-01', '10-02', '10-03'] },
};

/**
 * 计算指定日期的机票价格
 */
function estimatePrice(origin, destination, date) {
  const routeKey = `${origin}-${destination}`;
  const pattern = ROUTE_PRICE_PATTERNS[routeKey] || { basePrice: 600, peakMultiplier: 1.5, offPeakMultiplier: 0.7, peakDays: [] };
  
  // 提取月日
  const monthDay = date.substring(5); // MM-DD格式
  
  let multiplier = 1.0;
  if (pattern.peakDays.includes(monthDay)) {
    multiplier = pattern.peakMultiplier;
  } else if (['01', '02', '06', '07', '08', '12'].includes(date.substring(0, 2))) {
    // 淡季月份
    multiplier = pattern.offPeakMultiplier;
  } else {
    // 平日
    multiplier = 1.0;
  }
  
  return {
    estimatedPrice: Math.round(pattern.basePrice * multiplier),
    basePrice: pattern.basePrice,
    multiplier: multiplier,
    isPeak: pattern.peakDays.includes(monthDay)
  };
}

/**
 * 获取日期范围内的所有日期价格
 */
function getDateRangePrices(origin, destination, startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dateStr = current.toISOString().substring(0, 10);
    const priceInfo = estimatePrice(origin, destination, dateStr);
    
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    dates.push({
      date: dateStr,
      dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayOfWeek],
      isWeekend,
      ...priceInfo,
      recommendation: getDayRecommendation(priceInfo, isWeekend)
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * 获取日期推荐
 */
function getDayRecommendation(priceInfo, isWeekend) {
  if (priceInfo.isPeak) {
    return { label: '高峰期', color: 'red', reason: '节假日/旺季，价格较高' };
  }
  
  if (priceInfo.multiplier <= 0.75) {
    return { label: '超低价', color: 'green', reason: '淡季价格，便宜出行' };
  }
  
  if (priceInfo.multiplier < 1.0) {
    return { label: '推荐', color: 'blue', reason: '平日价格，合理出行' };
  }
  
  if (isWeekend) {
    return { label: '周末', color: 'orange', reason: '周末出行，稍贵但方便' };
  }
  
  return { label: '平日', color: 'default', reason: '常规工作日价格' };
}

/**
 * 找出最便宜的出行日期
 */
function findCheapestDates(origin, destination, startDate, endDate, topN = 5) {
  const prices = getDateRangePrices(origin, destination, startDate, endDate);
  
  // 按价格排序
  const sorted = [...prices].sort((a, b) => a.estimatedPrice - b.estimatedPrice);
  
  // 找出最便宜的N天
  const cheapest = sorted.slice(0, topN);
  
  // 计算平均价格
  const avgPrice = Math.round(prices.reduce((sum, p) => sum + p.estimatedPrice, 0) / prices.length);
  
  // 找出周末选项
  const weekendOptions = prices.filter(p => p.isWeekend).slice(0, 3);
  
  return {
    cheapestDates: cheapest,
    weekendOptions,
    averagePrice: avgPrice,
    priceRange: {
      min: sorted[0]?.estimatedPrice || 0,
      max: sorted[sorted.length - 1]?.estimatedPrice || 0
    },
    savings: avgPrice - (sorted[0]?.estimatedPrice || 0)
  };
}

/**
 * 获取最优出行建议（考虑请假成本）
 */
function getOptimalTravelDates(origin, destination, startDate, endDate, dailySalary, leaveHours) {
  const { cheapestDates, weekendOptions, averagePrice, priceRange, savings } = 
    findCheapestDates(origin, destination, startDate, endDate, 7);
  
  // 计算请假成本
  const hourlyRate = dailySalary / 8;
  const leaveCostPerDay = hourlyRate * (leaveHours / (leaveHours > 8 ? 8 : leaveHours));
  
  // 综合评分：考虑价格和请假损失
  const scoredDates = cheapestDates.map(d => {
    const totalCost = d.estimatedPrice + leaveCostPerDay;
    return {
      ...d,
      leaveCost: Math.round(leaveCostPerDay),
      totalCost: Math.round(totalCost),
      score: Math.round((1 - d.estimatedPrice / averagePrice) * 50 + (d.isWeekend ? 20 : 10))
    };
  });
  
  // 找出综合最优
  const optimal = scoredDates.reduce((best, current) => 
    current.totalCost < best.totalCost ? current : best
  , scoredDates[0]);
  
  return {
    analysis: {
      averagePrice,
      priceRange,
      potentialSavings: savings
    },
    recommendations: scoredDates.slice(0, 5),
    optimal,
    weekendAlternatives: weekendOptions
  };
}

module.exports = {
  ROUTE_PRICE_PATTERNS,
  estimatePrice,
  getDateRangePrices,
  findCheapestDates,
  getOptimalTravelDates
};
