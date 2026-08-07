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
  FileCheck,
  Award,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
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

  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Graded'>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Grade Modal State
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
      // 1. Fetch teacher assignments
      const assignRes = await api.get('/teacher/assignments');
      const teacherAssignments: TeacherAssignment[] = assignRes.data.data || [];
      setAssignments(teacherAssignments);

      // 2. Fetch submissions for each assignment in parallel
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

  // Filtered dataset
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
          <div className="font-medium text-slate-900">{sub.studentId?.name || 'Unknown Student'}</div>
          <div className="text-xs text-slate-500">{sub.studentId?.email || 'N/A'}</div>
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
            <div className="font-medium text-slate-900">{sub.assignmentId?.title || 'Assignment'}</div>
            {course && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium whitespace-nowrap mt-0.5">
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
      header: 'File Link',
      className: 'min-w-[130px]',
      render: (sub) => (
        <a
          href={sub.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium whitespace-nowrap"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1 shrink-0" />
          View Submission
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
      header: 'Marks',
      className: 'min-w-[110px]',
      render: (sub) => (
        <div className="font-semibold text-slate-800 text-sm whitespace-nowrap">
          {sub.status === 'Graded' && sub.marks !== undefined ? (
            <span>
              {sub.marks} / {sub.assignmentId?.maxMarks || 100}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Ungraded</span>
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
          className="whitespace-nowrap"
        >
          <Award className="h-3.5 w-3.5 mr-1 shrink-0" />
          {sub.status === 'Graded' ? 'Update Grade' : 'Grade Now'}
        </Button>
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
              <FileCheck className="h-7 w-7 text-blue-600" />
              Grade Student Submissions
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review, evaluate, and provide feedback on student assignment submissions.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or assignment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Tabs */}
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

            {/* Assignment Dropdown */}
            {assignments.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value)}
                  className="border border-slate-300 bg-white py-1.5 px-2.5 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Assignments</option>
                  {assignments.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredSubmissions}
            emptyMessage="No student submissions found matching your filters."
          />
        )}

        {/* Grade Modal */}
        {isGradeModalOpen && selectedSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Evaluate Submission
                </h3>
                <button
                  onClick={() => setIsGradeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                    {modalError}
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700">Student:</span>{' '}
                    {selectedSubmission.studentId?.name} ({selectedSubmission.studentId?.email})
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Assignment:</span>{' '}
                    {selectedSubmission.assignmentId?.title}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Max Marks:</span>{' '}
                    {selectedSubmission.assignmentId?.maxMarks || 100}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Submitted File
                  </label>
                  <a
                    href={selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:underline font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Open Submission Document
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teacher Feedback (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write detailed constructive feedback for the student..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsGradeModalOpen(false)}
                    disabled={isSubmittingGrade}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmittingGrade}>
                    Submit Evaluation
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
