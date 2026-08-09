import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:bg-gray-50',
            error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';