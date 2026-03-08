const express = require('express');
const Amadeus = require('amadeus');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Amadeus API 配置
const amadeus = new Amadeus({
  clientId: 'wGg4kJInX69GG9hDzqPJqvVxckj1UJuN',
  clientSecret: 'rwRLydIN4a7frbuU'
});

// 城市代码映射
const cityCodes = {
  '深圳': 'SZX', '香港': 'HKG', '澳门': 'MFM', '广州': 'CAN',
  '曼谷': 'BKK', '胡志明': 'SGN', '马尼拉': 'MNL', '吉隆坡': 'KUL',
  '新加坡': 'SIN', '巴厘岛': 'DPS', '普吉岛': 'HKT', '清迈': 'CNX',
  '河内': 'HAN', '岘港': 'DAD', '宿务': 'CEB'
};

// 目的地信息
const destinations = {
  'BKK': { name: '曼谷', flag: '🇹🇭', visa: '落地签', time: '3小时' },
  'SGN': { name: '胡志明', flag: '🇻🇳', visa: '电子签', time: '3小时' },
  'MNL': { name: '马尼拉', flag: '🇵🇭', visa: '免签', time: '2.5小时' },
  'KUL': { name: '吉隆坡', flag: '🇲🇾', visa: '免签', time: '4小时' },
  'SIN': { name: '新加坡', flag: '🇸🇬', visa: '免签', time: '4小时' },
  'DPS': { name: '巴厘岛', flag: '🇮🇩', visa: '落地签', time: '4小时' },
  'HKT': { name: '普吉岛', flag: '🇹🇭', visa: '落地签', time: '3.5小时' },
  'CNX': { name: '清迈', flag: '🇹🇭', visa: '落地签', time: '3小时' },
  'HAN': { name: '河内', flag: '🇻🇳', visa: '电子签', time: '2.5小时' },
  'DAD': { name: '岘港', flag: '🇻🇳', visa: '电子签', time: '2.5小时' },
  'CEB': { name: '宿务', flag: '🇵🇭', visa: '免签', time: '3小时' }
};

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 获取目的地列表
app.get('/api/destinations', (req, res) => {
  const list = Object.entries(destinations).map(([code, info]) => ({
    code, ...info, price: Math.floor(Math.random() * 400 + 800)
  }));
  res.json(list);
});

// 搜索机票
app.post('/api/search-flights', async (req, res) => {
  try {
    const { fromCity, toCity, date, returnDate } = req.body;
    const origin = cityCodes[fromCity] || fromCity.toUpperCase();
    const destCode = Object.entries(destinations).find(([k, v]) => v.name === toCity)?.[0] || toCity.toUpperCase();
    
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destCode,
      departureDate: date,
      returnDate: returnDate || '',
      adults: '1',
      max: '5'
    });
    
    const flights = response.data.map((offer, i) => {
      const seg = offer.itineraries[0].segments[0];
      const lastSeg = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
      return {
        id: i + 1,
        airline: seg.carrierCode,
        departTime: seg.departure.at.substring(11, 16),
        arriveTime: lastSeg.arrival.at.substring(11, 16),
        duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
        price: parseFloat(offer.price.total).toFixed(0),
        currency: offer.price.currency,
        stops: offer.itineraries[0].segments.length - 1
      };
    });
    
    res.json({ success: true, flights });
  } catch (error) {
    console.error('航班搜索失败:', error.message);
    // 返回模拟数据
    const mockFlights = generateMockFlights();
    res.json({ success: true, flights: mockFlights, isMock: true });
  }
});

// 搜索酒店
app.post('/api/search-hotels', async (req, res) => {
  const { city } = req.body;
  const hotels = generateMockHotels(destinations[cityCodes[city]]?.name || city);
  res.json({ success: true, hotels, isMock: true });
});

function generateMockFlights() {
  const airlines = ['CX', 'HX', 'AK', 'FD', 'VN', 'PR', 'MH'];
  return airlines.slice(0, 5).map((airline, i) => ({
    id: i + 1,
    airline,
    departTime: `${6 + i * 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    arriveTime: `${9 + i * 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    duration: '3h',
    price: 800 + Math.floor(Math.random() * 500),
    currency: 'CNY',
    stops: Math.random() > 0.5 ? 0 : 1
  })).sort((a, b) => a.price - b.price);
}

function generateMockHotels(city) {
  const names = [`${city}中心大酒店`, `${city}铂尔曼`, `${city}香格里拉`, `${city}万豪`, `${city}希尔顿`];
  return names.map((name, i) => ({
    id: i + 1,
    name,
    rating: (4 + Math.random()).toFixed(1),
    price: 300 + Math.floor(Math.random() * 500),
    currency: 'CNY',
    amenities: ['WiFi', '早餐', '泳池'].slice(0, 2 + Math.floor(Math.random() * 2))
  })).sort((a, b) => a.price - b.price);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
