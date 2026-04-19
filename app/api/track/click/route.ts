import { NextRequest, NextResponse } from 'next/server';
import { StatsDB } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    StatsDB.incrementClicks();
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Click Track API Error:', error);
    return NextResponse.json({
      success: true
    });
  }
}
