import React from 'react';

type Color = 'red' | 'dark' | 'green' | 'amber' | 'blue' | 'gray';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
  color?: Color;
}

const colorMap: Record<Color, string> = {
  red: 'bg-[#E30613]',
  dark: 'bg-gray-900',
  green: 'bg-green-600',
  amber: 'bg-amber-500',
  blue: 'bg-sky-600',
  gray: 'bg-gray-400',
};

export default function StatCard({ title, value, subtitle, trend, icon, color = 'red' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 leading-none">{value}</p>
          {subtitle && <p className="mt-1.5 text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${colorMap[color]} p-2.5 rounded-xl text-white flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
