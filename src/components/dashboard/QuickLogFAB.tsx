import React from 'react';
import { useAppContext } from '../../store/AppContext';

export function QuickLogFAB() {
  const { dispatch } = useAppContext();

  return (
    <button
      onClick={() => dispatch({ type: 'OPEN_LOG_MODAL' })}
      className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/50 flex items-center justify-center text-2xl transition-all active:scale-95 hover:scale-105"
      aria-label="Log check-in"
    >
      +
    </button>
  );
}
