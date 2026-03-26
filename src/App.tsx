import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { VisualizationsPage } from './pages/VisualizationsPage';
import { InsightsPage } from './components/insights/InsightsPage';
import { HistoryPage } from './components/history/HistoryPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { useNotifications } from './hooks/useNotifications';

function NotificationScheduler() {
  useNotifications();
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'charts', element: <VisualizationsPage /> },
      { path: 'insights', element: <InsightsPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <NotificationScheduler />
      <RouterProvider router={router} />
    </AppProvider>
  );
}
