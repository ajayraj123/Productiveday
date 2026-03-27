import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction } from '../types';
import { reducer, initialState } from './reducer';
import { getAllEntries } from '../utils/storage';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load entries from IndexedDB on mount
  useEffect(() => {
    getAllEntries()
      .then(entries => {
        if (entries.length > 0) {
          dispatch({ type: 'LOAD_ENTRIES', payload: entries });
        }
      })
      .catch(err => console.error('Failed to load entries:', err));
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pd-settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed });
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
