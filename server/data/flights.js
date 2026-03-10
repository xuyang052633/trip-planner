/**
 * 航班数据模拟 - 模拟真实航班详细信息
 */
const FLIGHT_DATABASE = {
  // 上海三亚
  'SHA-SYX': [
    { flightNo: 'MU5217', airline: '东方航空', departTime: '07:30', arriveTime: '10:20', terminal: 'T1', aircraft: 'A320', duration: '2h50m' },
    { flightNo: 'CZ6754', airline: '南方航空', departTime: '08:45', arriveTime: '11:40', terminal: 'T2', aircraft: 'A321', duration: '2h55m' },
    { flightNo: 'HU7322', airline: '海南航空', departTime: '09:30', arriveTime: '12:25', terminal: 'T2', aircraft: 'B737', duration: '2h55m' },
    { flightNo: '3U8963', airline: '四川航空', departTime: '11:00', arriveTime: '13:55', terminal: 'T1', aircraft: 'A330', duration: '2h55m' },
    { flightNo: 'MU5219', airline: '东方航空', departTime: '13:15', arriveTime: '16:10', terminal: 'T1', aircraft: 'A320', duration: '2h55m' },
    { flightNo: 'CZ6756', airline: '南方航空', departTime: '14:30', arriveTime: '17:25', terminal: 'T2', aircraft: 'A321', duration: '2h55m' },
    { flightNo: 'MU5221', airline: '东方航空', departTime: '16:00', arriveTime: '18:55', terminal: 'T1', aircraft: 'A320', duration: '2h55m' },
    { flightNo: 'HU7324', airline: '海南航空', departTime: '17:30', arriveTime: '20:25', terminal: 'T2', aircraft: 'B737', duration: '2h55m' },
    { flightNo: 'CZ6758', airline: '南方航空', departTime: '19:00', arriveTime: '21:55', terminal: 'T2', aircraft: 'A321', duration: '2h55m' },
    { flightNo: 'MU5223', airline: '东方航空', departTime: '20:30', arriveTime: '23:20', terminal: 'T1', aircraft: 'A320', duration: '2h50m' }
  ],
  // 上海成都
  'SHA-CTU': [
    { flightNo: 'MU5401', airline: '东方航空', departTime: '07:00', arriveTime: '09:55', terminal: 'T1', aircraft: 'A330', duration: '2h55m' },
    { flightNo: 'CZ3425', airline: '南方航空', departTime: '08:30', arriveTime: '11:30', terminal: 'T2', aircraft: 'A321', duration: '3h00m' },
    { flightNo: '3U8966', airline: '四川航空', departTime: '10:00', arriveTime: '12:55', terminal: 'T1', aircraft: 'A320', duration: '2h55m' },
    { flightNo: 'MU5403', airline: '东方航空', departTime: '11:30', arriveTime: '14:25', terminal: 'T1', aircraft: 'A330', duration: '2h55m' },
    { flightNo: 'CA1942', airline: '国航', departTime: '13:00', arriveTime: '15:55', terminal: 'T2', aircraft: 'A321', duration: '2h55m' },
    { flightNo: 'CZ3427', airline: '南方航空', departTime: '14:30', arriveTime: '17:25', terminal: 'T2', aircraft: 'A321', duration: '2h55m' },
    { flightNo: 'MU5405', airline: '东方航空', departTime: '16:00', arriveTime: '18:55', terminal: 'T1', aircraft: 'A330', duration: '2h55m' },
    { flightNo: '3U8968', airline: '四川航空', departTime: '17:30', arriveTime: '20:25', terminal: 'T1', aircraft: 'A320', duration: '2h55m' },
    { flightNo: 'CA1944', airline: '国航', departTime: '19:00', arriveTime: '21:55', terminal: 'T2', aircraft: 'A321', duration: '2h55m' },
    { flightNo: 'MU5407', airline: '东方航空', departTime: '20:30', arriveTime: '23:20', terminal: 'T1', aircraft: 'A330', duration: '2h50m' }
  ],
  // 上海北京
  'SHA-PEK': [
    { flightNo: 'MU5101', airline: '东方航空', departTime: '07:00', arriveTime: '09:30', terminal: 'T1', aircraft: 'A330', duration: '2h30m' },
    { flightNo: 'CA1856', airline: '国航', departTime: '08:00', arriveTime: '10:30', terminal: 'T2', aircraft: 'A321', duration: '2h30m' },
    { flightNo: 'CZ3102', airline: '南方航空', departTime: '09:00', arriveTime: '11:30', terminal: 'T2', aircraft: 'A320', duration: '2h30m' },
    { flightNo: 'MU5103', airline: '东方航空', departTime: '10:00', arriveTime: '12:30', terminal: 'T1', aircraft: 'A330', duration: '2h30m' },
    { flightNo: 'CA1858', airline: '国航', departTime: '11:00', arriveTime: '13:30', terminal: 'T2', aircraft: 'A321', duration: '2h30m' },
    { flightNo: 'HU7602', airline: '海南航空', departTime: '12:00', arriveTime: '14:30', terminal: 'T2', aircraft: 'B737', duration: '2h30m' },
    { flightNo: 'MU5105', airline: '东方航空', departTime: '13:00', arriveTime: '15:30', terminal: 'T1', aircraft: 'A330', duration: '2h30m' },
    { flightNo: 'CZ3104', airline: '南方航空', departTime: '14:00', arriveTime: '16:30', terminal: 'T2', aircraft: 'A320', duration: '2h30m' },
    { flightNo: 'CA1860', airline: '国航', departTime: '15:00', arriveTime: '17:30', terminal: 'T2', aircraft: 'A321', duration: '2h30m' },
    { flightNo: 'MU5107', airline: '东方航空', departTime: '16:00', arriveTime: '18:30', terminal: 'T1', aircraft: 'A330', duration: '2h30m' }
  ],
  // 上海厦门
  'SHA-XMN': [
    { flightNo: 'MU5667', airline: '东方航空', departTime: '07:20', arriveTime: '09:10', terminal: 'T1', aircraft: 'A320', duration: '1h50m' },
    { flightNo: 'MF8506', airline: '厦门航空', departTime: '08:30', arriveTime: '10:15', terminal: 'T2', aircraft: 'B737', duration: '1h45m' },
    { flightNo: 'CZ3803', airline: '南方航空', departTime: '09:40', arriveTime: '11:30', terminal: 'T2', aircraft: 'A320', duration: '1h50m' },
    { flightNo: 'MU5669', airline: '东方航空', departTime: '11:00', arriveTime: '12:50', terminal: 'T1', aircraft: 'A320', duration: '1h50m' },
    { flightNo: 'MF8508', airline: '厦门航空', departTime: '12:30', arriveTime: '14:15', terminal: 'T2', aircraft: 'B737', duration: '1h45m' },
    { flightNo: 'HU7026', airline: '海南航空', departTime: '13:30', arriveTime: '15:20', terminal: 'T2', aircraft: 'B737', duration: '1h50m' },
    { flightNo: 'MU5671', airline: '东方航空', departTime: '14:40', arriveTime: '16:30', terminal: 'T1', aircraft: 'A320', duration: '1h50m' },
    { flightNo: 'MF8510', airline: '厦门航空', departTime: '16:00', arriveTime: '17:45', terminal: 'T2', aircraft: 'B737', duration: '1h45m' },
    { flightNo: 'CZ3805', airline: '南方航空', departTime: '17:20', arriveTime: '19:10', terminal: 'T2', aircraft: 'A320', duration: '1h50m' },
    { flightNo: 'MU5673', airline: '东方航空', departTime: '18:30', arriveTime: '20:20', terminal: 'T1', aircraft: 'A320', duration: '1h50m' }
  ],
  // 北京三亚
  'PEK-SYX': [
    { flightNo: 'CZ6712', airline: '南方航空', departTime: '07:30', arriveTime: '10:50', terminal: 'T3', aircraft: 'A330', duration: '3h20m' },
    { flightNo: 'HU7080', airline: '海南航空', departTime: '08:30', arriveTime: '11:55', terminal: 'T1', aircraft: 'B787', duration: '3h25m' },
    { flightNo: 'MU5352', airline: '东方航空', departTime: '09:30', arriveTime: '12:50', terminal: 'T2', aircraft: 'A330', duration: '3h20m' },
    { flightNo: 'CA1355', airline: '国航', departTime: '10:30', arriveTime: '13:50', terminal: 'T3', aircraft: 'A321', duration: '3h20m' },
    { flightNo: 'CZ6714', airline: '南方航空', departTime: '11:30', arriveTime: '14:50', terminal: 'T3', aircraft: 'A330', duration: '3h20m' },
    { flightNo: 'HU7082', airline: '海南航空', departTime: '13:00', arriveTime: '16:20', terminal: 'T1', aircraft: 'B787', duration: '3h20m' },
    { flightNo: 'MU5354', airline: '东方航空', departTime: '14:00', arriveTime: '17:20', terminal: 'T2', aircraft: 'A330', duration: '3h20m' },
    { flightNo: 'CA1357', airline: '国航', departTime: '15:00', arriveTime: '18:20', terminal: 'T3', aircraft: 'A321', duration: '3h20m' },
    { flightNo: 'CZ6716', airline: '南方航空', departTime: '16:30', arriveTime: '19:50', terminal: 'T3', aircraft: 'A330', duration: '3h20m' },
    { flightNo: 'HU7084', airline: '海南航空', departTime: '18:00', arriveTime: '21:20', terminal: 'T1', aircraft: 'B787', duration: '3h20m' }
  ],
  // 上海东京
  'SHA-TYO': [
    { flightNo: 'MU539', airline: '东方航空', departTime: '09:00', arriveTime: '12:30', terminal: 'T1', aircraft: 'A320', duration: '3h30m' },
    { flightNo: 'CA929', airline: '国航', departTime: '11:30', arriveTime: '15:00', terminal: 'T2', aircraft: 'B777', duration: '3h30m' },
    { flightNo: 'NH972', airline: '全日空', departTime: '13:00', arriveTime: '16:30', terminal: 'T2', aircraft: 'B787', duration: '3h30m' },
    { flightNo: 'MU521', airline: '东方航空', departTime: '14:30', arriveTime: '18:00', terminal: 'T1', aircraft: 'A320', duration: '3h30m' },
    { flightNo: 'JL082', airline: '日航', departTime: '16:00', arriveTime: '19:30', terminal: 'T2', aircraft: 'B787', duration: '3h30m' },
    { flightNo: 'CA931', airline: '国航', departTime: '18:00', arriveTime: '21:30', terminal: 'T2', aircraft: 'B777', duration: '3h30m' }
  ],
  // 上海大阪
  'SHA-OSA': [
    { flightNo: 'MU515', airline: '东方航空', departTime: '10:00', arriveTime: '13:00', terminal: 'T1', aircraft: 'A320', duration: '3h00m' },
    { flightNo: 'CA851', airline: '国航', departTime: '12:00', arriveTime: '15:00', terminal: 'T2', aircraft: 'B737', duration: '3h00m' },
    { flightNo: 'NH125', airline: '全日空', departTime: '14:00', arriveTime: '17:00', terminal: 'T2', aircraft: 'B787', duration: '3h00m' },
    { flightNo: 'MU217', airline: '东方航空', departTime: '16:00', arriveTime: '19:00', terminal: 'T1', aircraft: 'A320', duration: '3h00m' },
    { flightNo: 'JL203', airline: '日航', departTime: '18:00', arriveTime: '21:00', terminal: 'T2', aircraft: 'B787', duration: '3h00m' }
  ],
  // 上海首尔
  'SHA-ICN': [
    { flightNo: 'MU5081', airline: '东方航空', departTime: '08:30', arriveTime: '11:00', terminal: 'T1', aircraft: 'A320', duration: '2h30m' },
    { flightNo: 'CA401', airline: '国航', departTime: '10:00', arriveTime: '12:30', terminal: 'T2', aircraft: 'B737', duration: '2h30m' },
    { flightNo: 'OZ368', airline: '韩亚航空', departTime: '12:00', arriveTime: '14:30', terminal: 'T2', aircraft: 'A321', duration: '2h30m' },
    { flightNo: 'MU5083', airline: '东方航空', departTime: '14:00', arriveTime: '16:30', terminal: 'T1', aircraft: 'A320', duration: '2h30m' },
    { flightNo: 'KE896', airline: '大韩航空', departTime: '16:00', arriveTime: '18:30', terminal: 'T2', aircraft: 'B777', duration: '2h30m' },
    { flightNo: 'CZ301', airline: '南方航空', departTime: '18:00', arriveTime: '20:30', terminal: 'T2', aircraft: 'A321', duration: '2h30m' }
  ],
  // 上海新加坡
  'SHA-SIN': [
    { flightNo: 'MU543', airline: '东方航空', departTime: '10:00', arriveTime: '15:30', terminal: 'T1', aircraft: 'A330', duration: '5h30m' },
    { flightNo: 'CA775', airline: '国航', departTime: '12:00', arriveTime: '17:30', terminal: 'T2', aircraft: 'A330', duration: '5h30m' },
    { flightNo: 'SQ837', airline: '新航', departTime: '14:00', arriveTime: '19:30', terminal: 'T2', aircraft: 'B787', duration: '5h30m' },
    { flightNo: 'MU545', airline: '东方航空', departTime: '16:00', arriveTime: '21:30', terminal: 'T1', aircraft: 'A330', duration: '5h30m' },
    { flightNo: 'SQ841', airline: '新航', departTime: '18:00', arriveTime: '23:30', terminal: 'T2', aircraft: 'B787', duration: '5h30m' }
  ],
  // 上海曼谷
  'SHA-BKK': [
    { flightNo: 'MU983', airline: '东方航空', departTime: '11:00', arriveTime: '14:30', terminal: 'T1', aircraft: 'A330', duration: '5h30m' },
    { flightNo: 'CA825', airline: '国航', departTime: '13:00', arriveTime: '16:30', terminal: 'T2', aircraft: 'A330', duration: '5h30m' },
    { flightNo: 'VZ3521', airline: '泰国狮航', departTime: '15:00', arriveTime: '18:30', terminal: 'T1', aircraft: 'B737', duration: '5h30m' },
    { flightNo: 'MU985', airline: '东方航空', departTime: '17:00', arriveTime: '20:30', terminal: 'T1', aircraft: 'A330', duration: '5h30m' },
    { flightNo: 'SL927', airline: '泰国微笑', departTime: '19:00', arriveTime: '22:30', terminal: 'T1', aircraft: 'A320', duration: '5h30m' }
  ],
  // 上海巴黎
  'SHA-PAR': [
    { flightNo: 'MU553', airline: '东方航空', departTime: '00:30', arriveTime: '06:30', terminal: 'T1', aircraft: 'B777', duration: '12h00m' },
    { flightNo: 'CA833', airline: '国航', departTime: '01:30', arriveTime: '07:30', terminal: 'T2', aircraft: 'A330', duration: '12h00m' },
    { flightNo: 'AF111', airline: '法航', departTime: '23:30', arriveTime: '05:30+1', terminal: 'T2', aircraft: 'B777', duration: '12h00m' }
  ],
  // 上海伦敦
  'SHA-LON': [
    { flightNo: 'MU551', airline: '东方航空', departTime: '00:40', arriveTime: '05:40', terminal: 'T1', aircraft: 'B777', duration: '12h00m' },
    { flightNo: 'CA849', airline: '国航', departTime: '01:30', arriveTime: '06:30', terminal: 'T2', aircraft: 'B777', duration: '12h00m' },
    { flightNo: 'BA168', airline: '英航', departTime: '23:50', arriveTime: '04:50+1', terminal: 'T2', aircraft: 'B777', duration: '12h00m' }
  ],
  // 上海纽约
  'SHA-NYC': [
    { flightNo: 'MU587', airline: '东方航空', departTime: '11:30', arriveTime: '14:30', terminal: 'T1', aircraft: 'B777', duration: '15h00m' },
    { flightNo: 'CA981', airline: '国航', departTime: '13:00', arriveTime: '16:00', terminal: 'T2', aircraft: 'B777', duration: '15h00m' },
    { flightNo: 'UA86', airline: '美联航', departTime: '15:00', arriveTime: '18:00', terminal: 'T2', aircraft: 'B777', duration: '15h00m' }
  ]
};

