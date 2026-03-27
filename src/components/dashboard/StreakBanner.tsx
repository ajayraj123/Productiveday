import React from 'react';
import { useStreaks } from '../../hooks/useStreaks';

export function StreakBanner() {
  const { current, longest, totalDays } = useStreaks();

  if (totalDays === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800/40 rounded-2xl p-4 text-center">
        <p className="text-2xl mb-1">🌱</p>
        <p className="text-sm font-medium text-purple-200">Start your journey today</p>
        <p className="text-xs text-gray-400 mt-1">Log your first check-in to begin tracking</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-700/30 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-lg font-bold text-orange-300">{current} day streak</p>
            <p className="text-xs text-gray-400">Best: {longest} days · {totalDays} days tracked</p>
          </div>
        </div>
        {current >= 7 && (
          <span className="text-2xl">🏆</span>
        )}
      </div>
    </div>
  );
}
