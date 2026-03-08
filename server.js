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
  'BKK': { name: '曼谷', flag: '🇹🇭', visa: '落地签', time: '3小时', airport: 'BKK' },
  'SGN': { name: '胡志明', flag: '🇻🇳', visa: '电子签', time: '3小时', airport: 'SGN' },
  'MNL': { name: '马尼拉', flag: '🇵🇭', visa: '免签', time: '2.5小时', airport: 'MNL' },
  'KUL': { name: '吉隆坡', flag: '🇲🇾', visa: '免签', time: '4小时', airport: 'KUL' },
  'SIN': { name: '新加坡', flag: '🇸🇬', visa: '免签', time: '4小时', airport: 'SIN' },
  'DPS': { name: '巴厘岛', flag: '🇮🇩', visa: '落地签', time: '4小时', airport: 'DPS' },
  'HKT': { name: '普吉岛', flag: '🇹🇭', visa: '落地签', time: '3.5小时', airport: 'HKT' },
  'CNX': { name: '清迈', flag: '🇹🇭', visa: '落地签', time: '3小时', airport: 'CNX' },
  'HAN': { name: '河内', flag: '🇻🇳', visa: '电子签', time: '2.5小时', airport: 'HAN' },
  'DAD': { name: '岘港', flag: '🇻🇳', visa: '电子签', time: '2.5小时', airport: 'DAD' }
};

const airlineNames = {
  'CX': '国泰航空', 'HX': '香港航空', 'AK': '亚洲航空', 'FD': '亚洲航空', 
  'VN': '越南航空', 'PR': '菲律宾航空', 'MH': '马航', 'SL': '狮航',
  'BR': '长荣航空', 'CI': '中华航空', 'UO': 'HK Express', 'Z2': '宿务航空',
  'TG': '泰航', 'VA': '维珍澳洲', 'BL': '越捷航空', 'NJ': '皇雀航空'
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
    
    console.log(`搜索航班: ${origin} -> ${destCode}, 日期: ${date}`);
    
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destCode,
      departureDate: date,
      returnDate: returnDate || '',
      adults: '1',
      max: '10'
    });
    
    const flights = response.data.map((offer, i) => {
      const segments = offer.itineraries[0].segments;
      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];
      
      // 获取航班号
      const flightNumber = firstSeg.number;
      const carrier = firstSeg.carrierCode;
      
      return {
        id: i + 1,
        airline: carrier,
        flightNumber: `${carrier}${flightNumber}`,
        airlineName: airlineNames[carrier] || carrier,
        departTime: firstSeg.departure.at.substring(11, 16),
        arriveTime: lastSeg.arrival.at.substring(11, 16),
        departAirport: firstSeg.departure.iataCode,
        arriveAirport: lastSeg.arrival.iataCode,
        duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
        price: parseFloat(offer.price.total).toFixed(0),
        currency: offer.price.currency,
        stops: segments.length - 1,
        cabin: offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'Economy'
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

// 搜索酒店 - 尝试使用真实API
app.post('/api/search-hotels', async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests } = req.body;
    const cityCode = cityCodes[city] || city.toUpperCase();
    const destInfo = destinations[cityCode];
    
    console.log(`搜索酒店: ${city} (${cityCode}), 入住: ${checkIn}, 退房: ${checkOut}`);
    
    // 尝试使用 Amadeus Hotel Offers Search API
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: cityCode,
      checkInDate: checkIn.replace(/-/g, ''),
      checkOutDate: checkOut.replace(/-/g, ''),
      adults: guests || '1',
      roomQuantity: '1',
      max: '10',
      currency: 'CNY'
    });
    
    if (response.data && response.data.length > 0) {
      const hotels = response.data.map((offer, i) => {
        const hotel = offer.hotel;
        const price = offer.offers?.[0]?.price?.total || offer.offers?.[0]?.price?.base || 0;
        return {
          id: i + 1,
          name: hotel.name || city,
          rating: hotel.rating?.toFixed(1) || '4.0',
          price: parseFloat(price).toFixed(0),
          currency: offer.offers?.[0]?.price?.currency || 'CNY',
          amenities: offer.offers?.[0]?.room?.amenities?.map(a => a.text)?.slice(0, 4) || ['WiFi', '早餐'],
          address: hotel.address?.lines?.[0] || '',
          hotelId: hotel.hotelId
        };
      });
      
      res.json({ success: true, hotels: hotels.slice(0, 6), isMock: false });
    } else {
      throw new Error('No hotels found');
    }
  } catch (error) {
    console.error('酒店搜索失败:', error.message);
    // 尝试备用方法：使用 Hotel Offers By Hotel ID
    try {
      const hotelIds = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode: cityCodes[city] || city.toUpperCase(),
        radius: '50',
        radiusUnit: 'KM',
        hotelSource: 'ALL'
      });
      
      if (hotelIds.data && hotelIds.data.length > 0) {
        const firstHotel = hotelIds.data[0];
        const hotelOffers = await amadeus.shopping.hotelOffers.get({
          hotelIds: firstHotel.hotelId,
          checkInDate: checkIn.replace(/-/g, ''),
          checkOutDate: checkOut.replace(/-/g, ''),
          adults: '1',
          currency: 'CNY'
        });
        
        if (hotelOffers.data && hotelOffers.data.length > 0) {
          const hotels = hotelOffers.data.map((offer, i) => ({
            id: i + 1,
            name: offer.hotel?.name || city,
            rating: offer.hotel?.rating?.toFixed(1) || '4.0',
            price: parseFloat(offer.offers?.[0]?.price?.total || 0).toFixed(0),
            currency: offer.offers?.[0]?.price?.currency || 'CNY',
            amenities: offer.offers?.[0]?.room?.amenities?.map(a => a.text)?.slice(0, 4) || ['WiFi', '早餐'],
            hotelId: offer.hotel?.hotelId
          }));
          res.json({ success: true, hotels: hotels.slice(0, 6), isMock: false });
          return;
        }
      }
    } catch (e) {
      console.error('备用酒店搜索也失败:', e.message);
    }
    
    // 返回模拟数据
    const hotels = generateMockHotels(destinations[cityCodes[city]]?.name || city);
    res.json({ success: true, hotels, isMock: true });
  }
});

