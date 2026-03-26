import React from 'react';
import type { MoodEntry } from '../../types';
import { EMOJI_MAP } from '../../constants';
import { formatTime } from '../../utils/dateHelpers';
import { Badge } from '../ui/Badge';

interface LogTimelineProps {
  entries: MoodEntry[];
  onDelete?: (id: string) => void;
}

export function LogTimeline({ entries, onDelete }: LogTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-3xl mb-2">📝</p>
        <p className="text-sm">No entries yet. Log your first check-in!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="relative pl-10 group">
            <div className="absolute left-2 top-3 w-4 h-4 rounded-full bg-gray-700 border-2 border-purple-500 flex items-center justify-center">
              <span className="text-[8px]">{EMOJI_MAP[entry.mood]}</span>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{EMOJI_MAP[entry.mood]}</span>
                  <div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-purple-300 font-medium">Mood {entry.mood}</span>
                      <span className="text-amber-300 font-medium">Energy {entry.energy}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{formatTime(entry.timestamp)}</p>
                  </div>
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400 text-sm p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} color="gray">{tag}</Badge>
                  ))}
                </div>
              )}
              {entry.note && (
                <p className="text-xs text-gray-400 mt-2 italic">"{entry.note}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
