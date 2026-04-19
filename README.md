# Site Analytics - 网站监测工具

一个功能强大的网站分析和监测平台，使用 Next.js 14、React 18、TypeScript 和 Tailwind CSS 构建。

## 功能特性

### 📊 数据监测
- **实时访问统计** - 总访问量、独立访客、总点击量
- **性能评分** - 网站性能指标和优化建议
- **页面浏览分布** - 各页面访问次数统计
- **访问趋势** - 7天内访问数据图表

### 👥 访客分析
- **访客记录** - 详细的访客信息表格
- **设备分布** - 桌面、移动、平板设备统计
- **浏览器统计** - Chrome、Firefox、Safari、Edge 等
- **地理位置** - IP 地址和位置信息
- **操作系统** - Windows、MacOS、Linux、Android、iOS

### 🔧 监测脚本
- **一键生成** - 自动生成可嵌入的监测代码
- **简单集成** - 只需粘贴到网站 &lt;head&gt; 标签
- **自动收集** - 页面加载、点击事件自动追踪

### 📈 数据可视化
- **折线图** - 访问趋势和独立访客对比
- **柱状图** - 页面浏览分布
- **饼图** - 设备和浏览器分布
- **科技风格 UI** - 渐变色彩和动态效果

## 快速开始

### 1. 安装依赖

```bash
cd site-analytics
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
site-analytics/
├── app/                          # Next.js App Router
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页（仪表板）
│   ├── dashboard/
│   │   └── page.tsx             # 详细数据页面
│   └── api/track/
│       └── route.ts             # 数据收集 API
├── components/                   # React 组件
│   ├── DashboardStats.tsx       # 统计卡片
│   ├── VisitorsChart.tsx        # 图表组件
│   ├── VisitorTable.tsx         # 访客表格
│   └── TrackingScript.tsx       # 监测脚本生成
├── lib/
│   └── types.ts                 # TypeScript 类型定义
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 使用说明

### 1. 获取监测代码

1. 访问首页
2. 点击「获取监测代码」按钮
3. 复制生成的 JavaScript 代码

### 2. 集成到您的网站

将复制的代码粘贴到您网站 HTML 的 `<head>` 标签中：

```html
<head>
  <!-- 其他 meta 标签 -->
  
  <!-- Site Analytics 监测代码 -->
  <script>
    // 粘贴复制的代码
  </script>
</head>
```

### 3. 查看数据

访问您的网站后，数据将自动收集并在仪表板中显示。

## 技术栈

- **框架** - Next.js 14 (App Router)
- **UI 库** - React 18 + TypeScript
- **样式** - Tailwind CSS
- **图表** - Chart.js + react-chartjs-2
- **图标** - 自定义 SVG 图标

## 注意事项

⚠️ **当前版本使用浏览器本地存储** - 数据仅保存在当前浏览器中，刷新后不会丢失。

🔮 **生产部署建议** - 需要连接真实的后端数据库（如 PostgreSQL、MongoDB）来持久化数据。

## 下一步功能

- [ ] 用户认证系统
- [ ] 多网站支持
- [ ] 实时数据更新（WebSocket）
- [ ] 导出报告（PDF/Excel）
- [ ] 邮件通知
- [ ] A/B 测试支持
- [ ] 漏斗分析

## License

MIT
