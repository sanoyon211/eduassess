'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { FileText, Plus, Eye, Calendar, RefreshCw } from 'lucide-react';
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
          <p className="font-semibold text-gray-900">{a.title}</p>
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
      header: 'Due Date',
      className: 'min-w-[160px]',
      render: (a) => {
        const isPassed = new Date() > new Date(a.dueDate);
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="font-medium">{format(new Date(a.dueDate), 'MMM dd, yyyy HH:mm')}</span>
            {isPassed && <span className="text-[10px] text-red-600 font-bold px-1.5 py-0.5 bg-red-50 rounded-md shrink-0 border border-red-100">Past Due</span>}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      className: 'min-w-[110px]',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'min-w-[160px]',
      render: (a) => (
        <Link href={`/teacher/assignments/${a._id}`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs whitespace-nowrap shadow-sm hover:border-gray-300">
            <Eye className="h-3.5 w-3.5 shrink-0 text-gray-500" /> View Submissions
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Faculty Assignments"
          subtitle="Manage coursework, track submission deadlines, and evaluate student submissions."
          icon={FileText}
          iconClassName="text-accent-600"
          actions={
            <>
              <Button variant="outline" size="md" onClick={fetchAssignments} className="gap-1.5 shadow-sm">
                <RefreshCw className="h-4 w-4 text-gray-500" /> Refresh
              </Button>
              <Link href="/teacher/assignments/new">
                <Button variant="primary" size="md" className="gap-1.5 shadow-sm">
                  <Plus className="h-4.5 w-4.5" /> Create Assignment
                </Button>
              </Link>
            </>
          }
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium shadow-sm">
            {error}
          </div>
        )}

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