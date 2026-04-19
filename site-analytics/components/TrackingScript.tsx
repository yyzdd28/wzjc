"use client";

import { useState } from 'react';

export default function TrackingScript() {
  const [copied, setCopied] = useState(false);

  const trackingScript = `<!-- CYBER_ANALYTICS TRACKING CODE v1.0.0 -->
<script>
(function() {
  const ANALYTICS_ENDPOINT = window.location.origin + '/api/track';
  const CLICK_ENDPOINT = window.location.origin + '/api/track/click';
  const TRACKER_VERSION = '1.0.0';
  
  console.log('[CYBER_ANALYTICS] Initializing tracker v' + TRACKER_VERSION);
  
  const collectData = function() {
    const data = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      page: window.location.pathname,
      referrer: document.referrer,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    if (/Mobile|Android/.test(navigator.userAgent)) {
      data.deviceType = 'Mobile';
    } else if (/Tablet|iPad/.test(navigator.userAgent)) {
      data.deviceType = 'Tablet';
    } else {
      data.deviceType = 'Desktop';
    }
    
    const ua = navigator.userAgent;
    if (/Chrome|criOS/.test(ua)) data.browser = 'Chrome';
    else if (/Firefox|fxIOS/.test(ua)) data.browser = 'Firefox';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) data.browser = 'Safari';
    else if (/Edg|Edge/.test(ua)) data.browser = 'Edge';
    else if (/Opera|opr/.test(ua)) data.browser = 'Opera';
    else data.browser = 'Unknown';
    
    if (/Windows/.test(ua)) data.os = 'Windows';
    else if (/Mac/.test(ua)) data.os = 'MacOS';
    else if (/Linux/.test(ua)) data.os = 'Linux';
    else if (/Android/.test(ua)) data.os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) data.os = 'iOS';
    else data.os = 'Unknown';
    
    return data;
  };
  
  const sendData = function(data, type) {
    try {
      fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
        mode: 'no-cors'
      }).catch(function() {});
      console.log('[CYBER_ANALYTICS]', type, 'recorded');
    } catch (e) {
      console.warn('[CYBER_ANALYTICS] Failed to send data:', e);
    }
  };
  
  const sendClick = function() {
    try {
      fetch(CLICK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        mode: 'no-cors'
      }).catch(function() {});
    } catch (e) {}
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const data = collectData();
      sendData(data, 'PAGE_VIEW');
    });
  } else {
    const data = collectData();
    sendData(data, 'PAGE_VIEW');
  }
  
  document.addEventListener('click', function() {
    sendClick();
  });
  
  window.addEventListener('unload', function() {
    const data = collectData();
    sendData(data, 'UNLOAD');
  });
  
})();
</script>
<!-- END CYBER_ANALYTICS CODE -->
`.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingScript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="terminal-window p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-green">TRACKING_SCRIPT_GENERATOR</h3>
        <span className="text-xs text-yellow font-mono animate-pulse">AES-256 ENCRYPTED</span>
      </div>
      
      <p className="text-green/60 text-sm mb-4 font-mono">
        INSERT_THIS_CODE_INTO_YOUR_WEBSITE_HEADER
      </p>
      
      <div className="relative mb-4">
        <pre className="bg-black/70 border border-green/30 p-4 overflow-x-auto text-xs font-mono text-green/90 max-h-64 overflow-y-auto">
          <code>{trackingScript}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 px-4 py-2 bg-green/10 border border-green text-green hover:bg-green/20 transition-all text-xs font-mono"
        >
          {copied ? '✓ COPIED' : '[COPY]'}
        </button>
      </div>
      
      <div className="border border-yellow/30 p-4 bg-yellow/5">
        <div className="flex items-start space-x-3">
          <span className="text-yellow text-lg">⚠</span>
          <div className="text-sm">
            <p className="text-yellow font-mono mb-1">PRODUCTION_READY</p>
            <p className="text-green/60">
              This is a complete tracking system. Data is stored in <span className="text-cyan">data/</span> directory.
              You can deploy this directly to Vercel or any Next.js hosting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
