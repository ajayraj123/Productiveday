import type { MoodEntry, UserSettings, ProductivityRecommendation, WorkType } from '../types';
import { computeHourlyAverages } from './analytics';
import { getRecentEntries } from './dateHelpers';
import { WORK_TYPE_LABELS } from '../constants';
import { formatHour } from './dateHelpers';

function formatHourRange(hours: number[]): string {
  if (hours.length === 0) return '';
  const sorted = [...hours].sort((a, b) => a - b);
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  return `${formatHour(start)}–${formatHour(end + 1)}`;
}

export function generateRecommendations(
  entries: MoodEntry[],
  settings: UserSettings
): ProductivityRecommendation[] {
  const recentEntries = getRecentEntries(entries, 30);
  if (recentEntries.length < 5) return [];

  const hourlyAvgs = computeHourlyAverages(recentEntries);

  const { start: workStart, end: workEnd } = settings.workHours;
  const workHourAvgs = hourlyAvgs.filter(
    h => h.hour >= workStart && h.hour < workEnd && h.sampleCount >= 2
  );

  if (workHourAvgs.length === 0) return [];

  const sorted = [...workHourAvgs].sort((a, b) => b.avgEnergy - a.avgEnergy);
  const maxSamples = Math.max(...workHourAvgs.map(h => h.sampleCount));

  const recommendations: ProductivityRecommendation[] = [];

  // Deep work: top energy hours
  const peakHours = sorted.slice(0, Math.min(3, Math.ceil(sorted.length / 3)));
  if (peakHours.length > 0) {
    const confidence = Math.min(1.0, maxSamples / 10);
    const hrs = peakHours.map(h => h.hour);
    recommendations.push({
      workType: 'deep-work',
      bestHours: hrs,
      confidence,
      reasoning: `Your energy is highest ${formatHourRange(hrs)}. Schedule deep work, coding, writing, or complex analysis here.`,
    });

    recommendations.push({
      workType: 'creative',
      bestHours: hrs,
      confidence: confidence * 0.9,
      reasoning: `Creative work also benefits from high-energy windows. Try brainstorming or design work ${formatHourRange(hrs)}.`,
    });
  }

  // Meetings + admin: lower energy hours
  const lowHours = sorted.slice(-Math.min(3, Math.ceil(sorted.length / 3)));
  if (lowHours.length > 0) {
    const confidence = Math.min(1.0, maxSamples / 10);
    const hrs = lowHours.map(h => h.hour);
    recommendations.push({
      workType: 'meetings',
      bestHours: hrs,
      confidence,
      reasoning: `Energy tends to dip ${formatHourRange(hrs)} — a good window for team meetings and syncs that don't require peak focus.`,
    });

    recommendations.push({
      workType: 'admin',
      bestHours: hrs,
      confidence,
      reasoning: `Use your lower-energy windows ${formatHourRange(hrs)} for email, scheduling, and routine administrative tasks.`,
    });
  }

  return recommendations.filter(r => r.confidence > 0.2);
}

export function getWorkTypeLabel(workType: WorkType): string {
  return WORK_TYPE_LABELS[workType] ?? workType;
}
