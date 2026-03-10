/**
 * Amadeus 航班搜索服务 - 直接调用 REST API
 */
const axios = require('axios');

const AMADEUS_CONFIG = {
  apiKey: process.env.AMADEUS_API_KEY || 'wGg4kJInX69GG9hDzqPJqvVxckj1UJuN',
  apiSecret: process.env.AMADEUS_API_SECRET || 'rwRLydIN4a7frbuU',
  baseUrl: 'https://test.api.amadeus.com'
};

let accessToken = null;
let tokenExpiry = null;

/**
 * 获取 Access Token
 */
async function getAccessToken() {
  // 检查现有 token 是否有效
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }
  
  try {
    const response = await axios.post(
      `${AMADEUS_CONFIG.baseUrl}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CONFIG.apiKey,
        client_secret: AMADEUS_CONFIG.apiSecret
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    accessToken = response.data.access_token;
    // 提前5分钟过期
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
    
    console.log('✅ Amadeus Token 获取成功');
    return accessToken;
  } catch (error) {
    console.error('❌ Amadeus Token 获取失败:', error.response?.data || error.message);
    throw error;
  }
}

// 机场代码映射
const AIRPORT_MAP = {
  'SHA': 'PVG',  // 上海浦东
  'PVG': 'PVG',
  'PEK': 'PEK',
  'CAN': 'CAN',
  'SZX': 'SZX',
  'CTU': 'CTU',
  'HGH': 'HGH',
  'SYX': 'SYX',
  'XMN': 'XMN',
  'KMG': 'KMG',
  'DLC': 'DLC',
  'CKG': 'CKG',
  'XIY': 'SIA',
  'NKG': 'NKG',
  'TYO': 'TYO',
  'OSA': 'KIX',
  'ICN': 'ICN',
  'BKK': 'BKK',
  'SIN': 'SIN',
  'NYC': 'JFK',
  'LON': 'LHR',
  'PAR': 'CDG'
};

/**
 * 搜索航班
 */
async function searchFlights(origin, destination, date, adults = 1) {
  try {
    const token = await getAccessToken();
    const originCode = AIRPORT_MAP[origin] || origin;
    const destCode = AIRPORT_MAP[destination] || destination;
    
    console.log(`🔍 Amadeus 搜索: ${originCode} → ${destCode}, ${date}`);
    
    const response = await axios.get(
      `${AMADEUS_CONFIG.baseUrl}/v2/shopping/flight-offers`,
      {
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destCode,
          departureDate: date,
          adults: adults,
          max: 20
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return parseAmadeusFlights(response.data, originCode, destCode, date);
  } catch (error) {
    console.error('❌ Amadeus API 错误:', error.response?.data?.errors?.[0]?.detail || error.message);
    return [];
  }
}

/**
 * 解析 Amadeus 返回的航班数据
 */
function parseAmadeusFlights(data, origin, destination, date) {
  if (!data || !data.data || data.data.length === 0) {
    return [];
  }
  
  return data.data.map((offer) => {
    const firstSegment = offer.itineraries[0].segments[0];
    const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
    
    const airlineCode = firstSegment.carrierCode;
    
    // 计算飞行时长
    const durationStr = offer.itineraries[0].duration.replace('PT', '').toLowerCase();
    
    // 价格
    const price = Math.round(parseFloat(offer.price.total));
    const currency = offer.price.currency;
    
    // 中转信息
    const stops = offer.itineraries[0].segments.length - 1;
    
    return {
      flightNo: `${airlineCode}${firstSegment.number}`,
      airline: getAirlineName(airlineCode),
      airlineCode: airlineCode,
      departTime: firstSegment.departure.at.substring(11, 16),
      arriveTime: lastSegment.arrival.at.substring(11, 16),
      departureAirport: firstSegment.departure.iataCode,
      arrivalAirport: lastSegment.arrival.iataCode,
      terminal: firstSegment.departure.terminal || 'T1',
      duration: durationStr,
      stops: stops,
      isDirect: stops === 0,
      price: price,
      currency: currency,
      cabin: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
      availableSeats: offer.numberOfBookableSeats || Math.floor(Math.random() * 50) + 10,
      date: date,
      raw: offer
    };
  });
}

/**
 * 获取航空公司名称
 */
function getAirlineName(code) {
  const airlines = {
    'MU': '东方航空',
    'CZ': '南方航空',
    'CA': '国航',
    'HU': '海南航空',
    '3U': '四川航空',
    'MF': '厦门航空',
    'HO': '吉祥航空',
    '9C': '春秋航空',
    'NH': '全日空',
    'JL': '日航',
    'KE': '大韩航空',
    'OZ': '韩亚航空',
    'SQ': '新加坡航空',
    'TG': '泰国航空',
    'EK': '阿联酋航空',
    'QR': '卡塔尔航空',
    'BA': '英航',
    'AF': '法航',
    'LH': '汉莎航空',
    'UA': '美联航',
    'AA': '美国航空',
    'DL': '达美航空',
    'CX': '国泰航空',
    'HX': '香港航空'
  };
  return airlines[code] || code;
}

/**
 * 搜索往返航班
 */
async function searchRoundTrip(origin, destination, departureDate, returnDate, adults = 1) {
  try {
    const [outbound, returning] = await Promise.all([
      searchFlights(origin, destination, departureDate, adults),
      searchFlights(destination, origin, returnDate, adults)
    ]);
    
    return { outbound, returning };
  } catch (error) {
    console.error('❌ 往返搜索错误:', error.message);
    return { outbound: [], returning: [] };
  }
}

module.exports = {
  searchFlights,
  searchRoundTrip,
  getAirlineName
};
