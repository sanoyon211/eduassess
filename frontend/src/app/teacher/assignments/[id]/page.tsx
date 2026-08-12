'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileCheck,
  ArrowLeft,
  ExternalLink,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface StudentInfo {
  _id: string;
  name: string;
  email: string;
}

interface AssignmentInfo {
  _id: string;
  title?: string;
  maxMarks?: number;
}

interface SubmissionRecord {
  _id: string;
  assignmentId: AssignmentInfo | string;
  studentId: StudentInfo;
  fileUrl: string;
  submittedAt: string;
  status: 'Pending' | 'Graded';
  marks?: number;
  teacherFeedback?: string;
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [marks, setMarks] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/assignments/${assignmentId}/submissions`);
      setSubmissions(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load submissions for this assignment.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const openGradeModal = (submission: SubmissionRecord) => {
    setSelectedSubmission(submission);
    setMarks(submission.marks !== undefined ? submission.marks : 100);
    setFeedback(submission.teacherFeedback || '');
    setModalError(null);
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    if (marks === '' || isNaN(Number(marks))) {
      setModalError('Please enter a valid numeric mark score.');
      return;
    }

    setIsSubmittingGrade(true);
    setModalError(null);
    try {
      const response = await api.patch(`/teacher/submissions/${selectedSubmission._id}/grade`, {
        marks: Number(marks),
        teacherFeedback: feedback,
      });

      const updatedSubmission: SubmissionRecord = response.data.data;
      setSubmissions((prev) =>
        prev.map((s) => (s._id === updatedSubmission._id ? updatedSubmission : s))
      );

      setIsGradeModalOpen(false);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to submit grade.');
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const columns: DataTableColumn<SubmissionRecord>[] = [
    {
      key: 'studentId',
      header: 'Student',
      className: 'min-w-[180px]',
      render: (s) => (
        <div>
          <p className="font-semibold text-gray-900">{s.studentId?.name || 'Unknown Student'}</p>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{s.studentId?.email}</p>
        </div>
      ),
    },
    {
      key: 'fileUrl',
      header: 'Submission Link',
      className: 'min-w-[160px]',
      render: (s) => (
        <a
          href={s.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-all"
        >
          View Solution <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted At',
      className: 'min-w-[140px]',
      render: (s) => (
        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
          {s.submittedAt ? format(new Date(s.submittedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'min-w-[120px]',
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: 'marks',
      header: 'Score / Marks',
      className: 'min-w-[120px]',
      render: (s) => {
        const max = typeof s.assignmentId === 'object' ? s.assignmentId.maxMarks ?? 100 : 100;
        return s.status === 'Graded' ? (
          <span className="font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200/80">
            {s.marks ?? 0} <span className="text-gray-400 font-medium">/ {max}</span>
          </span>
        ) : (
          <span className="text-gray-400 text-xs font-medium px-2.5">-</span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'min-w-[140px]',
      render: (s) => (
        <Button
          variant={s.status === 'Graded' ? 'outline' : 'primary'}
          size="sm"
          onClick={() => openGradeModal(s)}
          className="gap-1.5 text-xs whitespace-nowrap shadow-sm"
        >
          <Award className="h-3.5 w-3.5" />
          {s.status === 'Graded' ? 'Update Grade' : 'Grade Submission'}
        </Button>
      ),
    },
  ];

  const currentMaxMarks = selectedSubmission && typeof selectedSubmission.assignmentId === 'object'
    ? selectedSubmission.assignmentId.maxMarks ?? 100
    : 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Student Submissions & Grading"
          subtitle="Review submitted solutions, award scores, and provide written feedback."
          icon={FileCheck}
          iconClassName="text-accent-600"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="gap-1.5 text-xs shadow-sm hover:border-gray-300"
            >
              <ArrowLeft className="h-4 w-4 text-gray-500" /> Back
            </Button>
          }
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium shadow-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <DataTable
            columns={columns}
            data={submissions}
            emptyMessage="No student submissions received for this assignment yet."
          />
        )}

        <Modal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          title="Grade Submission"
          subtitle={selectedSubmission ? `Student: ${selectedSubmission.studentId?.name || ''}` : undefined}
          maxWidth="md"
        >
          {selectedSubmission && (
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {modalError}
                </div>
              )}

              <Input
                label={`Awarded Score / Marks (Out of ${currentMaxMarks})`}
                type="number"
                min={0}
                max={currentMaxMarks}
                placeholder={`e.g. ${Math.round(currentMaxMarks * 0.9)}`}
                value={marks}
                onChange={(e) => setMarks(e.target.value === '' ? '' : Number(e.target.value))}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Teacher Feedback & Comments
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide constructive feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGradeModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmittingGrade} className="shadow-sm gap-1.5">
                  <CheckCircle2 className="h-4.5 w-4.5" /> Save Grade
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}