import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { QuickLogModal } from '../log/QuickLogModal';
import { Toast } from '../ui/Toast';
import { useAppContext } from '../../store/AppContext';

const PAGE_TITLES: Record<string, string> = {
  '/': 'ProductiveDay',
  '/charts': 'Visualizations',
  '/insights': 'Insights',
  '/history': 'History',
  '/settings': 'Settings',
};

export function AppShell() {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const [toast, setToast] = useState<string | null>(null);

  const title = PAGE_TITLES[location.pathname] ?? 'ProductiveDay';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header title={title} />
      <main className="pb-24 px-4 max-w-2xl mx-auto pt-2">
        <Outlet context={{ showToast: setToast }} />
      </main>
      <BottomNav />
      <QuickLogModal
        isOpen={state.isLogModalOpen}
        onClose={() => dispatch({ type: 'CLOSE_LOG_MODAL' })}
        onSaved={() => setToast('Entry saved!')}
      />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
