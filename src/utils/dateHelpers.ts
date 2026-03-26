import {
  format,
  isSameDay,
  startOfDay,
  subDays,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getHours,
  parseISO,
} from 'date-fns';
import type { MoodEntry } from '../types';

export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function getHourFromTimestamp(ts: number): number {
  return getHours(new Date(ts));
}

export function groupEntriesByDay(entries: MoodEntry[]): Map<string, MoodEntry[]> {
  const map = new Map<string, MoodEntry[]>();
  for (const entry of entries) {
    const key = format(new Date(entry.timestamp), 'yyyy-MM-dd');
    const arr = map.get(key) ?? [];
    arr.push(entry);
    map.set(key, arr);
  }
  return map;
}

export function groupEntriesByHour(entries: MoodEntry[]): Map<number, MoodEntry[]> {
  const map = new Map<number, MoodEntry[]>();
  for (const entry of entries) {
    const hour = getHourFromTimestamp(entry.timestamp);
    const arr = map.get(hour) ?? [];
    arr.push(entry);
    map.set(hour, arr);
  }
  return map;
}

export function isTodayEntry(entry: MoodEntry): boolean {
  return isSameDay(new Date(entry.timestamp), new Date());
}

export function getWeekEntries(entries: MoodEntry[], weeksBack = 0): MoodEntry[] {
  const end = startOfDay(subDays(new Date(), weeksBack * 7));
  const start = subDays(end, 7);
  return entries.filter(e => e.timestamp >= start.getTime() && e.timestamp < end.getTime() + 86400000);
}

export function getRecentEntries(entries: MoodEntry[], days: number): MoodEntry[] {
  const cutoff = subDays(new Date(), days).getTime();
  return entries.filter(e => e.timestamp >= cutoff);
}

export function formatDateLabel(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, MMM d');
}

export function getMonthDays(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
}

export function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function timestampToDateString(ts: number): string {
  return format(new Date(ts), 'yyyy-MM-dd');
}

export function formatTime(ts: number): string {
  return format(new Date(ts), 'h:mm a');
}
