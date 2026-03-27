import React from 'react';
import { useInsights } from '../hooks/useInsights';
import { useMoodEntries } from '../hooks/useMoodEntries';
import { Card } from '../components/ui/Card';
import { CircadianHeatmap } from '../components/charts/CircadianHeatmap';
import { DailyLineChart } from '../components/charts/DailyLineChart';
import { WeeklyBarChart } from '../components/charts/WeeklyBarChart';
import { QuickLogFAB } from '../components/dashboard/QuickLogFAB';

export function VisualizationsPage() {
  const { hourlyAverages, dailyStats } = useInsights();
  const { todayEntries } = useMoodEntries();

  return (
    <div className="space-y-5 py-4">
      <Card>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
          Circadian Rhythm Heatmap
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Average mood &amp; energy by hour of day, across all your data.
        </p>
        {hourlyAverages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">Log entries across different hours to see your circadian patterns.</p>
        ) : (
          <CircadianHeatmap hourlyAverages={hourlyAverages} />
        )}
      </Card>

      <Card>
        <DailyLineChart entries={todayEntries} />
      </Card>

      <Card>
        <WeeklyBarChart stats={dailyStats} />
      </Card>

      <QuickLogFAB />
    </div>
  );
}
