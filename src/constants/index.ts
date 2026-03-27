export const EMOJI_MAP: Record<number, string> = {
  1: '😫',
  2: '😞',
  3: '😕',
  4: '😐',
  5: '🙂',
  6: '😊',
  7: '😄',
  8: '😁',
  9: '🤩',
  10: '🥳',
};

export const MOOD_LABELS: Record<number, string> = {
  1: 'Terrible',
  2: 'Very Bad',
  3: 'Bad',
  4: 'Below Average',
  5: 'Okay',
  6: 'Good',
  7: 'Pretty Good',
  8: 'Great',
  9: 'Excellent',
  10: 'Amazing',
};

export const ENERGY_LABELS: Record<number, string> = {
  1: 'Completely Drained',
  2: 'Exhausted',
  3: 'Very Tired',
  4: 'Tired',
  5: 'Okay',
  6: 'Decent',
  7: 'Energized',
  8: 'Very Energized',
  9: 'High Energy',
  10: 'Peak Energy',
};

// Tailwind color classes for mood (1=index 0, 10=index 9)
export const MOOD_COLORS = [
  'bg-red-600',
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-green-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
];

// Hex versions for recharts
export const MOOD_HEX = [
  '#dc2626',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#facc15',
  '#a3e635',
  '#4ade80',
  '#34d399',
  '#2dd4bf',
  '#22d3ee',
];

export const ENERGY_HEX = [
  '#dc2626',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#facc15',
  '#a3e635',
  '#4ade80',
  '#34d399',
  '#2dd4bf',
  '#22d3ee',
];

export const PRESET_TAGS = [
  'after-coffee',
  'post-lunch',
  'exercise',
  'poor-sleep',
  'stressed',
  'relaxed',
  'creative',
  'focused',
  'distracted',
  'social',
];

export const WORK_TYPE_LABELS: Record<string, string> = {
  'deep-work': 'Deep Work',
  'creative': 'Creative Work',
  'meetings': 'Meetings',
  'admin': 'Admin Tasks',
  'rest': 'Rest & Recovery',
};

export const WORK_TYPE_ICONS: Record<string, string> = {
  'deep-work': '⚡',
  'creative': '🎨',
  'meetings': '👥',
  'admin': '📋',
  'rest': '💤',
};

export const DEFAULT_SETTINGS = {
  name: '',
  reminderInterval: 2,
  workHours: { start: 9, end: 18 },
  notificationsEnabled: false,
};
