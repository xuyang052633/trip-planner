const express = require('express');
const Amadeus = require('amadeus');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Amadeus API 配置 (新版本SDK格式)
const amadeus = new Amadeus({
  clientId: 'wGg4kJInX69GG9hDzqPJqvVxckj1UJuN',
  clientSecret: 'rwRLydIN4a7frbuU'
});

// 城市代码映射
const cityCodes = {
  '深圳': 'SZX',
  '香港': 'HKG',
  '澳门': 'MFM',
  '广州': 'CAN',
  '曼谷': 'BKK',
  '胡志明': 'SGN',
  '马尼拉': 'MNL',
  '吉隆坡': 'KUL',
  '新加坡': 'SIN',
  '巴厘岛': 'DPS',
  '普吉岛': 'HKT',
  '清迈': 'CNX',
  '河内': 'HAN',
  '岘港': 'DAD',
  '宿务': 'CEB'
};

// 目的地信息
const destinations = {
  'BKK': { name: '曼谷', country: '泰国', flag: '🇹🇭', visa: '落地签', time: '3小时' },
  'SGN': { name: '胡志明', country: '越南', flag: '🇻🇳', visa: '电子签', time: '3小时' },
  'MNL': { name: '马尼拉', country: '菲律宾', flag: '🇵🇭', visa: '免签', time: '2.5小时' },
  'KUL': { name: '吉隆坡', country: '马来西亚', flag: '🇲🇾', visa: '免签', time: '4小时' },
  'SIN': { name: '新加坡', country: '新加坡', flag: '🇸🇬', visa: '免签', time: '4小时' },
  'DPS': { name: '巴厘岛', country: '印尼', flag: '🇮🇩', visa: '落地签', time: '4小时' },
  'HKT': { name: '普吉岛', country: '泰国', flag: '🇹🇭', visa: '落地签', time: '3.5小时' },
  'CNX': { name: '清迈', country: '泰国', flag: '🇹🇭', visa: '落地签', time: '3小时' },
  'HAN': { name: '河内', country: '越南', flag: '🇻🇳', visa: '电子签', time: '2.5小时' },
  'DAD': { name: '岘港', country: '越南', flag: '🇻🇳', visa: '电子签', time: '2.5小时' },
  'CEB': { name: '宿务', country: '菲律宾', flag: '🇵🇭', visa: '免签', time: '3小时' }
};

// 搜索机票
app.post('/api/search-flights', async (req, res) => {
  try {
    const { fromCity, toCity, date, returnDate } = req.body;
    
    const origin = cityCodes[fromCity] || fromCity.toUpperCase();
    const destination = cityCodes[toCity] || toCity.toUpperCase();
    
    console.log(`搜索航班: ${origin} -> ${destination}, 日期: ${date}`);
    
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      returnDate: returnDate || '',
      adults: '1',
      max: '5'
    });
    
    // 解析航班数据
    const flights = response.data.map((offer, index) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
      const price = offer.price.total;
      const currency = offer.price.currency;
      
      return {
        id: index + 1,
        airline: firstSegment.carrierCode,
        departTime: firstSegment.departure.at.substring(11, 16),
        arriveTime: lastSegment.arrival.at.substring(11, 16),
        duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
        price: parseFloat(price).toFixed(0),
        currency: currency,
        stops: offer.itineraries[0].segments.length - 1,
        cabin: offer.travelerPricings[0].fareDetailsBySegment[0].cabin
      };
    });
    
    res.json({ success: true, flights });
  } catch (error) {
    console.error('航班搜索错误:', error.response?.data || error.message);
    
    // 如果API失败，返回模拟数据
    res.json({ 
      success: true, 
      flights: generateMockFlights(fromCity, toCity),
      isMock: true 
    });
  }
});

// 搜索酒店
app.post('/api/search-hotels', async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests } = req.body;
    
    const cityCode = cityCodes[city] || city.toUpperCase();
    const destInfo = destinations[cityCode];
    const destName = destInfo?.name || city;
    
    console.log(`搜索酒店: ${city}, 入住: ${checkIn}, 退房: ${checkOut}`);
    
    // 简化处理，返回模拟数据（Amadeus酒店API需要更多配置）
    const hotels = generateMockHotels(destName);
    
    res.json({ success: true, hotels });
  } catch (error) {
    console.error('酒店搜索错误:', error.response?.data || error.message);
    
    const cityCode = cityCodes[city] || city.toUpperCase();
    const destInfo = destinations[cityCode];
    const destName = destInfo?.name || city;
    
    res.json({ 
      success: true, 
      hotels: generateMockHotels(destName),
      isMock: true 
    });
  }
});

// 获取目的地列表
app.get('/api/destinations', (req, res) => {
  const destList = Object.entries(destinations).map(([code, info]) => ({
    code,
    ...info,
    basePrice: Math.floor(Math.random() * 500 + 800)
  }));
  res.json(destList);
});

// 计算请假成本
app.post('/api/calculate-salary', (req, res) => {
  const { dailySalary, workHours, leaveDays, amHours, pmHours } = req.body;
  
  const hourlyRate = dailySalary / workHours;
  const amCost = (amHours || 4) * hourlyRate;
  const pmCost = (pmHours || 4) * hourlyRate;
  const fullDayCost = (amCost + pmCost);
  const totalCost = fullDayCost * (leaveDays || 1);
  
  res.json({
    hourlyRate: hourlyRate.toFixed(0),
    amCost: amCost.toFixed(0),
    pmCost: pmCost.toFixed(0),
    fullDayCost: fullDayCost.toFixed(0),
    totalCost: totalCost.toFixed(0)
  });
});

// 生成模拟航班数据
function generateMockFlights(from, to) {
  const airlines = ['CX', 'HX', 'AK', 'FD', 'VN', 'PR', 'MH', 'SL'];
  const flights = [];
  
  for (let i = 0; i < 5; i++) {
    const basePrice = 800 + Math.floor(Math.random() * 600);
    const departHour = 6 + Math.floor(Math.random() * 14);
    const duration = 2.5 + Math.random() * 2;
    
    flights.push({
      id: i + 1,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departTime: `${departHour.toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}`,
      arriveTime: `${(departHour + duration).toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}`,
      duration: `${Math.floor(duration)}h${Math.round((duration % 1) * 60)}m`,
      price: basePrice,
      currency: 'CNY',
      stops: Math.random() > 0.6 ? 1 : 0,
      cabin: 'Economy'
    });
  }
  
  return flights.sort((a, b) => a.price - b.price);
}

// 生成模拟酒店数据
function generateMockHotels(city) {
  const hotelNames = [
    `${city}中心大酒店`,
    `${city}铂尔曼酒店`,
    `${city}香格里拉`,
    `${city}万豪酒店`,
    `${city}喜来登`,
    `${city}希尔顿`,
    `${city}宜必思`,
    `${city}精品民宿`
  ];
  
  const hotels = hotelNames.map((name, i) => ({
    id: i + 1,
    name: name,
    rating: (4 + Math.random()).toFixed(1),
    price: Math.floor(300 + Math.random() * 700),
    currency: 'CNY',
    amenities: ['WiFi', '早餐', '泳池', '健身房'].slice(0, 2 + Math.floor(Math.random() * 3)),
    image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`
  }));
  
  return hotels.sort((a, b) => a.price - b.price);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 旅游规划助手运行在 http://localhost:${PORT}`);
});
