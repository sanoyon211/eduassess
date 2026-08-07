'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, Plus, Eye, Calendar, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface AssignmentRecord {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Draft' | 'Published';
  courseId: {
    _id: string;
    name: string;
    code: string;
  } | null;
  createdAt: string;
}

export default function TeacherDashboardPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/teacher/assignments');
      setAssignments(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const columns: DataTableColumn<AssignmentRecord>[] = [
    {
      key: 'title',
      header: 'Assignment Title',
      className: 'min-w-[240px]',
      render: (a) => (
        <div>
          <p className="font-semibold text-slate-900">{a.title}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{a.description}</p>
        </div>
      ),
    },
    {
      key: 'courseId',
      header: 'Course Module',
      className: 'min-w-[200px]',
      render: (a) => (
        <span className="inline-block font-mono font-semibold text-slate-800 text-xs bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/90 whitespace-nowrap">
          {a.courseId ? `${a.courseId.code} - ${a.courseId.name}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      className: 'min-w-[160px]',
      render: (a) => {
        const isPassed = new Date() > new Date(a.dueDate);
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{format(new Date(a.dueDate), 'MMM dd, yyyy HH:mm')}</span>
            {isPassed && <span className="text-[10px] text-red-600 font-bold px-1 bg-red-50 rounded shrink-0">Past Due</span>}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      className: 'min-w-[110px]',
      render: (a) =>
        a.status === 'Published' ? (
          <Badge variant="success">Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'min-w-[160px]',
      render: (a) => (
        <Link href={`/teacher/assignments/${a._id}`}>
          <Button variant="outline" size="sm" className="gap-1 text-xs whitespace-nowrap">
            <Eye className="h-3.5 w-3.5 shrink-0" /> View Submissions
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-slate-700" /> Faculty Assignments
            </h1>
            <p className="text-sm text-slate-600">
              Manage coursework, track submission deadlines, and evaluate student submissions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={fetchAssignments} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Link href="/teacher/assignments/new">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> Create Assignment
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Data Table or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <DataTable
            columns={columns}
            data={assignments}
            emptyMessage="No assignments created yet. Click 'Create Assignment' to publish coursework."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