/**
 * 获取航班列表
 */
function getFlights(origin, destination, date) {
  const routeKey = `${origin}-${destination}`;
  const flights = FLIGHT_DATABASE[routeKey];
  
  if (!flights) {
    // 生成随机航班数据
    return generateRandomFlights(origin, destination);
  }
  
  // 为每个航班添加日期信息和随机价格
  return flights.map((flight, index) => ({
    ...flight,
    date,
    basePrice: flight.basePrice || 800 + index * 100,
    price: (flight.basePrice || 800 + index * 100) * getRandomMultiplier(),
    availableSeats: Math.floor(Math.random() * 100) + 10
  }));
}

/**
 * 生成随机航班数据（使用真实航班号格式）
 */
function generateRandomFlights(origin, destination) {
  // 真实的中国航班号前缀
  const airlineCodes = [
    { code: 'MU', name: '东方航空' },
    { code: 'CZ', name: '南方航空' },
    { code: 'CA', name: '国航' },
    { code: 'HU', name: '海南航空' },
    { code: '3U', name: '四川航空' },
    { code: 'MF', name: '厦门航空' },
    { code: 'HO', name: '吉祥航空' },
    { code: '9C', name: '春秋航空' }
  ];
  
  const flights = [];
  
  for (let i = 0; i < 10; i++) {
    const airline = airlineCodes[i % airlineCodes.length];
    const flightNum = 5000 + i * 100 + Math.floor(Math.random() * 100); // 真实航班号格式
    const departHour = 7 + i * 2;
    const departTime = `${String(departHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    const duration = 2 + Math.floor(Math.random() * 3);
    const arriveHour = (departHour + duration) % 24;
    
    flights.push({
      flightNo: `${airline.code}${flightNum}`,
      airline: airline.name,
      departTime,
      arriveTime: `${String(arriveHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      terminal: i % 2 === 0 ? 'T1' : 'T2',
      aircraft: ['A320', 'A321', 'B737', 'A330', 'B787'][Math.floor(Math.random() * 5)],
      duration: `${duration}h${Math.floor(Math.random() * 60)}m`,
      basePrice: 600 + i * 150,
      price: (600 + i * 150) * getRandomMultiplier(),
      availableSeats: Math.floor(Math.random() * 100) + 10
    });
  }
  
  return flights;
}

