import { useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';

export function useNotifications() {
  const { state, dispatch } = useAppContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    dispatch({ type: 'UPDATE_SETTINGS', payload: { notificationsEnabled: granted } });
    return granted;
  }

  function isWithinWorkHours(): boolean {
    const now = new Date().getHours();
    const { start, end } = state.settings.workHours;
    return now >= start && now < end;
  }

  function fireReminder() {
    if (!isWithinWorkHours()) return;
    if (Notification.permission !== 'granted') return;

    new Notification('ProductiveDay Check-in', {
      body: 'How are you feeling right now? Log your mood & energy.',
      icon: '/favicon.svg',
    });
  }

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const { notificationsEnabled, reminderInterval } = state.settings;
    if (!notificationsEnabled || reminderInterval === 0) return;

    const ms = reminderInterval * 60 * 60 * 1000;
    intervalRef.current = setInterval(fireReminder, ms);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.settings.notificationsEnabled, state.settings.reminderInterval]);

  return { requestPermission };
}
