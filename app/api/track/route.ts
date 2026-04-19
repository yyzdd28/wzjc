import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { VisitorDB, StatsDB } from '@/lib/database';
import { getLocationFromIP, parseUserAgent } from '@/lib/geo-ip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwardedFor 
      ? forwardedFor.split(',')[0].trim() 
      : realIP || '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || body.userAgent || '';
    const location = getLocationFromIP(ip);
    const uaInfo = parseUserAgent(userAgent);

    const visitorData = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      page: body.page || '/',
      referrer: body.referrer || '',
      country: location.country,
      city: location.city,
      deviceType: body.deviceType || uaInfo.deviceType,
      browser: body.browser || uaInfo.browser,
      os: body.os || uaInfo.os,
      screenWidth: body.screenWidth,
      screenHeight: body.screenHeight,
      language: body.language,
      loadTime: body.loadTime,
      domReady: body.domReady
    };

    VisitorDB.add(visitorData);
    StatsDB.incrementPageView(visitorData.page);
    
    const uniqueIPs = VisitorDB.getUniqueIPs();
    StatsDB.updateUniqueVisitors(uniqueIPs.size);

    return NextResponse.json({
      success: true,
      data: visitorData
    });
  } catch (error) {
    console.error('Track API Error:', error);
    // 即使出错也返回成功，不影响用户体验
    return NextResponse.json({
      success: true,
      data: null
    });
  }
}
