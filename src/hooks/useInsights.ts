import { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import {
  computeHourlyAverages,
  computeEnergyWindows,
  computeProductivityScore,
  correlateMetrics,
  computeDailyStats,
} from '../utils/analytics';
import { generateRecommendations } from '../utils/scoring';
import { todayString } from '../utils/dateHelpers';

export function useInsights() {
  const { state } = useAppContext();

  const hourlyAverages = useMemo(
    () => computeHourlyAverages(state.entries),
    [state.entries]
  );

  const energyWindows = useMemo(
    () => computeEnergyWindows(hourlyAverages),
    [hourlyAverages]
  );

  const dailyStats = useMemo(
    () => computeDailyStats(state.entries),
    [state.entries]
  );

  const recommendations = useMemo(
    () => generateRecommendations(state.entries, state.settings),
    [state.entries, state.settings]
  );

  const todayScore = useMemo(
    () => computeProductivityScore(state.entries, todayString()),
    [state.entries]
  );

  const correlation = useMemo(
    () => correlateMetrics(state.entries),
    [state.entries]
  );

  return {
    hourlyAverages,
    energyWindows,
    dailyStats,
    recommendations,
    todayScore,
    correlation,
  };
}
