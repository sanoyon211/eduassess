'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsCard } from '@/components/ui/StatsCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import {
  GraduationCap,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
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
              <StatusBadge
                status="Graded"
                marks={sub.marks ?? sub.grade ?? 0}
                maxMarks={max}
              />
            );
          }
          return <StatusBadge status="Submitted" />;
        }

        if (isPastDue) {
          return <StatusBadge status="Overdue" />;
        }

        return <StatusBadge status="Pending" />;
      },
    },
    {
      key: 'title',
      header: 'Assignment Title',
      className: 'min-w-[240px]',
      render: (a) => (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900">{a.title}</p>
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md border border-gray-200 shrink-0">
              Max: {a.maxMarks ?? 100} pts
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{a.description}</p>
        </div>
      ),
    },
    {
      key: 'courseId',
      header: 'Course Module',
      className: 'min-w-[200px]',
      render: (a) => (
        <span className="inline-block font-mono font-semibold text-gray-700 text-xs bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/80 whitespace-nowrap shadow-sm">
          {a.courseId ? `${a.courseId.code} - ${a.courseId.name}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Submission Due Date',
      className: 'min-w-[160px]',
      render: (a) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
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
          <Button variant="outline" size="sm" className="gap-1.5 text-xs whitespace-nowrap shadow-sm hover:border-gray-300">
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
        <PageHeader
          title="Student Portal Overview"
          subtitle="Track enrolled coursework, submission deadlines, and feedback evaluations."
          icon={GraduationCap}
          iconClassName="text-brand-500"
          actions={
            <Button variant="outline" size="md" onClick={fetchData} className="gap-1.5 shadow-sm">
              <RefreshCw className="h-4 w-4 text-gray-500" /> Refresh
            </Button>
          }
        />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCard
            title="Total Assignments"
            value={assignments.length}
            subtitle="Enrolled published coursework"
            icon={FileText}
            colorScheme="brand"
            isLoading={isLoading}
          />
          <StatsCard
            title="Pending Submissions"
            value={pendingCount < 0 ? 0 : pendingCount}
            subtitle="Awaiting your solution"
            icon={Clock}
            colorScheme="amber"
            isLoading={isLoading}
          />
          <StatsCard
            title="Completed & Graded"
            value={completedCount}
            subtitle="Submitted coursework"
            icon={CheckCircle2}
            colorScheme="emerald"
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* Data Table or Skeleton Loader */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <h2 className="text-lg font-bold text-gray-900">Enrolled Course Assignments</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Submitted / Graded
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gray-400 inline-block" /> Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> Overdue
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