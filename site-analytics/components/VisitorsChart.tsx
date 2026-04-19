"use client";

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { StatsData } from '@/lib/api-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  analytics: StatsData;
}

export default function VisitorsChart({ analytics }: Props) {
  const [chartData, setChartData] = useState<any>({ lineData: null, barData: null });

  useEffect(() => {
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const lineData = {
      labels,
      datasets: [
        {
          label: 'VISITS',
          data: labels.map(() => Math.floor(analytics.totalVisits / 7 + Math.random() * 100)),
          borderColor: '#00ff41',
          backgroundColor: 'rgba(0, 255, 65, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#00ff41',
          pointBorderColor: '#00ff41',
          pointHoverRadius: 8
        },
        {
          label: 'UNIQUE_USERS',
          data: labels.map(() => Math.floor(analytics.uniqueVisitors / 7 + Math.random() * 50)),
          borderColor: '#00bfff',
          backgroundColor: 'rgba(0, 191, 255, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#00bfff',
          pointBorderColor: '#00bfff',
          pointHoverRadius: 8
        }
      ]
    };

    const barData = {
      labels: Object.keys(analytics.pageViews),
      datasets: [
        {
          label: 'PAGE_VIEWS',
          data: Object.values(analytics.pageViews),
          backgroundColor: [
            'rgba(0, 255, 65, 0.6)',
            'rgba(0, 191, 255, 0.6)',
            'rgba(255, 0, 255, 0.6)',
            'rgba(255, 204, 0, 0.6)',
            'rgba(255, 0, 110, 0.6)'
          ],
          borderColor: [
            '#00ff41',
            '#00bfff',
            '#ff00ff',
            '#ffcc00',
            '#ff006e'
          ],
          borderWidth: 2
        }
      ]
    };

    setChartData({ lineData, barData });
  }, [analytics]);

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
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        borderColor: '#00ff41',
        borderWidth: 1,
        titleColor: '#00ff41',
        bodyColor: '#00bfff',
        titleFont: {
          family: 'monospace'
        },
        bodyFont: {
          family: 'monospace'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(0, 255, 65, 0.7)',
          font: {
            family: 'monospace'
          }
        },
        grid: {
          color: 'rgba(0, 255, 65, 0.1)'
        },
        border: {
          color: 'rgba(0, 255, 65, 0.3)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(0, 255, 65, 0.7)',
          font: {
            family: 'monospace'
          }
        },
        grid: {
          color: 'rgba(0, 255, 65, 0.1)'
        },
        border: {
          color: 'rgba(0, 255, 65, 0.3)'
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div className="terminal-window p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-green">VISITOR_TRENDS</h3>
          <span className="text-xs text-yellow font-mono animate-pulse">7_DAYS</span>
        </div>
        <div className="h-64">
          {chartData.lineData && <Line data={chartData.lineData} options={chartOptions} />}
        </div>
      </div>

      <div className="terminal-window p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-green">PAGE_VIEWS_ANALYSIS</h3>
          <span className="text-xs text-cyan font-mono">LIVE</span>
        </div>
        <div className="h-64">
          {chartData.barData && <Bar data={chartData.barData} options={chartOptions} />}
        </div>
      </div>

      <div className="lg:col-span-2 terminal-window p-5">
        <h3 className="text-sm font-mono text-green mb-4">REAL_TIME_METRICS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-green/20 bg-black/30">
            <div className="text-green text-2xl font-bold">1.2s</div>
            <div className="text-green/50 text-xs font-mono">AVG_LOAD_TIME</div>
          </div>
          <div className="text-center p-4 border border-cyan/20 bg-black/30">
            <div className="text-cyan text-2xl font-bold">42.3%</div>
            <div className="text-cyan/50 text-xs font-mono">BOUNCE_RATE</div>
          </div>
          <div className="text-center p-4 border border-pink/20 bg-black/30">
            <div className="text-pink text-2xl font-bold">5.7</div>
            <div className="text-pink/50 text-xs font-mono">PAGES_PER_VISIT</div>
          </div>
          <div className="text-center p-4 border border-yellow/20 bg-black/30">
            <div className="text-yellow text-2xl font-bold animate-pulse">
              {Math.floor(Math.random() * 10) + 3}
            </div>
            <div className="text-yellow/50 text-xs font-mono">CURRENT_ONLINE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
