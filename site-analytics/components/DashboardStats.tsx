"use client";

import { StatsData } from '@/lib/api-client';

interface Props {
  analytics: StatsData;
}

export default function DashboardStats({ analytics }: Props) {
  const stats = [
    {
      title: 'TOTAL_VISITS',
      value: analytics.totalVisits.toLocaleString(),
      icon: '👁',
      color: 'green',
      progress: Math.min((analytics.totalVisits / 10000) * 100, 100)
    },
    {
      title: 'UNIQUE_VISITORS',
      value: analytics.uniqueVisitors.toLocaleString(),
      icon: '👤',
      color: 'cyan',
      progress: Math.min((analytics.uniqueVisitors / 5000) * 100, 100)
    },
    {
      title: 'TOTAL_CLICKS',
      value: analytics.totalClicks.toLocaleString(),
      icon: '🖱',
      color: 'yellow',
      progress: Math.min((analytics.totalClicks / 50000) * 100, 100)
    },
    {
      title: 'PERFORMANCE',
      value: `${analytics.performanceScore}/100`,
      icon: '⚡',
      color: 'pink',
      progress: analytics.performanceScore
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="terminal-window p-5 hover:border-green/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{stat.icon}</span>
            <span className={`text-${stat.color} text-xs font-mono px-2 py-1 border border-${stat.color}/30`}>
              LIVE
            </span>
          </div>
          <div className="text-xs text-green/60 font-mono mb-1">
            {stat.title}
          </div>
          <div className={`text-3xl font-cyber font-bold text-${stat.color} mb-4`}>
            {stat.value}
          </div>
          <div className="h-2 bg-black/50 border border-green/20 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-${stat.color} transition-all duration-1000`}
              style={{ width: `${stat.progress}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-green/50 font-mono">
            <span>0%</span>
            <span className={`text-${stat.color}`}>{Math.round(stat.progress)}%</span>
            <span>100%</span>
          </div>
        </div>
      ))}

      <div className="lg:col-span-4 terminal-window p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-green">PAGE_VIEWS_DISTRIBUTION</h3>
          <span className="text-xs text-cyan font-mono">[{Object.keys(analytics.pageViews).length} PAGES]</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(analytics.pageViews)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([page, count]) => (
            <div key={page} className="text-center">
              <div className="text-lg font-cyber text-cyan font-bold">
                {count.toLocaleString()}
              </div>
              <div className="text-xs text-green/60 font-mono mt-1 break-all">
                {page}
              </div>
              <div className="mt-2 h-16 bg-black/50 border border-green/20 relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan to-cyan/30 transition-all duration-1000"
                  style={{ 
                    height: `${(count / Math.max(...Object.values(analytics.pageViews))) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
