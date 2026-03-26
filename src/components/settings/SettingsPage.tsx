import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { UserSettings } from '../../types';

export function SettingsPage() {
  const { state, dispatch } = useAppContext();
  const [form, setForm] = useState<UserSettings>(state.settings);
  const [saved, setSaved] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  function handleSave() {
    dispatch({ type: 'UPDATE_SETTINGS', payload: form });
    localStorage.setItem('pd-settings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleEnableNotifications() {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === 'granted') {
      setForm(f => ({ ...f, notificationsEnabled: true }));
    }
  }

  return (
    <div className="space-y-5 py-4">
      <Card>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Profile</h2>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Enter your name"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Work Hours</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Start</label>
            <select
              value={form.workHours.start}
              onChange={e => setForm(f => ({ ...f, workHours: { ...f.workHours, start: Number(e.target.value) } }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">End</label>
            <select
              value={form.workHours.end}
              onChange={e => setForm(f => ({ ...f, workHours: { ...f.workHours, end: Number(e.target.value) } }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Reminders</h2>

        {notifPermission === 'denied' && (
          <p className="text-xs text-red-400 mb-3">Notifications are blocked. Please allow them in your browser settings.</p>
        )}

        {notifPermission !== 'granted' && notifPermission !== 'denied' && (
          <button
            onClick={handleEnableNotifications}
            className="w-full mb-3 py-2 bg-purple-900/40 border border-purple-700/40 rounded-xl text-sm text-purple-300 hover:bg-purple-900/60 transition-colors"
          >
            Enable Notifications
          </button>
        )}

        {notifPermission === 'granted' && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Reminder notifications</span>
            <button
              onClick={() => setForm(f => ({ ...f, notificationsEnabled: !f.notificationsEnabled }))}
              className={`w-12 h-6 rounded-full transition-colors ${form.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.notificationsEnabled ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-300 mb-1">Reminder interval</label>
          <select
            value={form.reminderInterval}
            onChange={e => setForm(f => ({ ...f, reminderInterval: Number(e.target.value) }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value={0}>Off</option>
            <option value={1}>Every 1 hour</option>
            <option value={2}>Every 2 hours</option>
            <option value={3}>Every 3 hours</option>
            <option value={4}>Every 4 hours</option>
          </select>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        {saved ? '✓ Saved!' : 'Save Settings'}
      </Button>
    </div>
  );
}
