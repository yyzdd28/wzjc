// 简单的 IP 地理位置解析（基于 IP 前缀）
const LOCATION_DB: Record<string, { country: string; city: string }> = {
  '192.168': { country: 'CN', city: '局域网' },
  '10.0': { country: 'CN', city: '局域网' },
  '172.16': { country: 'CN', city: '局域网' },
  '1.': { country: 'CN', city: '北京' },
  '2.': { country: 'GB', city: '伦敦' },
  '3.': { country: 'US', city: '洛杉矶' },
  '4.': { country: 'US', city: '纽约' },
  '5.': { country: 'DE', city: '柏林' },
  '6.': { country: 'JP', city: '东京' },
  '7.': { country: 'KR', city: '首尔' },
  '8.': { country: 'US', city: '旧金山' },
  '9.': { country: 'CN', city: '深圳' },
  '11.': { country: 'US', city: '芝加哥' },
  '12.': { country: 'US', city: '波士顿' },
  '14.': { country: 'CN', city: '上海' },
  '15.': { country: 'US', city: '西雅图' },
  '16.': { country: 'US', city: '华盛顿' },
  '17.': { country: 'US', city: '休斯顿' },
  '18.': { country: 'US', city: '达拉斯' },
  '20.': { country: 'BR', city: '圣保罗' },
  '21.': { country: 'CN', city: '广州' },
  '22.': { country: 'IN', city: '孟买' },
  '23.': { country: 'US', city: '菲尼克斯' },
  '24.': { country: 'US', city: '费城' },
  '25.': { country: 'GB', city: '曼彻斯特' },
  '27.': { country: 'CN', city: '杭州' },
  '28.': { country: 'CN', city: '成都' },
  '36.': { country: 'CN', city: '武汉' },
  '39.': { country: 'CN', city: '南京' },
  '42.': { country: 'CN', city: '西安' },
  '43.': { country: 'JP', city: '大阪' },
  '45.': { country: 'CA', city: '多伦多' },
  '47.': { country: 'CN', city: '重庆' },
  '49.': { country: 'DE', city: '慕尼黑' },
  '58.': { country: 'CN', city: '天津' },
  '60.': { country: 'CN', city: '苏州' },
  '61.': { country: 'AU', city: '悉尼' },
  '66.': { country: 'US', city: '迈阿密' },
  '72.': { country: 'US', city: '丹佛' },
  '78.': { country: 'NL', city: '阿姆斯特丹' },
  '80.': { country: 'CN', city: '长沙' },
  '82.': { country: 'CN', city: '青岛' },
  '83.': { country: 'CN', city: '大连' },
  '85.': { country: 'CN', city: '厦门' },
  '88.': { country: 'CN', city: '昆明' },
  '94.': { country: 'CN', city: '宁波' },
  '101.': { country: 'CN', city: '福州' },
  '110.': { country: 'CN', city: '郑州' },
  '111.': { country: 'CN', city: '沈阳' },
  '112.': { country: 'CN', city: '哈尔滨' },
  '113.': { country: 'CN', city: '石家庄' },
  '114.': { country: 'CN', city: '济南' },
  '115.': { country: 'CN', city: '合肥' },
  '116.': { country: 'CN', city: '南昌' },
  '117.': { country: 'CN', city: '贵阳' },
  '118.': { country: 'CN', city: '海口' },
  '119.': { country: 'CN', city: '兰州' },
  '120.': { country: 'CN', city: '西宁' },
  '121.': { country: 'CN', city: '银川' },
  '122.': { country: 'CN', city: '乌鲁木齐' },
  '123.': { country: 'CN', city: '拉萨' },
  '124.': { country: 'CN', city: '呼和浩特' },
  '125.': { country: 'CN', city: '太原' },
  '126.': { country: 'CN', city: '南宁' },
  '127.': { country: 'CN', city: '本地主机' },
  '180.': { country: 'CN', city: '长春' },
  '182.': { country: 'CN', city: '长沙' },
  '183.': { country: 'CN', city: '福州' },
  '188.': { country: 'CN', city: '石家庄' },
  '202.': { country: 'CN', city: '南京' },
  '210.': { country: 'CN', city: '杭州' },
  '211.': { country: 'CN', city: '合肥' },
  '218.': { country: 'CN', city: '成都' },
  '219.': { country: 'CN', city: '重庆' },
  '220.': { country: 'CN', city: '广州' },
  '221.': { country: 'CN', city: '深圳' },
  '222.': { country: 'CN', city: '上海' },
  '223.': { country: 'CN', city: '北京' }
};

export function getLocationFromIP(ip: string): { country: string; city: string } {
  if (!ip) {
    return { country: 'UNKNOWN', city: 'UNKNOWN' };
  }

  const parts = ip.split('.');
  const prefixes = [
    `${parts[0]}.${parts[1]}.`,
    `${parts[0]}.`,
    parts[0].startsWith('10.') ? '10.0' : '',
    parts[0] === '192' && parts[1] === '168' ? '192.168' : '',
    parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31 ? '172.16' : ''
  ].filter(Boolean);

  for (const prefix of prefixes) {
    if (LOCATION_DB[prefix]) {
      return LOCATION_DB[prefix];
    }
  }

  return { country: 'XX', city: 'Unknown' };
}

export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  deviceType: string;
} {
  const ua = userAgent.toLowerCase();
  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'Desktop';

  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    deviceType = /tablet|ipad/.test(ua) ? 'Tablet' : 'Mobile';
  }

  if (/chrome|crios/.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/.test(ua)) {
    browser = 'Firefox';
  } else if (/safari/.test(ua)) {
    browser = 'Safari';
  } else if (/edg|edge/.test(ua)) {
    browser = 'Edge';
  } else if (/opera|opr/.test(ua)) {
    browser = 'Opera';
  } else if (/msie|trident/.test(ua)) {
    browser = 'IE';
  }

  if (/windows/.test(ua)) {
    os = 'Windows';
  } else if (/mac/.test(ua)) {
    os = 'MacOS';
  } else if (/linux/.test(ua)) {
    os = 'Linux';
  } else if (/android/.test(ua)) {
    os = 'Android';
  } else if (/iphone|ipad|ipod/.test(ua)) {
    os = 'iOS';
  }

  return { browser, os, deviceType };
}
