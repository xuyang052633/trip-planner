# 部署指南

## 环境要求

- Node.js 18+
- npm 或 yarn

## 安装步骤

### 1. 安装依赖

在项目根目录执行：

```bash
npm run install:all
```

或分别安装：

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd server && npm install

# 安装前端依赖
cd ../client && npm install
```

### 2. 启动服务

**启动后端（终端1）：**
```bash
npm run dev:server
```

后端将运行在 http://localhost:3001

**启动前端（终端2）：**
```bash
npm run dev:client
```

前端将运行在 http://localhost:5173

### 3. 访问应用

打开浏览器访问：http://localhost:5173

## 配置说明

### 后端配置

在 `server/index.js` 中可以修改：

```javascript
const PORT = process.env.PORT || 3001;  // 后端端口
```

### 前端配置

在 `client/vite.config.js` 中可以修改代理：

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',  // 后端地址
    changeOrigin: true
  }
}
```

### 爬虫配置

爬虫相关配置在 `server/crawler/flightCrawler.js` 中：

- **Puppeteer 配置**：修改 `puppeteer.launch()` 参数
- **请求间隔**：添加延迟避免被限制
- **代理设置**：如果需要使用代理

## 生产部署

### 后端部署

1. 安装生产依赖
```bash
cd server
npm install --production
```

2. 使用 PM2 启动（推荐）
```bash
npm install -g pm2
pm2 start index.js --name travel-planner-api
```

3. 配置反向代理（Nginx 示例）
```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### 前端部署

1. 构建前端
```bash
cd client
npm run build
```

2. 部署 `client/dist` 目录到静态服务器

**Nginx 配置：**
```nginx
location / {
    root /path/to/client/dist;
    try_files $uri $uri/ /index.html;
}
```

**使用 Vercel 部署：**
```bash
cd client
npm install -g vercel
vercel --prod
```

## 常见问题

### 爬虫被反爬？

添加请求头和延迟：
```javascript
await page.setUserAgent('Mozilla/5.0 ...');
await new Promise(resolve => setTimeout(resolve, 2000)); // 延迟
```

### 代理无法连接？

检查后端是否运行，端口是否正确。

### 机票数据不准确？

定期更新爬虫代码适配网站结构变化。

### 请假计算错误？

确认工作时长设置和请假小时数输入正确。

## 更新日志

### v1.0.0 (2026-03-02)
- ✅ 初始版本发布
- ✅ 请假损失计算
- ✅ 多平台机票爬取
- ✅ 最优方案推荐
- ✅ 现代化 Web UI
