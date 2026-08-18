// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie
} from 'recharts';
import { Shield, Layers } from 'lucide-react';

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#3b82f6'
};

const CATEGORY_COLORS = [
  '#00f2fe',
  '#38ef7d',
  '#ff9966',
  '#b92b27',
  '#8a2387',
  '#4facfe',
  '#f093fb',
  '#43e97b'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs font-mono">
        <p className="font-semibold text-slate-200 uppercase tracking-wide">{label || payload[0].name}</p>
        <p className="text-cyan-400 mt-1">
          Count: <span className="font-bold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function BugChart({
  title = "Bug Severity Distribution",
  subtitle = "Visual summary of issue severity breakdown",
  data = [],
  chartType = "bar", // 'bar' | 'horizontal-bar' | 'pie'
  icon: Icon = Shield
}) {
  const totalCount = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-medium font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
          Total: {totalCount}
        </span>
      </div>

      {/* Chart Body */}
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-mono">
          No data available
        </div>
      ) : chartType === 'horizontal-bar' ? (
        <div className="space-y-3 py-2 flex-1 justify-center flex flex-col">
          {data.map((item, index) => {
            const percentage = totalCount > 0 ? Math.round((item.value / totalCount) * 100) : 0;
            const barColor = item.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length];
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: barColor }} />
                    <span>{item.name}</span>
                  </span>
                  <span className="text-slate-400 font-mono">
                    {item.value} <span className="text-slate-400 text-[10px]">({percentage}%)</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: barColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : chartType === 'pie' ? (
        <div className="h-64 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    stroke="#0f172a"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white font-mono">{totalCount}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total</span>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {data.map((entry, index) => {
                  const upperName = entry.name.toUpperCase();
                  const barColor = entry.color || SEVERITY_COLORS[upperName] || CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                  return <Cell key={`cell-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

