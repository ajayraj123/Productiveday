import React from 'react';
import { useInsights } from '../../hooks/useInsights';
import { ProgressRing } from '../ui/ProgressRing';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CorrelationScatter } from '../charts/CorrelationScatter';
import { useAppContext } from '../../store/AppContext';
import { WORK_TYPE_ICONS, WORK_TYPE_LABELS } from '../../constants';
import { formatHour } from '../../utils/dateHelpers';
import type { EnergyWindowLabel } from '../../types';

const windowColors: Record<EnergyWindowLabel, { badge: 'emerald' | 'amber' | 'blue' | 'red' | 'gray'; border: string }> = {
  peak: { badge: 'emerald', border: 'border-l-emerald-500' },
  high: { badge: 'amber', border: 'border-l-amber-500' },
  moderate: { badge: 'blue', border: 'border-l-blue-500' },
  low: { badge: 'gray', border: 'border-l-gray-500' },
  crash: { badge: 'red', border: 'border-l-red-500' },
};

export function InsightsPage() {
  const { todayScore, energyWindows, recommendations } = useInsights();
  const { state } = useAppContext();

  const hasEnoughData = state.entries.length >= 5;

  return (
    <div className="space-y-5 py-4">
      {/* Productivity Score */}
      <Card>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Today's Score</h2>
        <div className="flex items-center gap-5">
          <ProgressRing
            value={todayScore}
            size={100}
            strokeWidth={9}
            color={todayScore >= 70 ? '#10b981' : todayScore >= 40 ? '#f59e0b' : '#6b7280'}
            label="/ 100"
          />
          <div className="flex-1">
            <p className="text-base font-semibold text-white mb-1">
              {todayScore === 0
                ? 'Log check-ins to see your score'
                : todayScore >= 75
                  ? '🚀 Peak productivity day!'
                  : todayScore >= 50
                    ? '👍 Solid performance'
                    : '🌱 Getting started'}
            </p>
            <p className="text-xs text-gray-500">
              Score is based on your average mood &amp; energy weighted by logging consistency (4+ entries = full score).
            </p>
          </div>
        </div>
      </Card>

      {/* Energy Windows */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Your Energy Windows</h2>
        {!hasEnoughData ? (
          <Card>
            <p className="text-sm text-gray-400 text-center py-4">
              Log at least 5 entries to discover your energy patterns.
            </p>
          </Card>
        ) : energyWindows.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-400 text-center py-4">
              No energy patterns detected yet. Keep logging!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {energyWindows.map((win, i) => {
              const colors = windowColors[win.label];
              return (
                <Card key={i} className={`border-l-4 ${colors.border}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-semibold text-white">
                      {formatHour(win.startHour)} – {formatHour(win.endHour + 1)}
                    </span>
                    <Badge color={colors.badge}>{win.label}</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{win.recommendation}</p>
                  <p className="text-xs text-gray-500 mt-1">Avg energy: {win.avgEnergy}/10</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Productivity Recommendations</h2>
        {recommendations.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-400 text-center py-4">
              Log for at least 3 days to unlock personalized recommendations.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <Card key={i}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{WORK_TYPE_ICONS[rec.workType]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{WORK_TYPE_LABELS[rec.workType]}</span>
                      <span className="text-xs text-gray-500">{Math.round(rec.confidence * 100)}% conf.</span>
                    </div>
                    <p className="text-xs text-gray-400">{rec.reasoning}</p>
                    <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${rec.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Correlation */}
      <Card>
        <CorrelationScatter entries={state.entries} />
      </Card>
    </div>
  );
}
