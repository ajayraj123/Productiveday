import type { AppState, AppAction } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

export const initialState: AppState = {
  entries: [],
  settings: { ...DEFAULT_SETTINGS },
  isLogModalOpen: false,
  selectedDate: null,
};

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_ENTRIES':
      return {
        ...state,
        entries: [...action.payload].sort((a, b) => b.timestamp - a.timestamp),
      };

    case 'ADD_ENTRY':
      return {
        ...state,
        entries: [action.payload, ...state.entries],
        isLogModalOpen: false,
      };

    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(e => e.id !== action.payload),
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'OPEN_LOG_MODAL':
      return { ...state, isLogModalOpen: true };

    case 'CLOSE_LOG_MODAL':
      return { ...state, isLogModalOpen: false };

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };

    default:
      return state;
  }
}
