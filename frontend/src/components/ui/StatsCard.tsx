import React from 'react';
import { Skeleton } from './Skeleton';

export interface StatsCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  iconBgColor?: string;
  iconTextColor?: string;
  colorScheme?: 'brand' | 'accent' | 'emerald' | 'amber' | 'blue' | 'purple' | 'gray';
  isLoading?: boolean;
  className?: string;
}

const colorSchemeMap: Record<string, { bg: string; text: string }> = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconTextColor,
  colorScheme = 'brand',
  isLoading = false,
  className = '',
}: StatsCardProps) {
  const scheme = colorSchemeMap[colorScheme] || colorSchemeMap.brand;
  const bgClass = iconBgColor || scheme.bg;
  const textClass = iconTextColor || scheme.text;

  return (
    <div
      className={`bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`h-9 w-9 rounded-xl ${bgClass} ${textClass} flex items-center justify-center font-bold shrink-0`}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-24" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value ?? 0}</p>
      )}
      {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
    </div>
  );
}
