"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatsData } from '@/lib/api-client';
import { api } from '@/lib/api-client';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<StatsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const data = await api.getStats();
    if (data) {
      setAnalytics(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-black grid-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green font-mono text-glow">LOADING DATA...</p>
        </div>
      </div>
    );
  }

  const deviceStats = analytics.visitors.reduce(
    (acc, visitor) => {
      const device = visitor.deviceType || 'Desktop';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const browserStats = analytics.visitors.reduce(
    (acc, visitor) => {
      const browser = visitor.browser || 'Chrome';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const deviceData = {
    labels: Object.keys(deviceStats),
    datasets: [
      {
        data: Object.values(deviceStats),
        backgroundColor: [
          'rgba(0, 255, 65, 0.6)',
          'rgba(0, 191, 255, 0.6)',
          'rgba(255, 0, 255, 0.6)'
        ],
        borderColor: ['#00ff41', '#00bfff', '#ff00ff'],
        borderWidth: 2
      }
    ]
  };

  const browserData = {
    labels: Object.keys(browserStats),
    datasets: [
      {
        data: Object.values(browserStats),
        backgroundColor: [
          'rgba(0, 255, 65, 0.6)',
          'rgba(0, 191, 255, 0.6)',
          'rgba(255, 0, 255, 0.6)',
          'rgba(255, 204, 0, 0.6)'
        ],
        borderColor: ['#00ff41', '#00bfff', '#ff00ff', '#ffcc00'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#00ff41',
          font: {
            family: 'monospace'
          }
        }
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'performance', label: 'PERFORMANCE' },
    { id: 'visitors', label: 'VISITORS' }
  ];

  return (
    <div className="min-h-screen bg-black grid-pattern relative">
      <div className="absolute inset-0 data-stream pointer-events-none z-0"></div>

      <nav className="sticky top-0 z-50 bg-black/95 border-b border-green/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green to-cyan rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-cyber font-bold text-green text-glow">
                CYBER_ANALYTICS_DASHBOARD
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-cyan text-sm font-mono hidden md:block">
                <span className="text-green/60">SYSTEM:</span> ONLINE
              </div>
              <Link
                href="/"
                className="px-4 py-2 border border-green/50 text-green hover:bg-green/10 transition-all text-sm font-mono"
              >
                ← BACK
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex space-x-4 mb-6 border-b border-green/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-mono text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-green border-b-2 border-green'
                  : 'text-green/50 hover:text-green/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-cyber text-green text-glow">
                SYSTEM_OVERVIEW
              </h2>
              <span className="text-xs text-cyan font-mono animate-pulse">
                LIVE_DATA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="terminal-window p-5">
                <div className="text-xs text-green/60 font-mono mb-1">
                  TOTAL_VISITS
                </div>
                <div className="text-3xl font-cyber text-green font-bold">
                  {analytics.totalVisits.toLocaleString()}
                </div>
                <div className="text-xs text-yellow mt-2">REALTIME</div>
              </div>

              <div className="terminal-window p-5">
                <div className="text-xs text-cyan/60 font-mono mb-1">
                  UNIQUE_VISITORS
                </div>
                <div className="text-3xl font-cyber text-cyan font-bold">
                  {analytics.uniqueVisitors.toLocaleString()}
                </div>
                <div className="text-xs text-yellow mt-2">REALTIME</div>
              </div>

              <div className="terminal-window p-5">
                <div className="text-xs text-pink/60 font-mono mb-1">
                  TOTAL_CLICKS
                </div>
                <div className="text-3xl font-cyber text-pink font-bold">
                  {analytics.totalClicks.toLocaleString()}
                </div>
                <div className="text-xs text-yellow mt-2">REALTIME</div>
              </div>

              <div className="terminal-window p-5">
                <div className="text-xs text-yellow/60 font-mono mb-1">
                  PERFORMANCE_SCORE
                </div>
                <div className="text-3xl font-cyber text-yellow font-bold">
                  {analytics.performanceScore}/100
                </div>
                <div className="text-xs text-green mt-2">GOOD</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="terminal-window p-5">
                <h3 className="text-sm font-mono text-green mb-4">DEVICE_DISTRIBUTION</h3>
                <div className="h-64">
                  <Doughnut data={deviceData} options={chartOptions} />
                </div>
              </div>

              <div className="terminal-window p-5">
                <h3 className="text-sm font-mono text-green mb-4">BROWSER_DISTRIBUTION</h3>
                <div className="h-64">
                  <Doughnut data={browserData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="terminal-window p-5">
              <h3 className="text-sm font-mono text-green mb-4">TOP_PAGES</h3>
              <div className="space-y-3">
                {Object.entries(analytics.pageViews)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([page, count], idx) => (
                    <div key={page} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-cyan font-mono text-sm w-6">#{idx + 1}</span>
                        <span className="text-green font-mono text-sm">{page}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-48 h-2 bg-black/50 border border-green/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green to-cyan transition-all"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.pageViews))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-yellow font-mono text-sm w-20 text-right">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-cyber text-green text-glow mb-4">
              PERFORMANCE_METRICS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="terminal-window p-5">
                <h3 className="text-sm font-mono text-green mb-4">LOAD_TIMING</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm font-mono">
                      <span className="text-green/60">DOM_CONTENT_LOADED</span>
                      <span className="text-cyan">1.2s</span>
                    </div>
                    <div className="h-3 bg-black/50 border border-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green to-cyan w-3/4"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm font-mono">
                      <span className="text-green/60">FULL_PAGE_LOAD</span>
                      <span className="text-cyan">2.5s</span>
                    </div>
                    <div className="h-3 bg-black/50 border border-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan to-pink w-2/3"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm font-mono">
                      <span className="text-green/60">FIRST_CONTENTFUL_PAINT</span>
                      <span className="text-cyan">0.8s</span>
                    </div>
                    <div className="h-3 bg-black/50 border border-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink to-yellow w-4/5"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm font-mono">
                      <span className="text-green/60">TIME_TO_INTERACTIVE</span>
                      <span className="text-cyan">1.8s</span>
                    </div>
                    <div className="h-3 bg-black/50 border border-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow to-green w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="terminal-window p-5">
                <h3 className="text-sm font-mono text-green mb-4">OPTIMIZATION_TIPS</h3>
                <ul className="space-y-3 text-sm font-mono">
                  <li className="flex items-start space-x-3 p-3 bg-green/5 border border-green/20">
                    <span className="text-green text-lg">⚡</span>
                    <div>
                      <p className="text-green">Optimize image assets</p>
                      <p className="text-green/50 text-xs">Potential saving: ~200KB</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 p-3 bg-cyan/5 border border-cyan/20">
                    <span className="text-cyan text-lg">📦</span>
                    <div>
                      <p className="text-cyan">Enable Gzip compression</p>
                      <p className="text-cyan/50 text-xs">Reduce transfer by ~40%</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 p-3 bg-pink/5 border border-pink/20">
                    <span className="text-pink text-lg">⏳</span>
                    <div>
                      <p className="text-pink">Lazy-load non-critical resources</p>
                      <p className="text-pink/50 text-xs">Improve initial load time</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 p-3 bg-yellow/5 border border-yellow/20">
                    <span className="text-yellow text-lg">🔄</span>
                    <div>
                      <p className="text-yellow">Implement browser caching</p>
                      <p className="text-yellow/50 text-xs">Reduce server requests</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="terminal-window p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono text-green">PERFORMANCE_GRADE</h3>
                <span className="text-5xl font-cyber text-yellow font-bold">A</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-green/20 bg-black/30">
                  <div className="text-green text-2xl font-bold">92</div>
                  <div className="text-green/50 text-xs font-mono">PERFORMANCE</div>
                </div>
                <div className="text-center p-4 border border-cyan/20 bg-black/30">
                  <div className="text-cyan text-2xl font-bold">88</div>
                  <div className="text-cyan/50 text-xs font-mono">ACCESSIBILITY</div>
                </div>
                <div className="text-center p-4 border border-pink/20 bg-black/30">
                  <div className="text-pink text-2xl font-bold">95</div>
                  <div className="text-pink/50 text-xs font-mono">BEST_PRACTICES</div>
                </div>
                <div className="text-center p-4 border border-yellow/20 bg-black/30">
                  <div className="text-yellow text-2xl font-bold">85</div>
                  <div className="text-yellow/50 text-xs font-mono">SEO</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-cyber text-green text-glow">
                VISITOR_DATABASE
              </h2>
              <span className="text-xs text-cyan font-mono">
                {analytics.visitors.length} RECORDS
              </span>
            </div>

            <div className="terminal-window p-5 overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-green/30 text-left">
                    <th className="py-3 px-2 text-green/60">TIMESTAMP</th>
                    <th className="py-3 px-2 text-green/60">IP_ADDRESS</th>
                    <th className="py-3 px-2 text-green/60">LOCATION</th>
                    <th className="py-3 px-2 text-green/60">DEVICE</th>
                    <th className="py-3 px-2 text-green/60">BROWSER</th>
                    <th className="py-3 px-2 text-green/60">OS</th>
                    <th className="py-3 px-2 text-green/60">PAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.visitors.slice(0, 20).map((visitor) => (
                    <tr
                      key={visitor.id}
                      className="border-b border-green/10 hover:bg-green/5 transition-colors"
                    >
                      <td className="py-3 px-2 text-green/80">
                        {new Date(visitor.timestamp).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-3 px-2 text-cyan">{visitor.ip}</td>
                      <td className="py-3 px-2 text-green/70">
                        {visitor.country}, {visitor.city}
                      </td>
                      <td className="py-3 px-2 text-yellow">{visitor.deviceType}</td>
                      <td className="py-3 px-2 text-green">{visitor.browser}</td>
                      <td className="py-3 px-2 text-pink">{visitor.os}</td>
                      <td className="py-3 px-2 text-cyan">{visitor.page}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="terminal-window p-5">
                <h4 className="text-xs text-green/60 font-mono mb-3">TOP_COUNTRIES</h4>
                <div className="space-y-2">
                  {[
                    ['CN', 45],
                    ['US', 25],
                    ['JP', 15],
                    ['DE', 8],
                    ['OTHER', 7]
                  ].map(([country, percent]) => (
                    <div key={country} className="flex items-center justify-between text-sm font-mono">
                      <span className="text-green">{country}</span>
                      <span className="text-cyan">{percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="terminal-window p-5">
                <h4 className="text-xs text-cyan/60 font-mono mb-3">HOURLY_TRAFFIC</h4>
                <div className="space-y-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-mono">
                      <span className="text-green/50 w-8">{`${8 + i}:00`}</span>
                      <div className="flex-1 h-2 bg-black/50 border border-green/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green to-cyan"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="terminal-window p-5">
                <h4 className="text-xs text-pink/60 font-mono mb-3">SESSION_STATS</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-green/60">AVG_DURATION</span>
                    <span className="text-pink">03:42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green/60">PAGES_PER_VISIT</span>
                    <span className="text-pink">5.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green/60">BOUNCE_RATE</span>
                    <span className="text-pink">42.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green/60">RETURN_RATE</span>
                    <span className="text-pink">67.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
