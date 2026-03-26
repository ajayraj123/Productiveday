import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { MoodEntry } from '../../types';
import { correlateMetrics } from '../../utils/analytics';

interface CorrelationScatterProps {
  entries: MoodEntry[];
}

export function CorrelationScatter({ entries }: CorrelationScatterProps) {
  const data = entries.map(e => ({ x: e.mood, y: e.energy }));
  const r = correlateMetrics(entries);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-2 text-xs">
        <p className="text-purple-300">Mood: {payload[0]?.value}</p>
        <p className="text-amber-300">Energy: {payload[1]?.value}</p>
      </div>
    );
  };

  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
        Need at least 3 entries for correlation
      </div>
    );
  }

  const rLabel = Math.abs(r) >= 0.7 ? 'Strong' : Math.abs(r) >= 0.4 ? 'Moderate' : 'Weak';
  const rColor = Math.abs(r) >= 0.7 ? 'text-emerald-400' : Math.abs(r) >= 0.4 ? 'text-amber-400' : 'text-gray-400';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Mood–Energy Correlation</h3>
        <span className={`text-xs font-medium ${rColor}`}>
          r = {r} ({rLabel})
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis type="number" dataKey="x" name="Mood" domain={[1, 10]} tick={{ fill: '#6b7280', fontSize: 11 }} label={{ value: 'Mood', position: 'insideBottom', offset: -2, fill: '#6b7280', fontSize: 11 }} />
          <YAxis type="number" dataKey="y" name="Energy" domain={[1, 10]} tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine stroke="#374151" segment={[{ x: 1, y: 1 }, { x: 10, y: 10 }]} strokeDasharray="4 4" />
          <Scatter data={data} fill="#a855f7" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
