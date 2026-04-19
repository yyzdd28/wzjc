# CYBER_ANALYTICS - 部署指南

## 📋 项目概述

这是一个**完整的、真实可用的黑客风格网站分析系统**，包含：

- ✅ 实时访客追踪（IP、地理位置、设备信息）
- ✅ 文件数据库持久化存储（`data/` 目录）
- ✅ 完整的前端后端API联动
- ✅ 黑客/赛博朋克风格UI
- ✅ 可嵌入任意网站的追踪脚本
- ✅ 生产级代码质量

## 🚀 快速开始

### 1. 环境要求

- **Node.js** 18.x 或更高版本
- **npm** 9.x 或更高版本
- 或 **pnpm** / **yarn**

### 2. 安装依赖

```bash
cd site-analytics
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
site-analytics/
├── app/
│   ├── api/
│   │   ├── stats/route.ts          # 获取统计数据
│   │   ├── track/route.ts          # 追踪访客
│   │   └── track/click/route.ts    # 追踪点击
│   ├── dashboard/page.tsx          # 详细仪表盘
│   ├── page.tsx                    # 主页面
│   ├── layout.tsx                  # 布局
│   └── globals.css                 # 黑客风格样式
├── components/
│   ├── DashboardStats.tsx          # 统计卡片
│   ├── VisitorsChart.tsx           # 访客图表
│   ├── VisitorTable.tsx            # 访客表格
│   └── TrackingScript.tsx          # 追踪脚本生成器
├── lib/
│   ├── database.ts                 # 数据持久化
│   ├── geo-ip.ts                   # IP地理位置解析
│   ├── api-client.ts               # API客户端
│   └── types.ts                    # 类型定义
├── data/                           # 数据存储目录（自动创建）
│   ├── visitors.json
│   └── stats.json
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🔧 核心功能说明

### 1. 数据持久化

所有数据存储在 `data/` 目录：

- **visitors.json**: 访客日志（最多500条）
- **stats.json**: 统计数据（总访问、独立访客、点击数、页面浏览）

### 2. 追踪脚本使用

1. 访问仪表盘首页
2. 点击 "GET_TRACKING_CODE" 按钮
3. 复制生成的脚本代码
4. 将代码插入到任意网站的 `<head>` 或 `<body>` 标签中

### 3. 地理位置解析

系统内置了IP前缀数据库，可以识别：
- 全球主要城市
- 局域网IP
- 本地主机

## 🚢 部署到生产环境

### 方案1: Vercel（推荐）

1. 将代码推送到 GitHub/GitLab
2. 在 Vercel 中导入项目
3. 直接部署！

### 方案2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
VOLUME /app/data
CMD ["npm", "start"]
```

### 方案3: 传统服务器

```bash
# 构建
npm run build

# 启动PM2守护进程
npm install -g pm2
pm2 start npm --name "cyber-analytics" -- start
```

## 📊 API 接口文档

### POST /api/track

追踪访客访问

**请求体:**
```json
{
  "page": "/",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "language": "zh-CN",
  "screenWidth": 1920,
  "screenHeight": 1080,
  "deviceType": "Desktop",
  "browser": "Chrome",
  "os": "Windows"
}
```

### POST /api/track/click

追踪点击事件

### GET /api/stats

获取统计数据

**响应:**
```json
{
  "success": true,
  "data": {
    "totalVisits": 1000,
    "uniqueVisitors": 250,
    "totalClicks": 5000,
    "pageViews": {"/": 500, "/about": 300},
    "performanceScore": 85,
    "visitors": [...]
  }
}
```

### GET /api/visitors

获取访客列表

## 🛡️ 生产环境优化建议

1. **HTTPS**: 确保使用HTTPS协议
2. **日志轮转**: 配置定期清理旧访客日志
3. **IP限流**: 添加IP访问频率限制
4. **数据备份**: 定期备份 `data/` 目录
5. **环境变量**: 使用环境变量配置数据库路径

## 🎨 自定义样式

修改 `app/globals.css` 中的：
- 颜色方案（`#00ff41` 绿色）
- 字体（Share Tech Mono, Orbitron）
- 动画效果

## 📝 更新日志

### v1.0.0
- ✅ 完整的访客追踪系统
- ✅ 文件数据库持久化
- ✅ 黑客风格UI
- ✅ 实时数据刷新
- ✅ 可嵌入追踪脚本

## 🆘 常见问题

**Q: 数据存储在哪里？**
A: 在项目根目录的 `data/` 文件夹中，首次运行会自动创建。

**Q: 如何重置数据？**
A: 删除 `data/` 目录下的 JSON 文件即可。

**Q: 支持多少条访客记录？**
A: 默认最多保存500条，可在 `lib/database.ts` 中修改。

## 📄 许可证

MIT License - 可自由使用于商业项目。

---

**祝您使用愉快！** 🎉
