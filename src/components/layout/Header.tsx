import React from 'react';
import { useStreaks } from '../../hooks/useStreaks';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { current } = useStreaks();

  return (
    <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      {current > 0 && (
        <div className="flex items-center gap-1 bg-orange-900/40 border border-orange-700/40 rounded-full px-3 py-1">
          <span className="text-sm">🔥</span>
          <span className="text-sm font-medium text-orange-300">{current}d</span>
        </div>
      )}
    </header>
  );
}
