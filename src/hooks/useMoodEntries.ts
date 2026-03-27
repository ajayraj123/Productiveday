import { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import type { MoodEntry } from '../types';
import { generateId } from '../utils/idGenerator';
import { putEntry, deleteEntryFromDB } from '../utils/storage';
import { isTodayEntry } from '../utils/dateHelpers';

export function useMoodEntries() {
  const { state, dispatch } = useAppContext();

  const todayEntries = useMemo(
    () => state.entries.filter(isTodayEntry),
    [state.entries]
  );

  const latestEntry = state.entries[0] ?? null;

  function addEntry(data: Omit<MoodEntry, 'id' | 'timestamp'>) {
    const entry: MoodEntry = {
      ...data,
      id: generateId(),
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_ENTRY', payload: entry });
    putEntry(entry).catch(err => console.error('Failed to save entry:', err));
  }

  function deleteEntry(id: string) {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
    deleteEntryFromDB(id).catch(err => console.error('Failed to delete entry:', err));
  }

  return {
    entries: state.entries,
    todayEntries,
    latestEntry,
    addEntry,
    deleteEntry,
  };
}
