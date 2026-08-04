'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Award,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Lock,
  Send,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface AssignmentDetail {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
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

interface SubmissionDetail {
  _id: string;
  assignmentId: string | { _id: string };
  fileUrl: string;
  submittedAt: string;
  status: 'Pending' | 'Graded';
  marks?: number;
  grade?: number;
  teacherFeedback?: string;
}

export default function StudentAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Submission Form State
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get('/student/assignments'),
        api.get('/student/submissions'),
      ]);

      const allAssignments: AssignmentDetail[] = assignmentsRes.data.data || [];
      const foundAssignment = allAssignments.find((a) => a._id === assignmentId);

      if (!foundAssignment) {
        setError('Assignment not found or not published.');
        return;
      }

      setAssignment(foundAssignment);

      const allSubmissions: SubmissionDetail[] = submissionsRes.data.data || [];
      const foundSub = allSubmissions.find((s) => {
        const aId = typeof s.assignmentId === 'object' ? s.assignmentId._id : s.assignmentId;
        return aId === assignmentId;
      });

      setSubmission(foundSub || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load assignment details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fileUrl.trim()) {
      setFormError('Please enter a valid submission URL or link.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/student/submissions', {
        assignmentId,
        fileUrl,
      });

      setSubmission(response.data.data);
      setFileUrl('');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPastDueDate = assignment ? new Date() > new Date(assignment.dueDate) : false;

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="h-9 w-9 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-slate-700" /> Assignment Details
            </h1>
            <p className="text-sm text-slate-600">
              Review guidelines, check submission deadlines, and submit your solution.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : assignment ? (
          <>
            {/* Assignment Overview Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {assignment.courseId ? `${assignment.courseId.code} - ${assignment.courseId.name}` : 'Course Module'}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{assignment.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Instructions & Requirements</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                  {assignment.description}
                </p>
              </div>

              {assignment.createdByTeacherId && (
                <p className="text-xs text-slate-500">
                  Assigned by Instructor: <span className="font-semibold text-slate-800">{assignment.createdByTeacherId.name}</span>
                </p>
              )}
            </div>

            {/* CALLOUT CASE 1: Assignment is Already GRADED */}
            {submission && submission.status === 'Graded' && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-emerald-900">Evaluation Completed</h3>
                  </div>
                  <Badge variant="success">Graded</Badge>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-emerald-800">Awarded Score:</span>
                  <span className="text-3xl font-extrabold text-emerald-900">
                    {submission.marks ?? submission.grade ?? 0} <span className="text-lg text-emerald-700 font-normal">/ 100 pts</span>
                  </span>
                </div>

                {submission.teacherFeedback ? (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-700" /> Instructor's Feedback:
                    </div>
                    <div className="p-4 bg-white border border-emerald-200 rounded-lg text-slate-800 font-medium text-sm leading-relaxed shadow-2xs">
                      {submission.teacherFeedback}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 italic">No written comments provided.</p>
                )}
              </div>
            )}

            {/* CALLOUT CASE 2: Assignment is SUBMITTED (Pending Review) */}
            {submission && submission.status === 'Pending' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-950 rounded-xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                    <h3 className="text-lg font-bold text-blue-900">Solution Submitted</h3>
                  </div>
                  <Badge variant="info">Pending Review</Badge>
                </div>

                <p className="text-xs text-blue-800">
                  Your work was submitted on <span className="font-semibold">{format(new Date(submission.submittedAt), 'MMM dd, yyyy HH:mm')}</span> and is currently awaiting instructor evaluation.
                </p>

                <div className="pt-2">
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-md text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    View Submitted Solution Link <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* CALLOUT CASE 3: Overdue & Not Submitted */}
            {!submission && isPastDueDate && (
              <div className="bg-red-50 border border-red-200 text-red-950 rounded-xl p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-base font-bold">Submission Deadline Passed</h3>
                </div>
                <p className="text-xs text-red-700">
                  The due date for this assignment was <span className="font-semibold">{format(new Date(assignment.dueDate), 'MMM dd, yyyy HH:mm')}</span>. Submissions are closed.
                </p>
              </div>
            )}

            {/* SUBMISSION FORM SECTION */}
            {submission ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-3 text-slate-500 text-xs font-medium">
                <Lock className="h-4 w-4 text-slate-400" />
                <span>Submission Form Locked — You have already submitted a solution for this assignment.</span>
              </div>
            ) : isPastDueDate ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-3 text-slate-500 text-xs font-medium">
                <Lock className="h-4 w-4 text-slate-400" />
                <span>Submission Form Locked — The assignment due date has passed.</span>
              </div>
            ) : (
              /* ACTIVE SUBMISSION FORM */
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Submit Your Work</h3>
                  <p className="text-xs text-slate-600">Provide a URL link to your completed solution (e.g., GitHub repo, Google Drive, or hosted file).</p>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmitWork} className="space-y-4">
                  <Input
                    label="Solution File URL / Document Link"
                    type="url"
                    placeholder="https://github.com/student/assignment-repo or https://drive.google.com/..."
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    required
                    disabled={isSubmitting}
                    helperText="Ensure link permissions are accessible to your instructor."
                  />

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" isLoading={isSubmitting} className="gap-1.5">
                      <Send className="h-4 w-4" /> Submit Solution
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
