import React from 'react';
import { ENERGY_LABELS } from '../../constants';

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function EnergySlider({ value, onChange }: EnergySliderProps) {
  const pct = ((value - 1) / 9) * 100;

  const getColor = (v: number) => {
    if (v <= 2) return '#ef4444';
    if (v <= 4) return '#f97316';
    if (v <= 6) return '#f59e0b';
    if (v <= 8) return '#4ade80';
    return '#22d3ee';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">Energy Level</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold" style={{ color: getColor(value) }}>{value}</span>
          <span className="text-sm text-gray-400">{ENERGY_LABELS[value]}</span>
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${getColor(value)} ${pct}%, #374151 ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Exhausted</span>
        <span>Energized</span>
      </div>
    </div>
  );
}
