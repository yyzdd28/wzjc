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
    return NextResponse.json(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
