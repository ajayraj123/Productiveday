import React from 'react';
import { useMoodEntries } from '../../hooks/useMoodEntries';
import { EMOJI_MAP, MOOD_LABELS, ENERGY_LABELS } from '../../constants';
import { Card } from '../ui/Card';

export function CurrentStatus() {
  const { latestEntry, entries } = useMoodEntries();

  if (!latestEntry) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center py-6">
          <p className="text-3xl mb-1">😶</p>
          <p className="text-sm text-gray-500">No mood yet</p>
        </Card>
        <Card className="text-center py-6">
          <p className="text-3xl mb-1">⚡</p>
          <p className="text-sm text-gray-500">No energy yet</p>
        </Card>
      </div>
    );
  }

  // Trend: compare to entry before latest
  const prev = entries[1];
  const moodTrend = prev ? latestEntry.mood - prev.mood : 0;
  const energyTrend = prev ? latestEntry.energy - prev.energy : 0;

  const trendIcon = (diff: number) => {
    if (diff > 0) return <span className="text-emerald-400 text-sm">↑ {diff > 0 ? `+${diff}` : diff}</span>;
    if (diff < 0) return <span className="text-red-400 text-sm">↓ {diff}</span>;
    return <span className="text-gray-500 text-sm">—</span>;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Mood</span>
          {trendIcon(moodTrend)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-4xl">{EMOJI_MAP[latestEntry.mood]}</span>
          <div>
            <p className="text-2xl font-bold text-white">{latestEntry.mood}</p>
            <p className="text-xs text-gray-400">{MOOD_LABELS[latestEntry.mood]}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Energy</span>
          {trendIcon(energyTrend)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-4xl">⚡</span>
          <div>
            <p className="text-2xl font-bold text-amber-400">{latestEntry.energy}</p>
            <p className="text-xs text-gray-400">{ENERGY_LABELS[latestEntry.energy]}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
