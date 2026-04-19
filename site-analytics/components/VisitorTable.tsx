"use client";

import { StatsData } from '@/lib/api-client';
import { useState } from 'react';

interface Props {
  analytics: StatsData;
}

export default function VisitorTable({ analytics }: Props) {
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null);

  const getDeviceIcon = (device: string) => {
    const devices: Record<string, string> = {
      Desktop: '💻',
      Mobile: '📱',
      Tablet: '📟'
    };
    return devices[device] || '💻';
  };

  const getBrowserColor = (browser: string) => {
    const colors: Record<string, string> = {
      Chrome: 'text-green',
      Firefox: 'text-orange-400',
      Safari: 'text-gray-400',
      Edge: 'text-cyan',
      Opera: 'text-red'
    };
    return colors[browser] || 'text-green';
  };

  return (
    <div className="terminal-window p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-green">VISITOR_LOGS</h3>
        <span className="text-xs text-cyan font-mono">
          {analytics.visitors.length} ENTRIES
        </span>
      </div>
      
      <div className="overflow-x-auto">
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
              <th className="py-3 px-2 text-green/60">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {analytics.visitors.slice(0, 15).map((visitor, idx) => (
              <tr
                key={visitor.id}
                className={`border-b border-green/10 hover:bg-green/5 transition-colors ${idx === 0 ? 'bg-green/5' : ''}`}
              >
                <td className="py-3 px-2 text-green/80">
                  {new Date(visitor.timestamp).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </td>
                <td className="py-3 px-2 text-cyan">{visitor.ip}</td>
                <td className="py-3 px-2 text-green/70">
                  {visitor.country}, {visitor.city}
                </td>
                <td className="py-3 px-2">
                  <span className="text-lg">{getDeviceIcon(visitor.deviceType || 'Desktop')}</span>
                  <span className="ml-2 text-yellow text-xs">{visitor.deviceType}</span>
                </td>
                <td className={`py-3 px-2 ${getBrowserColor(visitor.browser || 'Chrome')}`}>
                  {visitor.browser}
                </td>
                <td className="py-3 px-2 text-pink">{visitor.os}</td>
                <td className="py-3 px-2 text-cyan">{visitor.page}</td>
                <td className="py-3 px-2">
                  <button
                    onClick={() =>
                      setSelectedVisitor(
                        selectedVisitor === visitor.id ? null : visitor.id
                      )
                    }
                    className="px-3 py-1 text-xs border border-green/50 text-green hover:bg-green/10 transition-all"
                  >
                    INSPECT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedVisitor && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="terminal-window max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-green/30 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red rounded-full"></div>
                <div className="w-3 h-3 bg-yellow rounded-full"></div>
                <div className="w-3 h-3 bg-green rounded-full"></div>
                <span className="ml-4 text-green font-mono">visitor_details.hex</span>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="text-green hover:text-cyan text-xl"
              >
                ✕
              </button>
            </div>
            {(() => {
              const visitor = analytics.visitors.find(
                (v) => v.id === selectedVisitor
              );
              if (!visitor) return null;
              return (
                <div className="space-y-4">
                  <div className="border border-green/30 p-4 bg-black/30">
                    <h4 className="text-green/60 text-xs mb-3 font-mono">BASIC_INFO</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-cyan/60">visitor_id:</span>
                        <span className="text-green ml-2 break-all">{visitor.id}</span>
                      </div>
                      <div>
                        <span className="text-cyan/60">ip_address:</span>
                        <span className="text-green ml-2">{visitor.ip}</span>
                      </div>
                      <div>
                        <span className="text-cyan/60">location:</span>
                        <span className="text-green ml-2">{visitor.country}, {visitor.city}</span>
                      </div>
                      <div>
                        <span className="text-cyan/60">first_seen:</span>
                        <span className="text-green ml-2">
                          {new Date(visitor.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-cyan/30 p-4 bg-black/30">
                    <h4 className="text-cyan/60 text-xs mb-3 font-mono">DEVICE_FINGERPRINT</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-cyan/60">device:</span>
                        <span className="text-yellow ml-2">{visitor.deviceType}</span>
                      </div>
                      <div>
                        <span className="text-cyan/60">browser:</span>
                        <span className="text-green ml-2">{visitor.browser}</span>
                      </div>
                      <div>
                        <span className="text-cyan/60">os:</span>
                        <span className="text-pink ml-2">{visitor.os}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-pink/30 p-4 bg-black/30">
                    <h4 className="text-pink/60 text-xs mb-3 font-mono">ACTIVITY_DATA</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-cyan/60">current_page:</span>
                        <span className="text-green ml-2">{visitor.page}</span>
                      </div>
                      <div>
                        <span className="text-cyan/60">referrer:</span>
                        <span className="text-cyan ml-2 break-all">{visitor.referrer}</span>
                      </div>
                      {visitor.screenWidth && (
                        <div>
                          <span className="text-cyan/60">screen_res:</span>
                          <span className="text-cyan ml-2">{visitor.screenWidth}x{visitor.screenHeight}</span>
                        </div>
                      )}
                      {visitor.language && (
                        <div>
                          <span className="text-cyan/60">language:</span>
                          <span className="text-cyan ml-2">{visitor.language}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-yellow/30 p-4 bg-black/30">
                    <h4 className="text-yellow/60 text-xs mb-3 font-mono">USER_AGENT_STRING</h4>
                    <div className="text-xs text-green/70 break-all bg-black/50 p-3 border border-yellow/20">
                      {visitor.userAgent}
                    </div>
                  </div>

                  <div className="border border-green/20 p-4 bg-black/50">
                    <h4 className="text-green/40 text-xs mb-3 font-mono">RAW_DATA (JSON)</h4>
                    <pre className="text-xs text-green/60 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(visitor, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
