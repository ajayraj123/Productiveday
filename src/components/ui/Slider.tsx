import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  colorClass?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
  colorClass = 'accent-purple-500',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">{label}</span>
          <span className="text-lg font-bold text-white">{value}</span>
        </div>
      )}
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-700 ${colorClass}`}
          style={{
            background: `linear-gradient(to right, var(--slider-color, #9333ea) ${pct}%, #374151 ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
