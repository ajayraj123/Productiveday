import React, { useRef, useState, useEffect } from 'react';
import type { HourlyAverage } from '../../types';
import { formatHour } from '../../utils/dateHelpers';

interface CircadianHeatmapProps {
  hourlyAverages: HourlyAverage[];
}

function valueToColor(value: number | null, type: 'mood' | 'energy'): string {
  if (value === null) return '#111827';

  const normalized = (value - 1) / 9; // 0..1

  if (type === 'mood') {
    // Red → Purple → Blue
    const r = Math.round(220 - normalized * 180);
    const g = Math.round(30 + normalized * 50);
    const b = Math.round(80 + normalized * 160);
    return `rgb(${r},${g},${b})`;
  } else {
    // Red → Amber → Green
    if (normalized < 0.5) {
      const t = normalized * 2;
      const r = Math.round(220 - t * 20);
      const g = Math.round(50 + t * 110);
      const b = 0;
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (normalized - 0.5) * 2;
      const r = Math.round(200 - t * 160);
      const g = Math.round(160 + t * 60);
      const b = Math.round(t * 80);
      return `rgb(${r},${g},${b})`;
    }
  }
}

export function CircadianHeatmap({ hourlyAverages }: CircadianHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const [tooltip, setTooltip] = useState<{ hour: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);
    setWidth(containerRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const avgByHour = new Map(hourlyAverages.map(h => [h.hour, h]));
  const cellW = width / 24;
  const cellH = 40;
  const labelH = 20;
  const totalH = labelH + cellH * 2 + 20;

  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div ref={containerRef} className="w-full relative">
      <svg width="100%" height={totalH} style={{ display: 'block' }}>
        {/* Hour labels */}
        {HOURS.filter(h => h % 3 === 0).map(h => (
          <text
            key={h}
            x={h * cellW + cellW / 2}
            y={14}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={9}
          >
            {formatHour(h)}
          </text>
        ))}

        {/* Row labels */}
        <text x={2} y={labelH + cellH / 2 + 4} fill="#a855f7" fontSize={9}>Mood</text>
        <text x={2} y={labelH + cellH + cellH / 2 + 4} fill="#f59e0b" fontSize={9}>Energy</text>

        {/* Mood row */}
        {HOURS.map(h => {
          const avg = avgByHour.get(h);
          return (
            <rect
              key={`m-${h}`}
              x={h * cellW + 1}
              y={labelH}
              width={cellW - 2}
              height={cellH - 2}
              rx={3}
              fill={avg ? valueToColor(avg.avgMood, 'mood') : '#111827'}
              opacity={avg ? 0.85 + avg.sampleCount * 0.02 : 0.3}
              onMouseEnter={() => setTooltip({ hour: h, x: h * cellW, y: labelH })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Energy row */}
        {HOURS.map(h => {
          const avg = avgByHour.get(h);
          return (
            <rect
              key={`e-${h}`}
              x={h * cellW + 1}
              y={labelH + cellH}
              width={cellW - 2}
              height={cellH - 2}
              rx={3}
              fill={avg ? valueToColor(avg.avgEnergy, 'energy') : '#111827'}
              opacity={avg ? 0.85 + avg.sampleCount * 0.02 : 0.3}
              onMouseEnter={() => setTooltip({ hour: h, x: h * cellW, y: labelH + cellH })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip !== null && avgByHour.get(tooltip.hour) && (() => {
        const avg = avgByHour.get(tooltip.hour)!;
        const left = Math.min(tooltip.x, width - 130);
        return (
          <div
            className="absolute pointer-events-none bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs z-10"
            style={{ left, top: tooltip.y - 50 }}
          >
            <p className="text-gray-300 font-medium">{formatHour(tooltip.hour)}</p>
            <p className="text-purple-300">Mood: {avg.avgMood}</p>
            <p className="text-amber-300">Energy: {avg.avgEnergy}</p>
            <p className="text-gray-500">{avg.sampleCount} samples</p>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#111827', border: '1px solid #374151' }} />
          No data
        </span>
        <span className="flex items-center gap-1">
          <span className="w-10 h-3 rounded-sm inline-block" style={{ background: 'linear-gradient(to right, #dc2626, #4ade80)' }} />
          Low → High
        </span>
      </div>
    </div>
  );
}
