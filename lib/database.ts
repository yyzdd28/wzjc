import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// 内存存储（作为 Vercel 环境的后备方案）
let memoryVisitors: any[] = [];
let memoryStats: any = {
  totalVisits: 0,
  uniqueVisitors: 0,
  totalClicks: 0,
  pageViews: {},
  performanceScore: 85,
  lastUpdated: new Date().toISOString()
};

// 检查是否在 Vercel 环境中
const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL === '1';

// 安全地初始化数据目录（仅在本地环境）
function initDataDir() {
  if (isVercel) {
    return; // 在 Vercel 中跳过文件系统初始化
  }
  
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(VISITORS_FILE)) {
      fs.writeFileSync(VISITORS_FILE, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(STATS_FILE)) {
      fs.writeFileSync(STATS_FILE, JSON.stringify(memoryStats, null, 2));
    }
  } catch (e) {
    console.warn('File system initialization failed, using memory storage:', e);
  }
}

initDataDir();

export interface VisitorData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  page: string;
  referrer: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  loadTime?: number;
  domReady?: number;
}

export interface StatsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalClicks: number;
  pageViews: Record<string, number>;
  performanceScore: number;
  lastUpdated: string;
}

// 访客数据操作
export const VisitorDB = {
  getAll(): VisitorData[] {
    try {
      if (isVercel) {
        return memoryVisitors;
      }
      const data = fs.readFileSync(VISITORS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return memoryVisitors;
    }
  },

  add(visitor: VisitorData) {
    const visitors = this.getAll();
    visitors.unshift(visitor);
    
    if (visitors.length > 500) {
      visitors.pop();
    }
    
    if (!isVercel) {
      try {
        fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
      } catch (e) {
        console.warn('Failed to write visitors file:', e);
      }
    }
    
    memoryVisitors = visitors;
    return visitor;
  },

  getRecent(limit: number = 50): VisitorData[] {
    return this.getAll().slice(0, limit);
  },

  getUniqueIPs(): Set<string> {
    const visitors = this.getAll();
    return new Set(visitors.map(v => v.ip));
  }
};

// 统计数据操作
export const StatsDB = {
  get(): StatsData {
    try {
      if (isVercel) {
        return memoryStats;
      }
      const data = fs.readFileSync(STATS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return memoryStats;
    }
  },

  update(updates: Partial<StatsData>) {
    const stats = this.get();
    const newStats = {
      ...stats,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    if (!isVercel) {
      try {
        fs.writeFileSync(STATS_FILE, JSON.stringify(newStats, null, 2));
      } catch (e) {
        console.warn('Failed to write stats file:', e);
      }
    }
    
    memoryStats = newStats;
    return newStats;
  },

  incrementPageView(page: string) {
    const stats = this.get();
    const pageViews = { ...stats.pageViews };
    pageViews[page] = (pageViews[page] || 0) + 1;
    
    return this.update({
      totalVisits: stats.totalVisits + 1,
      pageViews
    });
  },

  incrementClicks() {
    const stats = this.get();
    return this.update({
      totalClicks: stats.totalClicks + 1
    });
  },

  updateUniqueVisitors(count: number) {
    return this.update({
      uniqueVisitors: count
    });
  }
};
