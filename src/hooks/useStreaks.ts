import { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { groupEntriesByDay, todayString } from '../utils/dateHelpers';
import { format, subDays, parseISO, differenceInCalendarDays } from 'date-fns';

export function useStreaks() {
  const { state } = useAppContext();

  return useMemo(() => {
    const byDay = groupEntriesByDay(state.entries);
    const trackedDays = Array.from(byDay.keys()).sort().reverse(); // newest first

    if (trackedDays.length === 0) return { current: 0, longest: 0, totalDays: 0 };

    const today = todayString();
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    // Current streak: count consecutive days back from today or yesterday
    let current = 0;
    const startDay = trackedDays[0] === today || trackedDays[0] === yesterday
      ? trackedDays[0]
      : null;

    if (startDay) {
      let checkDate = parseISO(startDay);
      for (const day of trackedDays) {
        const diff = differenceInCalendarDays(checkDate, parseISO(day));
        if (diff === 0) {
          current++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }

    // Longest streak
    let longest = 0;
    let streak = 1;
    const sorted = [...trackedDays].sort(); // oldest first

    for (let i = 1; i < sorted.length; i++) {
      const diff = differenceInCalendarDays(parseISO(sorted[i]), parseISO(sorted[i - 1]));
      if (diff === 1) {
        streak++;
      } else {
        longest = Math.max(longest, streak);
        streak = 1;
      }
    }
    longest = Math.max(longest, streak);

    return { current, longest, totalDays: trackedDays.length };
  }, [state.entries]);
}
