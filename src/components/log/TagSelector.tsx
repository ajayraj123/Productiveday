import React, { useState } from 'react';
import { PRESET_TAGS } from '../../constants';

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {
  const [custom, setCustom] = useState('');

  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  }

  function addCustom() {
    const tag = custom.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !selected.includes(tag)) {
      onChange([...selected, tag]);
    }
    setCustom('');
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRESET_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selected.includes(tag)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCustom(); } }}
          placeholder="Add custom tag…"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={addCustom}
          disabled={!custom.trim()}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 rounded-lg text-sm text-white"
        >
          Add
        </button>
      </div>
    </div>
  );
}
