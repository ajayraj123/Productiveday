import React from 'react';
import { StreakBanner } from './StreakBanner';
import { CurrentStatus } from './CurrentStatus';
import { QuickLogFAB } from './QuickLogFAB';
import { LogTimeline } from '../log/LogTimeline';
import { useMoodEntries } from '../../hooks/useMoodEntries';
import { useInsights } from '../../hooks/useInsights';
import { ProgressRing } from '../ui/ProgressRing';
import { Card } from '../ui/Card';

export function DashboardPage() {
  const { todayEntries, deleteEntry } = useMoodEntries();
  const { todayScore, recommendations } = useInsights();

  const topRec = recommendations[0];

  return (
    <div className="space-y-4 py-4">
      <StreakBanner />

      <CurrentStatus />

      {/* Mini productivity score */}
      {todayScore > 0 && (
        <Card>
          <div className="flex items-center gap-4">
            <ProgressRing value={todayScore} size={80} strokeWidth={8} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Today's Score</p>
              <p className="text-sm text-white font-medium">
                {todayScore >= 75 ? '🚀 Excellent day!' : todayScore >= 50 ? '👍 Going well' : '🌱 Keep logging'}
              </p>
              {topRec && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{topRec.reasoning}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Today's timeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Today's Log</h2>
          <span className="text-xs text-gray-500">{todayEntries.length} entries</span>
        </div>
        <LogTimeline entries={todayEntries} onDelete={deleteEntry} />
      </div>

      <QuickLogFAB />
    </div>
  );
}
