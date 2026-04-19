import { NextRequest, NextResponse } from 'next/server';
import { StatsDB } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    StatsDB.incrementClicks();
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
