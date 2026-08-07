'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  GraduationCap,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface AssignmentRecord {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks?: number;
  courseId: {
    _id: string;
    name: string;
    code: string;
  } | null;
  createdByTeacherId?: {
    name: string;
    email: string;
  };
}

interface SubmissionRecord {
  _id: string;
  assignmentId: {
    _id: string;
    maxMarks?: number;
  } | string;
  status: 'Pending' | 'Graded';
  grade?: number;
  marks?: number;
}

export default function StudentDashboardPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get('/student/assignments'),
        api.get('/student/submissions'),
      ]);

      setAssignments(assignmentsRes.data.data || []);
      setSubmissions(submissionsRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load student dashboard coursework.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSubmissionForAssignment = (assignmentId: string): SubmissionRecord | undefined => {
    return submissions.find((s) => {
      const aId = typeof s.assignmentId === 'object' ? s.assignmentId._id : s.assignmentId;
      return aId === assignmentId;
    });
  };

  const columns: DataTableColumn<AssignmentRecord>[] = [
    {
      key: 'statusIndicator',
      header: 'Status',
      className: 'min-w-[140px]',
      render: (a) => {
        const sub = getSubmissionForAssignment(a._id);
        const isPastDue = new Date() > new Date(a.dueDate);
        const max = a.maxMarks ?? 100;

        if (sub) {
          if (sub.status === 'Graded') {
            return (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Graded ({sub.marks ?? sub.grade ?? 0} / {max} pts)
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Submitted
            </span>
          );
        }

        if (isPastDue) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Overdue
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Pending
          </span>
        );
      },
    },
    {
      key: 'title',
      header: 'Assignment Title',
      className: 'min-w-[240px]',
      render: (a) => (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">{a.title}</p>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
              Max: {a.maxMarks ?? 100} pts
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">{a.description}</p>
        </div>
      ),
    },
    {
      key: 'courseId',
      header: 'Course Module',
      className: 'min-w-[200px]',
      render: (a) => (
        <span className="inline-block font-semibold text-slate-800 text-xs bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/90 whitespace-nowrap">
          {a.courseId ? `${a.courseId.code} - ${a.courseId.name}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Submission Due Date',
      className: 'min-w-[160px]',
      render: (a) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{format(new Date(a.dueDate), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'min-w-[130px]',
      render: (a) => (
        <Link href={`/student/assignments/${a._id}`}>
          <Button variant="outline" size="sm" className="gap-1 text-xs whitespace-nowrap">
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      ),
    },
  ];

  const completedCount = submissions.length;
  const pendingCount = assignments.length - completedCount;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-slate-700" /> Student Portal Overview
            </h1>
            <p className="text-sm text-slate-600">
              Track enrolled coursework, submission deadlines, and feedback evaluations.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200/90 border-t-4 border-t-blue-500 rounded-xl p-5 shadow-xs card-hover space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Total Assignments
              </span>
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="h-4.5 w-4.5" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{assignments.length}</p>
            )}
            <p className="text-xs text-slate-500 font-medium">Enrolled published coursework</p>
          </div>

          <div className="bg-white border border-slate-200/90 border-t-4 border-t-amber-500 rounded-xl p-5 shadow-xs card-hover space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Pending Submissions
              </span>
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="h-4.5 w-4.5" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {pendingCount < 0 ? 0 : pendingCount}
              </p>
            )}
            <p className="text-xs text-slate-500 font-medium">Awaiting your solution</p>
          </div>

          <div className="bg-white border border-slate-200/90 border-t-4 border-t-emerald-500 rounded-xl p-5 shadow-xs card-hover space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Completed & Graded
              </span>
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{completedCount}</p>
            )}
            <p className="text-xs text-slate-500 font-medium">Submitted coursework</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Data Table or Skeleton Loader */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <h2 className="text-lg font-bold text-slate-900">Enrolled Course Assignments</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Submitted / Graded
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" /> Pending
              </span>
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <DataTable
              columns={columns}
              data={assignments}
              emptyMessage="No assignments published for your enrolled courses yet."
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
