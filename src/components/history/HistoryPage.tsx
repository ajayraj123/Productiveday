import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { useMoodEntries } from '../../hooks/useMoodEntries';
import { useInsights } from '../../hooks/useInsights';
import { Card } from '../ui/Card';
import { LogTimeline } from '../log/LogTimeline';
import { WeeklyBarChart } from '../charts/WeeklyBarChart';
import { DailyLineChart } from '../charts/DailyLineChart';
import { groupEntriesByDay, formatDateLabel, getMonthDays, timestampToDateString } from '../../utils/dateHelpers';
import { format, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import { MOOD_HEX } from '../../constants';

function moodToColor(mood: number | null): string {
  if (!mood) return '#1f2937';
  return MOOD_HEX[Math.round(mood) - 1] ?? '#1f2937';
}

export function HistoryPage() {
  const { state, dispatch } = useAppContext();
  const { deleteEntry } = useMoodEntries();
  const { dailyStats } = useInsights();

  const today = new Date();
  const [viewDate, setViewDate] = useState(today);

  const days = getMonthDays(getYear(viewDate), getMonth(viewDate));
  const byDay = groupEntriesByDay(state.entries);

  // Average mood per day
  const dayMood = new Map<string, number>();
  for (const [dateStr, entries] of byDay) {
    const avg = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
    dayMood.set(dateStr, avg);
  }

  const selectedDate = state.selectedDate;
  const selectedEntries = selectedDate ? (byDay.get(selectedDate) ?? []) : [];

  return (
    <div className="space-y-5 py-4">
      {/* Calendar */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewDate(d => subMonths(d, 1))}
            className="text-gray-400 hover:text-white px-2 py-1"
          >
            ‹
          </button>
          <h2 className="text-sm font-semibold text-white">{format(viewDate, 'MMMM yyyy')}</h2>
          <button
            onClick={() => setViewDate(d => addMonths(d, 1))}
            className="text-gray-400 hover:text-white px-2 py-1"
          >
            ›
          </button>
        </div>

        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-xs text-gray-600 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for start of month */}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const mood = dayMood.get(dateStr);
            const isToday = dateStr === timestampToDateString(Date.now());
            const isSelected = dateStr === selectedDate;
            const hasData = mood !== undefined;

            return (
              <button
                key={dateStr}
                onClick={() => dispatch({
                  type: 'SET_SELECTED_DATE',
                  payload: isSelected ? null : dateStr,
                })}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                  ${isSelected ? 'ring-2 ring-purple-500 scale-110' : ''}
                  ${isToday ? 'ring-1 ring-white/30' : ''}
                `}
                style={{
                  background: hasData ? moodToColor(mood) + '99' : '#111827',
                  color: hasData ? '#fff' : '#4b5563',
                }}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm" style={{ background: '#111827', border: '1px solid #374151' }} />
            No data
          </span>
          <span className="flex items-center gap-1">
            <span className="w-10 h-3 rounded-sm" style={{ background: `linear-gradient(to right, ${MOOD_HEX[0]}, ${MOOD_HEX[9]})` }} />
            Low → High mood
          </span>
        </div>
      </Card>

      {/* Selected day detail */}
      {selectedDate && (
        <Card>
          <h2 className="text-sm font-semibold text-white mb-3">{formatDateLabel(selectedDate)}</h2>
          <DailyLineChart entries={selectedEntries} title="" />
          <div className="mt-4">
            <LogTimeline entries={selectedEntries.slice().sort((a, b) => b.timestamp - a.timestamp)} onDelete={deleteEntry} />
          </div>
        </Card>
      )}

      {/* Trend charts */}
      <Card>
        <WeeklyBarChart stats={dailyStats} title="14-Day Trend" />
      </Card>
    </div>
  );
}
