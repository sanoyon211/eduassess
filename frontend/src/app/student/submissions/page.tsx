'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
            <div className="font-semibold text-slate-900">{sub.assignmentId?.title || 'Assignment'}</div>
            {course && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-0.5 whitespace-nowrap">
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
        <span className="text-xs text-slate-600 whitespace-nowrap">
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
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium whitespace-nowrap"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1 shrink-0" />
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
        <div className="font-semibold text-slate-800 text-sm whitespace-nowrap">
          {sub.status === 'Graded' && sub.marks !== undefined ? (
            <span className="text-emerald-700 font-bold">
              {sub.marks} / {sub.assignmentId?.maxMarks || 100}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Awaiting Grade</span>
          )}
        </div>
      ),
    },
    {
      key: 'feedback',
      header: 'Teacher Feedback',
      className: 'min-w-[180px]',
      render: (sub) => (
        <div className="max-w-xs text-xs text-slate-700">
          {sub.teacherFeedback ? (
            <div className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
              <MessageSquare className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{sub.teacherFeedback}</span>
            </div>
          ) : (
            <span className="text-slate-400 italic">No feedback provided yet.</span>
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
          <Button size="sm" variant="outline" className="whitespace-nowrap">
            <FileText className="h-3.5 w-3.5 mr-1 shrink-0" />
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-7 w-7 text-blue-600" />
              My Submissions & Grades
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track your submitted coursework, view grades, and read instructor feedback.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignment or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Pending', 'Graded'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <TableSkeleton rows={5} />
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
