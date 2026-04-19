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
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalClicks: number;
  pageViews: Record<string, number>;
  visitors: VisitorData[];
  performanceScore: number;
}
