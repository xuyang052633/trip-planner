/**
 * 目的地数据 - 热门旅游目的地信息（国内+国外）
 */
const DESTINATIONS = [
  // ====== 国内热门 ======
  { code: 'SYX', name: '三亚', city: '三亚', country: '国内', category: '海岛', popularity: 95, avgPrice: 1200, bestSeason: '10-04', tags: ['海滩', '度假', '潜水'] },
  { code: 'CTU', name: '成都', city: '成都', country: '国内', category: '城市', popularity: 90, avgPrice: 800, bestSeason: '03-05', tags: ['美食', '熊猫', '文化'] },
  { code: 'PEK', name: '北京', city: '北京', country: '国内', category: '城市', popularity: 92, avgPrice: 900, bestSeason: '09-10', tags: ['历史', '故宫', '美食'] },
  { code: 'SHA', name: '上海', city: '上海', country: '国内', category: '城市', popularity: 88, avgPrice: 850, bestSeason: '04-05', tags: ['都市', '夜景', '购物'] },
  { code: 'SZX', name: '深圳', city: '深圳', country: '国内', category: '城市', popularity: 75, avgPrice: 700, bestSeason: '10-12', tags: ['都市', '主题乐园', '科技'] },
  { code: 'CAN', name: '广州', city: '广州', country: '国内', category: '城市', popularity: 80, avgPrice: 650, bestSeason: '11-01', tags: ['美食', '商贸', '历史'] },
  { code: 'HGH', name: '杭州', city: '杭州', country: '国内', category: '风景', popularity: 85, avgPrice: 700, bestSeason: '03-04', tags: ['西湖', '自然', '休闲'] },
  { code: 'XMN', name: '厦门', city: '厦门', country: '国内', category: '海岛', popularity: 88, avgPrice: 750, bestSeason: '10-12', tags: ['鼓浪屿', '海滩', '美食'] },
  { code: 'KMG', name: '昆明', city: '昆明', country: '国内', category: '风景', popularity: 78, avgPrice: 600, bestSeason: '03-05', tags: ['春城', '花卉', '民族'] },
  { code: 'DLC', name: '大连', city: '大连', country: '国内', category: '海滨', popularity: 72, avgPrice: 650, bestSeason: '07-09', tags: ['海滨', '广场', '时尚'] },
  { code: 'LXA', name: '拉萨', city: '拉萨', country: '国内', category: '高原', popularity: 82, avgPrice: 1500, bestSeason: '05-10', tags: ['高原', '宗教', '风景'] },
  { code: 'URC', name: '乌鲁木齐', city: '乌鲁木齐', country: '国内', category: '西域', popularity: 70, avgPrice: 1100, bestSeason: '06-09', tags: ['天山', '烤肉', '异域'] },
  { code: 'HRB', name: '哈尔滨', city: '哈尔滨', country: '国内', category: '冰雪', popularity: 76, avgPrice: 800, bestSeason: '11-02', tags: ['冰雪', '索菲亚', '美食'] },
  { code: 'CKG', name: '重庆', city: '重庆', country: '国内', category: '城市', popularity: 86, avgPrice: 700, bestSeason: '03-05', tags: ['火锅', '夜景', '魔幻'] },
  { code: 'TFU', name: '大理', city: '大理', country: '国内', category: '风景', popularity: 84, avgPrice: 550, bestSeason: '04-05', tags: ['古城', '洱海', '文艺'] },
  { code: 'JZH', name: '九寨沟', city: '九寨沟', country: '国内', category: '风景', popularity: 83, avgPrice: 900, bestSeason: '10-11', tags: ['彩池', '秋色', '自然'] },
  { code: 'NKG', name: '南京', city: '南京', country: '国内', category: '历史', popularity: 79, avgPrice: 650, bestSeason: '03-04', tags: ['古城', '美食', '文化'] },
  { code: 'TSN', name: '天津', city: '天津', country: '国内', category: '城市', popularity: 65, avgPrice: 500, bestSeason: '04-05', tags: ['近代', '美食', '建筑'] },
  { code: 'SHE', name: '沈阳', city: '沈阳', country: '国内', category: '城市', popularity: 66, avgPrice: 550, bestSeason: '06-09', tags: ['故宫', '美食', '工业'] },
  { code: 'WHH', name: '武汉', city: '武汉', country: '国内', category: '城市', popularity: 70, avgPrice: 550, bestSeason: '03-04', tags: ['樱花', '美食', '长江'] },
  { code: 'XIY', name: '西安', city: '西安', country: '国内', category: '历史', popularity: 88, avgPrice: 750, bestSeason: '03-05', tags: ['兵马俑', '古城', '美食'] },
  { code: 'ZUH', name: '珠海', city: '珠海', country: '国内', category: '海滨', popularity: 72, avgPrice: 600, bestSeason: '10-12', tags: ['海岸', '温泉', '休闲'] },
  
  // ====== 国外热门 ======
  { code: 'TYO', name: '东京', city: '东京', country: '日本', category: '城市', popularity: 95, avgPrice: 3500, bestSeason: '03-05', tags: ['购物', '美食', '科技'] },
  { code: 'OSA', name: '大阪', city: '大阪', country: '日本', category: '城市', popularity: 92, avgPrice: 3200, bestSeason: '03-04', tags: ['美食', '购物', '动漫'] },
  { code: 'NGO', name: '名古屋', city: '名古屋', country: '日本', category: '城市', popularity: 78, avgPrice: 2800, bestSeason: '03-05', tags: ['工业', '美食', '历史'] },
  { code: 'ICN', name: '首尔', city: '首尔', country: '韩国', category: '城市', popularity: 90, avgPrice: 3000, bestSeason: '03-05', tags: ['购物', '美食', 'K-POP'] },
  { code: 'CJU', name: '济州岛', city: '济州岛', country: '韩国', category: '海岛', popularity: 85, avgPrice: 2800, bestSeason: '04-06', tags: ['海岛', '自然', '免税'] },
  { code: 'BKK', name: '曼谷', city: '曼谷', country: '泰国', category: '城市', popularity: 93, avgPrice: 2500, bestSeason: '11-02', tags: ['佛寺', '美食', '夜市'] },
  { code: 'HKT', name: '普吉', city: '普吉岛', country: '泰国', category: '海岛', popularity: 88, avgPrice: 2800, bestSeason: '11-03', tags: ['海滩', '潜水', '度假'] },
  { code: 'CNX', name: '清迈', city: '清迈', country: '泰国', category: '城市', popularity: 82, avgPrice: 2200, bestSeason: '11-02', tags: ['古城', '寺庙', '休闲'] },
  { code: 'SIN', name: '新加坡', city: '新加坡', country: '新加坡', category: '城市', popularity: 94, avgPrice: 4000, bestSeason: '02-04', tags: ['花园', '美食', '购物'] },
  { code: 'KUL', name: '吉隆坡', city: '吉隆坡', country: '马来西亚', category: '城市', popularity: 80, avgPrice: 2200, bestSeason: '06-09', tags: ['双塔', '美食', '多元'] },
  { code: 'SGN', name: '胡志明', city: '胡胡志明市', country: '越南', category: '城市', popularity: 78, avgPrice: 2000, bestSeason: '11-02', tags: ['法式', '美食', '摩托'] },
  { code: 'HAN', name: '河内', city: '河内', country: '越南', category: '城市', popularity: 75, avgPrice: 1800, bestSeason: '10-12', tags: ['古城', '美食', '历史'] },
  { code: 'MNL', name: '马尼拉', city: '马尼拉', country: '菲律宾', category: '城市', popularity: 72, avgPrice: 2000, bestSeason: '11-04', tags: ['海岛', '购物', '殖民'] },
  { code: 'CEB', name: '宿务', city: '宿务', country: '菲律宾', category: '海岛', popularity: 80, avgPrice: 2200, bestSeason: '03-05', tags: ['海滩', '潜水', '鲸鲨'] },
  { code: 'NYC', name: '纽约', city: '纽约', country: '美国', category: '城市', popularity: 96, avgPrice: 8000, bestSeason: '04-06', tags: ['都市', '自由女神', '百老汇'] },
  { code: 'LAX', name: '洛杉矶', city: '洛杉矶', country: '美国', category: '城市', popularity: 94, avgPrice: 7500, bestSeason: '06-08', tags: ['好莱坞', '海滩', '迪士尼'] },
  { code: 'SFO', name: '旧金山', city: '旧金山', country: '美国', category: '城市', popularity: 88, avgPrice: 7000, bestSeason: '09-11', tags: ['金门', '科技', '美食'] },
  { code: 'LON', name: '伦敦', city: '伦敦', country: '英国', category: '城市', popularity: 93, avgPrice: 7500, bestSeason: '05-07', tags: ['大本钟', '博物馆', '皇室'] },
  { code: 'PAR', name: '巴黎', city: '巴黎', country: '法国', category: '城市', popularity: 95, avgPrice: 8000, bestSeason: '04-06', tags: ['埃菲尔', '艺术', '时尚'] },
  { code: 'BER', name: '柏林', city: '柏林', country: '德国', category: '城市', popularity: 82, avgPrice: 6000, bestSeason: '06-09', tags: ['历史', '艺术', '啤酒'] },
  { code: 'ROM', name: '罗马', city: '罗马', country: '意大利', category: '城市', popularity: 90, avgPrice: 6500, bestSeason: '04-06', tags: ['斗兽场', '梵蒂冈', '美食'] },
  { code: 'BCN', name: '巴塞罗那', city: '巴塞罗那', country: '西班牙', category: '城市', popularity: 88, avgPrice: 6000, bestSeason: '05-07', tags: ['高迪', '海滩', '足球'] },
  { code: 'AMS', name: '阿姆斯特丹', city: '阿姆斯特丹', country: '荷兰', category: '城市', popularity: 80, avgPrice: 5500, bestSeason: '04-09', tags: ['运河', '郁金香', '自由'] },
  { code: 'SYD', name: '悉尼', city: '悉尼', country: '澳大利亚', category: '城市', popularity: 90, avgPrice: 7000, bestSeason: '09-11', tags: ['歌剧院', '海港', '自然'] },
  { code: 'MEL', name: '墨尔本', city: '墨尔本', country: '澳大利亚', category: '城市', popularity: 86, avgPrice: 6500, bestSeason: '11-02', tags: ['艺术', '咖啡', '体育'] },
  { code: 'AKL', name: '奥克兰', city: '奥克兰', country: '新西兰', category: '城市', popularity: 82, avgPrice: 7500, bestSeason: '12-02', tags: ['自然', '户外', '中土'] },
  { code: 'HKG', name: '香港', city: '香港', country: '中国港澳', category: '城市', popularity: 92, avgPrice: 2500, bestSeason: '10-12', tags: ['购物', '美食', '夜景'] },
  { code: 'MFM', name: '澳门', city: '澳门', country: '中国港澳', category: '城市', popularity: 85, avgPrice: 2000, bestSeason: '10-12', tags: ['赌场', '美食', '历史'] },
  { code: 'TPE', name: '台北', city: '台北', country: '台湾', category: '城市', popularity: 88, avgPrice: 2800, bestSeason: '03-05', tags: ['夜市', '故宫', '温泉'] },
  { code: 'KHH', name: '高雄', city: '高雄', country: '台湾', category: '城市', popularity: 80, avgPrice: 2500, bestSeason: '10-12', tags: ['港都', '美食', '捷运'] },
  { code: 'DXB', name: '迪拜', city: '迪拜', country: '阿联酋', category: '城市', popularity: 90, avgPrice: 5500, bestSeason: '11-03', tags: ['帆船', '购物', '沙漠'] },
  { code: 'DOH', name: '多哈', city: '多哈', country: '卡塔尔', category: '城市', popularity: 75, avgPrice: 5000, bestSeason: '11-03', tags: ['珍珠', '沙漠', '艺术'] },
  { code: 'IST', name: '伊斯坦布尔', city: '伊斯坦布尔', country: '土耳其', category: '城市', popularity: 88, avgPrice: 4500, bestSeason: '05-06', tags: ['清真寺', '欧亚', '热气球'] }
];

