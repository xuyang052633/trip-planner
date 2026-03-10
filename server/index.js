const express = require('express');
const cors = require('cors');
const flightRoutes = require('./api/flights');
const destinationRoutes = require('./api/destinations');
const dateRoutes = require('./api/dates');
const tripRoutes = require('./api/trips');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
app.use('/api/flights', flightRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/dates', dateRoutes);
app.use('/api/trips', tripRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '旅游规划小助手 API 运行正常' });
});

app.listen(PORT, () => {
  console.log(`🚀 旅游规划小助手服务运行在 http://localhost:${PORT}`);
});
