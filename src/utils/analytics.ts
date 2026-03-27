import type { MoodEntry, HourlyAverage, DailyStats, EnergyWindow } from '../types';
import { groupEntriesByHour, groupEntriesByDay, timestampToDateString } from './dateHelpers';

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function computeHourlyAverages(entries: MoodEntry[]): HourlyAverage[] {
  const byHour = groupEntriesByHour(entries);
  const result: HourlyAverage[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const bucket = byHour.get(hour) ?? [];
    if (bucket.length === 0) continue;
    result.push({
      hour,
      avgMood: parseFloat(mean(bucket.map(e => e.mood)).toFixed(1)),
      avgEnergy: parseFloat(mean(bucket.map(e => e.energy)).toFixed(1)),
      sampleCount: bucket.length,
    });
  }

  return result;
}

export function computeDailyStats(entries: MoodEntry[]): DailyStats[] {
  const byDay = groupEntriesByDay(entries);
  const result: DailyStats[] = [];

  for (const [date, dayEntries] of byDay) {
    const avgMood = parseFloat(mean(dayEntries.map(e => e.mood)).toFixed(1));
    const avgEnergy = parseFloat(mean(dayEntries.map(e => e.energy)).toFixed(1));
    const consistency = Math.min(1.0, dayEntries.length / 4);
    const rawScore = avgMood * 0.4 + avgEnergy * 0.6;
    const productivityScore = Math.round((rawScore / 10) * 100 * consistency);

    result.push({ date, avgMood, avgEnergy, entryCount: dayEntries.length, productivityScore });
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

export function computeEnergyWindows(hourlyAvgs: HourlyAverage[]): EnergyWindow[] {
  if (hourlyAvgs.length === 0) return [];

  const labelFor = (energy: number): EnergyWindow['label'] => {
    if (energy >= 7.5) return 'peak';
    if (energy >= 6) return 'high';
    if (energy >= 4.5) return 'moderate';
    if (energy >= 3) return 'low';
    return 'crash';
  };

  const recommendationFor = (label: EnergyWindow['label']): string => {
    switch (label) {
      case 'peak': return 'Perfect for deep work, complex problem-solving, and important decisions.';
      case 'high': return 'Great for focused tasks, learning, and creative projects.';
      case 'moderate': return 'Good for meetings, collaborative work, and routine tasks.';
      case 'low': return 'Best for administrative tasks, email, and light planning.';
      case 'crash': return 'Take a break, go for a walk, or do a short nap if possible.';
    }
  };

  // Sort by hour for window detection
  const sorted = [...hourlyAvgs].sort((a, b) => a.hour - b.hour);

  const windows: EnergyWindow[] = [];
  let i = 0;

  while (i < sorted.length) {
    const current = sorted[i];
    const label = labelFor(current.avgEnergy);
    let j = i + 1;

    // Extend window while same label and hours are contiguous
    while (
      j < sorted.length &&
      labelFor(sorted[j].avgEnergy) === label &&
      sorted[j].hour === sorted[j - 1].hour + 1
    ) {
      j++;
    }

    const windowEntries = sorted.slice(i, j);
    const avgEnergy = parseFloat(mean(windowEntries.map(e => e.avgEnergy)).toFixed(1));

    windows.push({
      startHour: windowEntries[0].hour,
      endHour: windowEntries[windowEntries.length - 1].hour,
      avgEnergy,
      label,
      recommendation: recommendationFor(label),
    });

    i = j;
  }

  return windows;
}

export function computeProductivityScore(entries: MoodEntry[], date: string): number {
  const dayEntries = entries.filter(e => timestampToDateString(e.timestamp) === date);
  if (dayEntries.length === 0) return 0;

  const avgMood = mean(dayEntries.map(e => e.mood));
  const avgEnergy = mean(dayEntries.map(e => e.energy));
  const consistency = Math.min(1.0, dayEntries.length / 4);
  const rawScore = avgMood * 0.4 + avgEnergy * 0.6;

  return Math.round((rawScore / 10) * 100 * consistency);
}

export function correlateMetrics(entries: MoodEntry[]): number {
  if (entries.length < 3) return 0;

  const moods = entries.map(e => e.mood);
  const energies = entries.map(e => e.energy);

  const meanMood = mean(moods);
  const meanEnergy = mean(energies);

  let numerator = 0;
  let denomMood = 0;
  let denomEnergy = 0;

  for (let i = 0; i < entries.length; i++) {
    const dm = moods[i] - meanMood;
    const de = energies[i] - meanEnergy;
    numerator += dm * de;
    denomMood += dm * dm;
    denomEnergy += de * de;
  }

  const denom = Math.sqrt(denomMood * denomEnergy);
  if (denom === 0) return 0;

  return parseFloat((numerator / denom).toFixed(2));
}
