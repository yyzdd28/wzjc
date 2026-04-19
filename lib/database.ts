import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// 初始化数据目录
function initDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(VISITORS_FILE)) {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(STATS_FILE)) {
    const initialStats = {
      totalVisits: 0,
      uniqueVisitors: 0,
      totalClicks: 0,
      pageViews: {},
      performanceScore: 85,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
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
      const data = fs.readFileSync(VISITORS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  add(visitor: VisitorData) {
    const visitors = this.getAll();
    visitors.unshift(visitor);
    
    if (visitors.length > 500) {
      visitors.pop();
    }
    
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
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
      const data = fs.readFileSync(STATS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return {
        totalVisits: 0,
        uniqueVisitors: 0,
        totalClicks: 0,
        pageViews: {},
        performanceScore: 85,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  update(updates: Partial<StatsData>) {
    const stats = this.get();
    const newStats = {
      ...stats,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(STATS_FILE, JSON.stringify(newStats, null, 2));
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
