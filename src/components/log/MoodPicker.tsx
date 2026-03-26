import React from 'react';
import { EMOJI_MAP, MOOD_LABELS } from '../../constants';

interface MoodPickerProps {
  value: number | null;
  onSelect: (value: number) => void;
}

export function MoodPicker({ value, onSelect }: MoodPickerProps) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(EMOJI_MAP).map(([num, emoji]) => {
          const n = Number(num);
          const isSelected = value === n;
          return (
            <button
              key={n}
              onClick={() => onSelect(n)}
              className={`
                flex flex-col items-center py-2 rounded-xl transition-all duration-150
                ${isSelected
                  ? 'bg-purple-600 scale-110 shadow-lg shadow-purple-900/50'
                  : 'bg-gray-800 hover:bg-gray-700'}
              `}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-gray-400 mt-0.5">{n}</span>
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-center text-sm text-purple-300 mt-2 font-medium">
          {EMOJI_MAP[value]} {MOOD_LABELS[value]}
        </p>
      )}
    </div>
  );
}