/**
 * 获取随机价格乘数
 */
function getRandomMultiplier() {
  const r = Math.random();
  if (r < 0.3) return 0.8; // 便宜
  if (r < 0.6) return 0.95; // 稍便宜
  if (r < 0.85) return 1.1; // 稍贵
  return 1.3; // 贵
}

/**
 * 查找最优航班组合
 */
function findBestFlightCombination(flights, leaveCost, budget) {
  // 按总成本排序
  const withTotal = flights.map(f => ({
    ...f,
    totalCost: f.price + leaveCost
  }));
  
  withTotal.sort((a, b) => a.totalCost - b.totalCost);
  
  // 找出最优方案
  const optimal = withTotal[0];
  
  // 找出最便宜方案（不考虑请假成本）
  const cheapest = [...flights].sort((a, b) => a.price - b.price)[0];
  
  // 找出最快方案
  const fastest = [...flights].sort((a, b) => {
    const aTime = parseInt(a.duration);
    const bTime = parseInt(b.duration);
    return aTime - bTime;
  })[0];
  
  return {
    optimal: {
      ...optimal,
      reason: '总成本最优'
    },
    cheapest: {
      ...cheapest,
      price: cheapest.price,
      totalCost: cheapest.price + leaveCost,
      reason: '机票最便宜'
    },
    fastest: {
      ...fastest,
      price: fastest.price,
      totalCost: fastest.price + leaveCost,
      reason: '飞行时间最短'
    },
    all: withTotal.slice(0, 10)
  };
}

module.exports = {
  FLIGHT_DATABASE,
  getFlights,
  findBestFlightCombination
};
