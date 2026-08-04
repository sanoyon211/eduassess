'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileCheck,
  ArrowLeft,
  ExternalLink,
  Award,
  MessageSquare,
  X,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface StudentInfo {
  _id: string;
  name: string;
  email: string;
}

interface SubmissionRecord {
  _id: string;
  assignmentId: string;
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

  // Grade Modal State
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
      render: (s) => (
        <div>
          <p className="font-semibold text-slate-900">{s.studentId?.name || 'Unknown Student'}</p>
          <p className="text-xs text-slate-500 font-mono">{s.studentId?.email}</p>
        </div>
      ),
    },
    {
      key: 'fileUrl',
      header: 'Submission Link',
      render: (s) => (
        <a
          href={s.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
        >
          View Solution <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted At',
      render: (s) => (
        <span className="text-xs text-slate-600">
          {s.submittedAt ? format(new Date(s.submittedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) =>
        s.status === 'Graded' ? (
          <Badge variant="success">Graded</Badge>
        ) : (
          <Badge variant="warning">Pending Review</Badge>
        ),
    },
    {
      key: 'marks',
      header: 'Score / Marks',
      render: (s) =>
        s.status === 'Graded' ? (
          <span className="font-bold text-slate-900">{s.marks ?? 0} pts</span>
        ) : (
          <span className="text-slate-400 text-xs">-</span>
        ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (s) => (
        <Button
          variant={s.status === 'Graded' ? 'outline' : 'primary'}
          size="sm"
          onClick={() => openGradeModal(s)}
          className="gap-1 text-xs"
        >
          <Award className="h-3.5 w-3.5" />
          {s.status === 'Graded' ? 'Update Grade' : 'Grade Submission'}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="h-9 w-9 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-slate-700" /> Student Submissions & Grading
            </h1>
            <p className="text-sm text-slate-600">
              Review submitted solutions, award scores, and provide written feedback.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Data Table or Skeleton Loader */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <DataTable
            columns={columns}
            data={submissions}
            emptyMessage="No student submissions received for this assignment yet."
          />
        )}

        {/* GRADE MODAL */}
        {isGradeModalOpen && selectedSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Grade Submission
                  </h3>
                  <p className="text-xs text-slate-500">
                    Student: <span className="font-semibold text-slate-800">{selectedSubmission.studentId?.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsGradeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <Input
                  label="Awarded Score / Marks (Out of 100)"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="e.g. 95"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Teacher Feedback & Comments
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide constructive feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsGradeModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmittingGrade}>
                    Save Grade
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
