'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CheckCircle,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface CourseInfo {
  _id: string;
  name: string;
  code: string;
}

interface AssignmentInfo {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxMarks?: number;
  courseId?: CourseInfo;
}

interface SubmissionRecord {
  _id: string;
  assignmentId: AssignmentInfo;
  fileUrl: string;
  submittedAt: string;
  status: 'Pending' | 'Graded';
  marks?: number;
  teacherFeedback?: string;
}

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Graded'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMySubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/submissions');
      setSubmissions(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your submissions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter !== 'All' && sub.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = sub.assignmentId?.title?.toLowerCase() || '';
      const courseName = sub.assignmentId?.courseId?.name?.toLowerCase() || '';
      const courseCode = sub.assignmentId?.courseId?.code?.toLowerCase() || '';
      return title.includes(q) || courseName.includes(q) || courseCode.includes(q);
    }

    return true;
  });

  const columns: DataTableColumn<SubmissionRecord>[] = [
    {
      key: 'assignment',
      header: 'Assignment & Course',
      className: 'min-w-[220px]',
      render: (sub) => {
        const course = sub.assignmentId?.courseId;
        return (
          <div>
            <div className="font-semibold text-gray-900">{sub.assignmentId?.title || 'Assignment'}</div>
            {course && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-brand-600 font-medium mt-1 whitespace-nowrap bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                <BookOpen className="h-3 w-3 shrink-0" />
                {course.code} - {course.name}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'submittedAt',
      header: 'Submitted Date',
      className: 'min-w-[150px]',
      render: (sub) => (
        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
          {sub.submittedAt ? format(new Date(sub.submittedAt), 'MMM d, yyyy • h:mm a') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'file',
      header: 'Submitted Work',
      className: 'min-w-[120px]',
      render: (sub) => (
        <a
          href={sub.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 hover:underline font-semibold whitespace-nowrap transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-0.5 shrink-0" />
          View File
        </a>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'min-w-[110px]',
      render: (sub) => (
        <Badge variant={sub.status === 'Graded' ? 'success' : 'warning'}>
          {sub.status === 'Graded' ? (
            <CheckCircle2 className="h-3 w-3 mr-1 inline" />
          ) : (
            <Clock className="h-3 w-3 mr-1 inline" />
          )}
          {sub.status}
        </Badge>
      ),
    },
    {
      key: 'marks',
      header: 'Grade / Marks',
      className: 'min-w-[120px]',
      render: (sub) => (
        <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">
          {sub.status === 'Graded' && sub.marks !== undefined ? (
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {sub.marks} <span className="text-emerald-600/70 text-xs font-normal">/ {sub.assignmentId?.maxMarks || 100}</span>
            </span>
          ) : (
            <span className="text-gray-400 font-normal italic text-xs">Awaiting Grade</span>
          )}
        </div>
      ),
    },
    {
      key: 'feedback',
      header: 'Teacher Feedback',
      className: 'min-w-[180px]',
      render: (sub) => (
        <div className="max-w-xs text-xs text-gray-700">
          {sub.teacherFeedback ? (
            <div className="flex items-start gap-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200/80 shadow-2xs">
              <MessageSquare className="h-3.5 w-3.5 text-brand-600 shrink-0 mt-0.5" />
              <span className="font-medium">{sub.teacherFeedback}</span>
            </div>
          ) : (
            <span className="text-gray-400 italic text-xs">No feedback provided yet.</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'min-w-[140px]',
      render: (sub) => (
        <Link href={`/student/assignments/${sub.assignmentId?._id}`}>
          <Button size="sm" variant="outline" className="whitespace-nowrap text-xs shadow-sm hover:border-gray-300">
            <FileText className="h-3.5 w-3.5 mr-1 shrink-0 text-gray-500" />
            View Assignment
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-brand-600" />
              My Submissions & Grades
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track your submitted coursework, view grades, and read instructor feedback.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Filters Bar - Premium SaaS Card Style */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center transition-all">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            <Input
              placeholder="Search assignment or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200/60 text-xs font-medium text-gray-600 shrink-0 w-full sm:w-auto justify-center">
            {(['All', 'Pending', 'Graded'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 rounded-lg transition-all duration-200 ${
                  statusFilter === st
                    ? 'bg-white text-brand-700 shadow-sm border border-gray-200/50 font-bold'
                    : 'hover:text-gray-900 hover:bg-gray-100/50 border border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredSubmissions}
            emptyMessage="You haven't submitted any assignments yet or no submissions match your filter."
          />
        )}
      </div>
    </DashboardLayout>
  );
}