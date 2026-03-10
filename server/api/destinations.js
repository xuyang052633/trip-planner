const express = require('express');
const router = express.Router();
const { 
  getRecommendedDestinations, 
  getHotDestinations, 
  getAllDestinations,
  searchDestinations 
} = require('../data/destinations');

/**
 * 获取目的地推荐
 * POST /api/destinations/recommend
 * 
 * 请求体：
 * {
 *   budget: 5000,           // 总预算（元）
 *   days: 3,                // 请假天数
 *   origin: 'SHA',          // 出发地
 *   preference: '海岛'      // 偏好（可选）
 * }
 */
router.post('/recommend', (req, res) => {
  try {
    const { budget, days, origin, preference } = req.body;
    
    if (!budget || !days) {
      return res.status(400).json({
        success: false,
        error: '请提供预算和请假天数'
      });
    }
    
    const recommendations = getRecommendedDestinations({
      budget,
      days,
      origin,
      preference
    });
    
    res.json({
      success: true,
      query: { budget, days, origin, preference },
      count: recommendations.length,
      destinations: recommendations
    });
    
  } catch (error) {
    console.error('❌ 推荐API错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取热门目的地榜单
 * GET /api/destinations/hot?limit=10
 */
router.get('/hot', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const hotList = getHotDestinations(limit);
    
    res.json({
      success: true,
      destinations: hotList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取所有目的地
 * GET /api/destinations/all
 */
router.get('/all', (req, res) => {
  try {
    const destinations = getAllDestinations();
    res.json({
      success: true,
      count: destinations.length,
      destinations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 搜索目的地
 * GET /api/destinations/search?q=三亚
 */
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: '请提供搜索关键词' });
    }
    
    const results = searchDestinations(q);
    res.json({
      success: true,
      query: q,
      count: results.length,
      destinations: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
