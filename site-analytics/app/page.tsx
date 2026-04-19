"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DashboardStats from '@/components/DashboardStats';
import VisitorsChart from '@/components/VisitorsChart';
import VisitorTable from '@/components/VisitorTable';
import TrackingScript from '@/components/TrackingScript';
import { api, StatsData } from '@/lib/api-client';

export default function Home() {
  const [analytics, setAnalytics] = useState<StatsData | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [liveData, setLiveData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const data = await api.getStats();
    if (data) {
      setAnalytics(data);
      setLoading(false);
      
      if (data.visitors.length > 0) {
        const latest = data.visitors[0];
        const time = new Date(latest.timestamp).toLocaleTimeString('zh-CN', { hour12: false });
        const log = `[${time}] PAGE_VIEW from ${latest.ip} -> ${latest.page}`;
        
        setLiveData(prev => {
          const newLogs = [log, ...prev.slice(0, 7)];
          return newLogs;
        });
      }
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const addRandomLiveLog = () => {
    const actions = ['PAGE_VIEW', 'CLICK_EVENT', 'USER_JOIN', 'SCROLL_EVENT'];
    const pages = ['/', '/about', '/blog', '/contact', '/products'];
    const ips = [
      '192.168.1.' + Math.floor(Math.random() * 255),
      '10.0.0.' + Math.floor(Math.random() * 255),
      '172.16.0.' + Math.floor(Math.random() * 255)
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const page = pages[Math.floor(Math.random() * pages.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    
    const log = `[${time}] ${action} from ${ip} -> ${page}`;
    
    setLiveData(prev => {
      const newLogs = [log, ...prev.slice(0, 7)];
      return newLogs;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black grid-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green font-mono text-glow">INITIALIZING CYBER_ANALYTICS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 data-stream pointer-events-none z-0"></div>
      
      <div className="sticky top-0 z-50 bg-black/95 border-b border-green/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green rounded-full animate-pulse"></div>
                <span className="text-green font-mono text-sm">STATUS: <span className="text-green text-glow">ONLINE</span></span>
              </div>
              <div className="text-cyan text-sm font-mono">
                <span className="text-green/60">SYSTEM_TIME:</span> {currentTime}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowScript(!showScript)}
                className="px-4 py-2 bg-black border border-green/50 text-green hover:bg-green/10 transition-all text-sm font-mono"
              >
                {showScript ? 'HIDE_SCRIPT' : 'GET_TRACKING_CODE'}
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-green/10 border border-green text-green hover:bg-green/20 transition-all text-sm font-mono"
              >
                DASHBOARD
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="mb-6 border-l-4 border-green pl-4">
          <h1 className="text-3xl font-cyber font-bold text-green text-glow mb-2">
            CYBER_ANALYTICS
            <span className="text-yellow text-xl ml-2 typing-cursor"></span>
          </h1>
          <p className="text-green/60 font-mono text-sm">
            REAL_TIME WEBSITE MONITORING & ANALYTICS SYSTEM v1.0.0
          </p>
        </div>

        <div className="terminal-window p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3 border-b border-green/30 pb-2">
            <div className="w-3 h-3 bg-red/80 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow/80 rounded-full"></div>
            <div className="w-3 h-3 bg-green/80 rounded-full"></div>
            <span className="ml-4 text-green/60 text-sm font-mono">live_monitor.log</span>
          </div>
          <div className="h-32 overflow-y-auto font-mono text-sm space-y-1">
            {liveData.length === 0 && (
              <div className="text-green/40">Waiting for incoming data...</div>
            )}
            {liveData.map((log, idx) => (
              <div key={idx} className={`${idx === 0 ? 'text-green text-glow' : 'text-green/60'}`}>
                {'>'} {log}
              </div>
            ))}
          </div>
        </div>

        {showScript && <TrackingScript />}

        {analytics && <DashboardStats analytics={analytics} />}
        {analytics && <VisitorsChart analytics={analytics} />}
        {analytics && <VisitorTable analytics={analytics} />}
      </main>
    </div>
  );
}
