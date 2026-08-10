import React from 'react';
import { Badge } from './Badge';
import { CheckCircle2, Clock } from 'lucide-react';

export type StatusType =
  | 'Graded'
  | 'Submitted'
  | 'Pending'
  | 'Overdue'
  | 'Published'
  | 'Draft'
  | 'Admin'
  | 'Teacher'
  | 'Student'
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  marks?: number;
  maxMarks?: number;
  className?: string;
}

export function StatusBadge({ status, marks, maxMarks = 100, className = '' }: StatusBadgeProps) {
  const normalized = status.trim();

  switch (normalized) {
    case 'Graded':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 shadow-sm ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Graded {marks !== undefined ? `(${marks}/${maxMarks})` : ''}
        </span>
      );

    case 'Submitted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 shadow-sm ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Submitted
        </span>
      );

    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          Pending
        </span>
      );

    case 'Overdue':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200/70 shadow-sm ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Overdue
        </span>
      );

    case 'Published':
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="h-3 w-3 mr-1 inline" />
          Published
        </Badge>
      );

    case 'Draft':
      return (
        <Badge variant="secondary" className={className}>
          <Clock className="h-3 w-3 mr-1 inline" />
          Draft
        </Badge>
      );

    case 'Admin':
      return (
        <Badge variant="default" className={`bg-gray-800 text-white border-gray-700 ${className}`}>
          Admin
        </Badge>
      );

    case 'Teacher':
      return <Badge variant="success" className={className}>Teacher</Badge>;

    case 'Student':
      return <Badge variant="info" className={className}>Student</Badge>;

    default:
      return <Badge variant="secondary" className={className}>{status}</Badge>;
  }
}
