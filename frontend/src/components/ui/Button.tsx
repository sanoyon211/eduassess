import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className, children, disabled, ...props }, ref) => {
    // Updated to use rounded-xl and focus:ring-brand-500 for the SaaS feel
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl select-none';

    const variants = {
      // Using the brand palette (Deep Indigo) with soft hover shadows
      primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md border border-transparent',
      secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm',
      outline: 'border border-brand-200 bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md border border-transparent',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs gap-1.5',
      md: 'h-10 px-5 py-2 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5', // Slightly taller for premium aesthetic
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';