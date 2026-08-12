'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
  Award,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface StudentInfo {
  _id: string;
  name: string;
  email: string;
}

interface CourseInfo {
  _id: string;
  name: string;
  code: string;
}

interface AssignmentInfo {
  _id: string;
  title: string;
  maxMarks: number;
  courseId?: CourseInfo | string;
}

interface SubmissionRecord {
  _id: string;
  assignmentId: AssignmentInfo;
  studentId: StudentInfo;
  fileUrl: string;
  submittedAt: string;
  status: 'Pending' | 'Graded';
  marks?: number;
  teacherFeedback?: string;
}

interface TeacherAssignment {
  _id: string;
  title: string;
  maxMarks: number;
  courseId: CourseInfo;
}

export default function TeacherSubmissionsPage() {
  const [allSubmissions, setAllSubmissions] = useState<SubmissionRecord[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Graded'>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [marks, setMarks] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAllSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const assignRes = await api.get('/teacher/assignments');
      const teacherAssignments: TeacherAssignment[] = assignRes.data.data || [];
      setAssignments(teacherAssignments);

      const submissionPromises = teacherAssignments.map(async (assignment) => {
        try {
          const res = await api.get(`/teacher/assignments/${assignment._id}/submissions`);
          const subs: SubmissionRecord[] = res.data.data || [];
          return subs.map((sub) => ({
            ...sub,
            assignmentId: {
              _id: assignment._id,
              title: assignment.title,
              maxMarks: assignment.maxMarks || 100,
              courseId: assignment.courseId,
            },
          }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(submissionPromises);
      const combined = results.flat();
      combined.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setAllSubmissions(combined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load submissions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  const openGradeModal = (submission: SubmissionRecord) => {
    setSelectedSubmission(submission);
    setMarks(submission.marks !== undefined ? submission.marks : submission.assignmentId?.maxMarks || 100);
    setFeedback(submission.teacherFeedback || '');
    setModalError(null);
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    if (marks === '' || isNaN(Number(marks))) {
      setModalError('Please enter a valid numeric mark.');
      return;
    }

    const numericMarks = Number(marks);
    const maxMarks = selectedSubmission.assignmentId?.maxMarks || 100;
    if (numericMarks < 0 || numericMarks > maxMarks) {
      setModalError(`Marks must be between 0 and ${maxMarks}.`);
      return;
    }

    setIsSubmittingGrade(true);
    setModalError(null);
    try {
      await api.patch(`/teacher/submissions/${selectedSubmission._id}/grade`, {
        marks: numericMarks,
        teacherFeedback: feedback,
      });

      setIsGradeModalOpen(false);
      setSelectedSubmission(null);
      await fetchAllSubmissions();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to submit grade.');
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const filteredSubmissions = allSubmissions.filter((sub) => {
    if (statusFilter !== 'All' && sub.status !== statusFilter) return false;
    if (assignmentFilter !== 'All' && sub.assignmentId._id !== assignmentFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const studentName = sub.studentId?.name?.toLowerCase() || '';
      const studentEmail = sub.studentId?.email?.toLowerCase() || '';
      const assignTitle = sub.assignmentId?.title?.toLowerCase() || '';
      return studentName.includes(q) || studentEmail.includes(q) || assignTitle.includes(q);
    }

    return true;
  });

  const columns: DataTableColumn<SubmissionRecord>[] = [
    {
      key: 'student',
      header: 'Student',
      className: 'min-w-[180px]',
      render: (sub) => (
        <div>
          <div className="font-semibold text-gray-900">{sub.studentId?.name || 'Unknown Student'}</div>
          <div className="text-[11px] font-mono text-gray-500 mt-0.5">{sub.studentId?.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'assignment',
      header: 'Assignment & Course',
      className: 'min-w-[220px]',
      render: (sub) => {
        const course = typeof sub.assignmentId?.courseId === 'object' ? sub.assignmentId.courseId : null;
        return (
          <div>
            <div className="font-medium text-gray-900">{sub.assignmentId?.title || 'Assignment'}</div>
            {course && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-brand-600 font-medium whitespace-nowrap mt-1 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
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
        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
          {sub.submittedAt ? format(new Date(sub.submittedAt), 'MMM d, yyyy • h:mm a') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'file',
      header: 'File Link',
      className: 'min-w-[130px]',
      render: (sub) => (
        <a
          href={sub.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 hover:underline font-semibold whitespace-nowrap transition-colors"
        >
          View Solution <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'min-w-[110px]',
      render: (sub) => <StatusBadge status={sub.status} />,
    },
    {
      key: 'marks',
      header: 'Marks',
      className: 'min-w-[110px]',
      render: (sub) => (
        <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">
          {sub.status === 'Graded' && sub.marks !== undefined ? (
            <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-200/80">
              {sub.marks} <span className="text-gray-400 font-medium text-xs">/ {sub.assignmentId?.maxMarks || 100}</span>
            </span>
          ) : (
            <span className="text-gray-400 font-medium text-xs px-2">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'min-w-[130px]',
      render: (sub) => (
        <Button
          size="sm"
          variant={sub.status === 'Graded' ? 'outline' : 'primary'}
          onClick={() => openGradeModal(sub)}
          className="whitespace-nowrap gap-1.5 text-xs shadow-sm"
        >
          <Award className="h-3.5 w-3.5 shrink-0" />
          {sub.status === 'Graded' ? 'Update Grade' : 'Grade Now'}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Grade Student Submissions"
          subtitle="Review, evaluate, and provide feedback on student assignment submissions."
          icon={FileCheck}
          iconClassName="text-accent-600"
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center transition-all">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            <Input
              placeholder="Search student or assignment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200/60 text-xs font-medium text-gray-600">
              {(['All', 'Pending', 'Graded'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                    statusFilter === st
                      ? 'bg-white text-brand-700 shadow-sm border border-gray-200/50 font-bold'
                      : 'hover:text-gray-900 hover:bg-gray-100/50 border border-transparent'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {assignments.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <select
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="All">All Assignments</option>
                    {assignments.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredSubmissions}
            emptyMessage="No student submissions found matching your filters."
          />
        )}

        <Modal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          title="Evaluate Submission"
          maxWidth="lg"
        >
          {selectedSubmission && (
            <form onSubmit={handleGradeSubmit} className="space-y-5">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl shadow-sm">
                  {modalError}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2 shadow-inner">
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 w-24 shrink-0">Student:</span>
                  <span className="text-gray-900">
                    {selectedSubmission.studentId?.name}{' '}
                    <span className="text-gray-500 font-mono">({selectedSubmission.studentId?.email})</span>
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 w-24 shrink-0">Assignment:</span>
                  <span className="text-gray-900">{selectedSubmission.assignmentId?.title}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 w-24 shrink-0">Max Marks:</span>
                  <span className="text-gray-900 font-bold">{selectedSubmission.assignmentId?.maxMarks || 100}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Submitted File
                </label>
                <a
                  href={selectedSubmission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium transition-all"
                >
                  Open Submission Document <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <Input
                label={`Marks (0 - ${selectedSubmission.assignmentId?.maxMarks || 100})`}
                type="number"
                required
                min={0}
                max={selectedSubmission.assignmentId?.maxMarks || 100}
                value={marks}
                onChange={(e) => setMarks(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Enter numerical score"
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Teacher Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write detailed constructive feedback for the student..."
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGradeModalOpen(false)}
                  disabled={isSubmittingGrade}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmittingGrade} className="gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Submit Evaluation
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}