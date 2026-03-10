/**
 * 请假损失计算工具函数
 */

/**
 * 计算请假损失
 * @param {Object} params - 计算参数
 * @param {number} params.dailySalary - 日薪（元/天）
 * @param {number} params.leaveHours - 请假小时数
 * @param {Object} params.workSchedule - 工作时间段配置
 * @returns {Object} - 计算结果
 */
function calculateLeaveCost(params) {
  const { dailySalary, leaveHours, workSchedule } = params;

  // 默认工作时长：8小时/天
  const dailyWorkHours = workSchedule?.hoursPerDay || 8;

  // 每小时薪资
  const hourlySalary = dailySalary / dailyWorkHours;

  // 总损失 = 时薪 × 请假小时数
  const totalCost = hourlySalary * leaveHours;

  return {
    dailySalary,
    dailyWorkHours,
    hourlySalary: Math.round(hourlySalary * 100) / 100,
    leaveHours,
    totalCost: Math.round(totalCost * 100) / 100,
    formula: `日薪 ${dailySalary} ÷ ${dailyWorkHours}小时 = ${Math.round(hourlySalary * 100) / 100}元/小时`,
    calculation: `${Math.round(hourlySalary * 100) / 100} × ${leaveHours}小时 = ${Math.round(totalCost * 100) / 100}元`
  };
}

/**
 * 解析请假时间范围并计算小时数
 * @param {string} startDateTime - 开始时间 "2026-03-05 09:00"
 * @param {string} endDateTime - 结束时间 "2026-03-05 18:00"
 * @param {Object} workSchedule - 工作时间段
 * @returns {Object} - 包含小时数和详细信息
 */
function parseLeaveTime(startDateTime, endDateTime, workSchedule = {}) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  // 计算总小时数（包含周末）
  const totalHours = (end - start) / (1000 * 60 * 60);

  // 如果需要精确到工作日，可以进一步实现
  // 这里简化为：跨度的总小时数（用户可能自己计算好了）

  return {
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    totalHours: Math.round(totalHours * 10) / 10,
    days: Math.floor(totalHours / 24),
    hours: Math.round(totalHours % 24)
  };
}

/**
 * 工作日判断（扩展功能）
 * @param {Date} date - 日期
 * @returns {boolean} - 是否为工作日
 */
function isWorkday(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0=周日, 6=周六
}

module.exports = {
  calculateLeaveCost,
  parseLeaveTime,
  isWorkday
};