function generateMockFlights() {
  const airlines = ['CX', 'HX', 'AK', 'FD', 'VN', 'PR', 'MH', 'SL', 'TG', 'BL'];
  const fromCode = 'HKG';
  const toCode = 'BKK';
  
  return airlines.slice(0, 8).map((airline, i) => {
    const departHour = 6 + i * 2;
    const departMin = Math.floor(Math.random() * 60);
    return {
      id: i + 1,
      airline: airline,
      flightNumber: `${airline}${100 + Math.floor(Math.random() * 900)}`,
      airlineName: airlineNames[airline] || airline,
      departTime: `${departHour}:${departMin.toString().padStart(2, '0')}`,
      arriveTime: `${(departHour + 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      departAirport: fromCode,
      arriveAirport: toCode,
      duration: '3h',
      price: 800 + Math.floor(Math.random() * 500),
      currency: 'CNY',
      stops: Math.random() > 0.5 ? 0 : 1,
      cabin: 'Economy'
    };
  }).sort((a, b) => a.price - b.price);
}

function generateMockHotels(city) {
  const names = [
    `${city}香格里拉大酒店`,
    `${city}铂尔曼酒店`,
    `${city}喜来登酒店`,
    `${city}万豪酒店`,
    `${city}希尔顿酒店`,
    `${city}洲际酒店`
  ];
  return names.map((name, i) => ({
    id: i + 1,
    name,
    rating: (4 + Math.random()).toFixed(1),
    price: 400 + Math.floor(Math.random() * 600),
    currency: 'CNY',
    amenities: ['WiFi', '早餐', '泳池', '健身房'].slice(0, 2 + Math.floor(Math.random() * 3)),
    address: `${city}市中心`
  }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
