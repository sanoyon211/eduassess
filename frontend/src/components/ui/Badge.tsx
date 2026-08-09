import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  // SaaS থিমের জন্য rounded-md পরিবর্তন করে rounded-full (pill shape) করা হয়েছে
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border';

  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200', // Teal/Emerald accent
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-brand-50 text-brand-700 border-brand-200', // Updated to Deep Indigo
    secondary: 'bg-gray-50 text-gray-600 border-gray-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}