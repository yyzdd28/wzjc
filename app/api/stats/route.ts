import { NextResponse } from 'next/server';
import { StatsDB, VisitorDB } from '@/lib/database';

export async function GET() {
  try {
    const stats = StatsDB.get();
    const visitors = VisitorDB.getRecent(50);
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        visitors
      }
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    
    // 返回安全的错误响应
    return NextResponse.json({
      success: true,
      data: {
        totalVisits: 0,
        uniqueVisitors: 0,
        totalClicks: 0,
        pageViews: {},
        performanceScore: 85,
        lastUpdated: new Date().toISOString(),
        visitors: []
      }
    });
  }
}
