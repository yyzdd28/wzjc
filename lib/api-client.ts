export interface StatsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalClicks: number;
  pageViews: Record<string, number>;
  performanceScore: number;
  lastUpdated: string;
  visitors: VisitorData[];
}

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

export const api = {
  async getStats(): Promise<StatsData | null> {
    try {
      const res = await fetch('/api/stats', {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  },

  async getVisitors(): Promise<VisitorData[]> {
    try {
      const res = await fetch('/api/visitors', {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Get visitors error:', error);
      return [];
    }
  },

  async trackVisitor(data: Partial<VisitorData>): Promise<void> {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Track visitor error:', error);
    }
  },

  async trackClick(): Promise<void> {
    try {
      await fetch('/api/track/click', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Track click error:', error);
    }
  }
};
