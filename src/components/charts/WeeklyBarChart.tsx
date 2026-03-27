import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DailyStats } from '../../types';
import { format, parseISO } from 'date-fns';

interface WeeklyBarChartProps {
  stats: DailyStats[];
  title?: string;
}

export function WeeklyBarChart({ stats, title = 'Weekly Overview' }: WeeklyBarChartProps) {
  const data = stats.slice(-14).map(s => ({
    day: format(parseISO(s.date), 'EEE d'),
    mood: s.avgMood,
    energy: s.avgEnergy,
    score: s.productivityScore,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        No weekly data yet
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-2 text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-purple-300">Mood: {payload[0]?.value}</p>
        <p className="text-amber-300">Energy: {payload[1]?.value}</p>
      </div>
    );
  };

  return (
    <div>
      {title && <h3 className="text-sm font-medium text-gray-300 mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <YAxis domain={[0, 10]} tickCount={5} tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          <Bar dataKey="mood" fill="#a855f7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="energy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
