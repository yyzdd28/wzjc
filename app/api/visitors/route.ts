import { NextResponse } from 'next/server';
import { VisitorDB } from '@/lib/database';

export async function GET() {
  try {
    const visitors = VisitorDB.getRecent(50);
    
    return NextResponse.json({
      success: true,
      data: visitors
    });
  } catch (error) {
    console.error('Visitors API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get visitors' },
      { status: 500 }
    );
  }
}