/**
 * 获取推荐目的地
 * @param {Object} params 查询参数
 * @param {number} params.budget 预算（元）
 * @param {number} params.days 请假天数
 * @param {string} params.origin 出发地
 * @param {string} params.preference 偏好（可选：海岛/城市/风景/历史）
 */
function getRecommendedDestinations({ budget, days, origin, preference }) {
  // 计算总可用预算（减去请假损失）
  const maxBudget = budget;
  
  // 根据天数筛选
  let filtered = DESTINATIONS.filter(d => {
    // 预算匹配
    const totalCost = d.avgPrice * days + 500; // 机票+住宿估算
    return totalCost <= maxBudget * 1.2; // 允许20%浮动
  });
  
  // 偏好筛选
  if (preference) {
    const prefMap = {
      '海岛': ['海岛', '海滨'],
      '城市': ['城市'],
      '风景': ['风景', '高原', '西域'],
      '历史': ['历史', '文化']
    };
    const categories = prefMap[preference] || [];
    filtered = filtered.filter(d => categories.includes(d.category));
  }
  
  // 按预算匹配度排序
  filtered.sort((a, b) => {
    const costA = a.avgPrice * days;
    const costB = b.avgPrice * days;
    const diffA = Math.abs(costA - maxBudget * 0.7); // 偏好70%预算
    const diffB = Math.abs(costB - maxBudget * 0.7);
    return diffA - diffB;
  });
  
  // 返回前10个
  return filtered.slice(0, 10).map(d => ({
    ...d,
    estimatedCost: {
      flight: d.avgPrice * 0.6,
      hotel: d.avgPrice * 0.3 * days,
      food: d.avgPrice * 0.1 * days,
      total: Math.round(d.avgPrice * days + 500)
    }
  }));
}

/**
 * 获取热门目的地榜单
 */
function getHotDestinations(limit = 10) {
  return DESTINATIONS
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/**
 * 获取所有目的地列表
 */
function getAllDestinations() {
  return DESTINATIONS;
}

/**
 * 搜索目的地
 */
function searchDestinations(query) {
  const q = query.toLowerCase();
  return DESTINATIONS.filter(d => 
    d.name.includes(q) || 
    d.city.includes(q) || 
    d.tags.some(t => t.includes(q)) ||
    d.category.includes(q)
  );
}

module.exports = {
  DESTINATIONS,
  getRecommendedDestinations,
  getHotDestinations,
  getAllDestinations,
  searchDestinations
};
