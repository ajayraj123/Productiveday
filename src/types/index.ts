export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: number;      // 1-10
  energy: number;    // 1-10
  note?: string;
  tags?: string[];
}

export interface UserSettings {
  name: string;
  reminderInterval: number;  // hours (0 = off)
  workHours: { start: number; end: number };
  notificationsEnabled: boolean;
}

export interface DailyStats {
  date: string;        // YYYY-MM-DD
  avgMood: number;
  avgEnergy: number;
  entryCount: number;
  productivityScore: number;
}

export interface HourlyAverage {
  hour: number;        // 0-23
  avgMood: number;
  avgEnergy: number;
  sampleCount: number;
}

export type EnergyWindowLabel = 'peak' | 'high' | 'moderate' | 'low' | 'crash';

export interface EnergyWindow {
  startHour: number;
  endHour: number;
  avgEnergy: number;
  label: EnergyWindowLabel;
  recommendation: string;
}

export type WorkType = 'deep-work' | 'creative' | 'meetings' | 'admin' | 'rest';

export interface ProductivityRecommendation {
  workType: WorkType;
  bestHours: number[];
  confidence: number;   // 0-1
  reasoning: string;
}

export type AppView = 'dashboard' | 'visualizations' | 'insights' | 'history' | 'settings';

export interface AppState {
  entries: MoodEntry[];
  settings: UserSettings;
  isLogModalOpen: boolean;
  selectedDate: string | null;
}

export type AppAction =
  | { type: 'ADD_ENTRY'; payload: MoodEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'OPEN_LOG_MODAL' }
  | { type: 'CLOSE_LOG_MODAL' }
  | { type: 'SET_SELECTED_DATE'; payload: string | null }
  | { type: 'LOAD_ENTRIES'; payload: MoodEntry[] };
