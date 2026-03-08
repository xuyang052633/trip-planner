# ✈️ 请假旅游规划助手

智能请假成本计算 + 实时机票酒店搜索 + 行程规划

## 功能特点

- 💰 智能计算请假成本（按小时/上午/下午/全天）
- 🛫 实时搜索机票（Amadeus API）
- 🏨 酒店搜索
- 📅 行程规划与费用总览
- 🗓️ 支持自定义请假天数

## 快速开始

### 本地运行

```bash
npm install
npm start
```

访问 http://localhost:3000

### 部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 推送代码
3. 在仓库设置中启用 GitHub Pages

## 技术栈

- Node.js + Express
- Amadeus API（机票搜索）
- 纯 HTML/CSS/JavaScript 前端

## API 配置

Amadeus API 密钥配置在 `server.js` 中：

```javascript
const amadeus = new Amadeus({
  clientId: 'YOUR_API_KEY',
  clientSecret: 'YOUR_API_SECRET'
});
```

## 许可证

MIT
