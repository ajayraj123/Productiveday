import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatHour } from '../../utils/dateHelpers';
import type { MoodEntry } from '../../types';
import { EMOJI_MAP } from '../../constants';

interface DailyLineChartProps {
  entries: MoodEntry[];
  title?: string;
}

export function DailyLineChart({ entries, title = "Today's Mood & Energy" }: DailyLineChartProps) {
  const data = entries
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(e => ({
      time: formatHour(new Date(e.timestamp).getHours()),
      mood: e.mood,
      energy: e.energy,
      emoji: EMOJI_MAP[e.mood],
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        No data for today yet
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-2 text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-purple-300">Mood: {payload[0]?.value} {payload[0]?.payload?.emoji}</p>
        <p className="text-amber-300">Energy: {payload[1]?.value}</p>
      </div>
    );
  };

  return (
    <div>
      {title && <h3 className="text-sm font-medium text-gray-300 mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <YAxis domain={[1, 10]} tickCount={5} tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: '#a855f7', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
