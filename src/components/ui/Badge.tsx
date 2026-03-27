import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'amber' | 'emerald' | 'red' | 'blue' | 'gray';
  className?: string;
}

const colorClasses = {
  purple: 'bg-purple-900/50 text-purple-300 border-purple-700',
  amber: 'bg-amber-900/50 text-amber-300 border-amber-700',
  emerald: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  red: 'bg-red-900/50 text-red-300 border-red-700',
  blue: 'bg-blue-900/50 text-blue-300 border-blue-700',
  gray: 'bg-gray-800 text-gray-400 border-gray-700',
};

export function Badge({ children, color = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
