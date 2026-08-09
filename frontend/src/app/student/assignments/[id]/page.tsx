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
  const [isEditing, setIsEditing] = useState(false);
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
      if (foundSub) {
        setFileUrl(foundSub.fileUrl);
      }
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
      if (submission && (isEditing || submission.status === 'Pending')) {
        const response = await api.put(`/student/submissions/${submission._id}`, {
          fileUrl,
        });
        setSubmission(response.data.data);
        setIsEditing(false);
      } else {
        const response = await api.post('/student/submissions', {
          assignmentId,
          fileUrl,
        });
        setSubmission(response.data.data);
        setFileUrl(response.data.data.fileUrl);
        setIsEditing(false);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPastDueDate = assignment ? new Date() > new Date(assignment.dueDate) : false;

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6 mx-auto sm:mx-0">
        {/* Header */}
        <div className="flex items-start space-x-4 border-b border-gray-200 pb-5">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="h-9 w-9 p-0 rounded-xl mt-1 shadow-sm hover:border-gray-300">
            <ArrowLeft className="h-4.5 w-4.5 text-gray-500" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand-600" /> Assignment Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review guidelines, check submission deadlines, and submit your solution.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium shadow-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-28 w-full mt-4" />
          </div>
        ) : assignment ? (
          <>
            {/* Assignment Overview Card */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {assignment.courseId ? `${assignment.courseId.code} - ${assignment.courseId.name}` : 'Course Module'}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-gray-900">Instructions & Requirements</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-5 rounded-xl border border-gray-200/60 shadow-inner">
                  {assignment.description}
                </div>
              </div>

              {assignment.createdByTeacherId && (
                <p className="text-xs text-gray-500 font-medium pt-2">
                  Assigned by Instructor: <span className="font-semibold text-gray-800">{assignment.createdByTeacherId.name}</span>
                </p>
              )}
            </div>

            {/* CALLOUT CASE 1: Assignment is Already GRADED */}
            {submission && submission.status === 'Graded' && (
              <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-950 rounded-2xl p-6 shadow-sm space-y-5 transition-all">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5.5 w-5.5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-emerald-900">Evaluation Completed</h3>
                  </div>
                  <Badge variant="success" className="px-2.5 py-1">Graded</Badge>
                </div>

                <div className="flex items-baseline gap-3 bg-white/50 p-4 rounded-xl border border-emerald-100">
                  <span className="text-sm font-semibold text-emerald-800">Awarded Score:</span>
                  <span className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                    {submission.marks ?? submission.grade ?? 0} <span className="text-lg text-emerald-700/80 font-semibold">/ 100 pts</span>
                  </span>
                </div>

                {submission.teacherFeedback ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      <MessageSquare className="h-4 w-4 text-emerald-700" /> Instructor's Feedback:
                    </div>
                    <div className="p-4 bg-white border border-emerald-200 rounded-xl text-gray-800 font-medium text-sm leading-relaxed shadow-sm">
                      {submission.teacherFeedback}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700/70 italic font-medium">No written comments provided by instructor.</p>
                )}
              </div>
            )}

            {/* CALLOUT CASE 2: Assignment is SUBMITTED (Pending Review) */}
            {submission && submission.status === 'Pending' && (
              <div className="bg-brand-50/80 border border-brand-200 text-brand-950 rounded-2xl p-6 shadow-sm space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-brand-200/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-5.5 w-5.5 text-brand-600 animate-pulse" />
                    <h3 className="text-lg font-bold text-brand-900">Solution Submitted</h3>
                  </div>
                  <Badge variant="info" className="px-2.5 py-1 text-brand-700 bg-brand-100 border-brand-200">Pending Review</Badge>
                </div>

                <p className="text-sm text-brand-800 leading-relaxed bg-white/50 p-4 rounded-xl border border-brand-100">
                  Your work was submitted on <span className="font-bold">{format(new Date(submission.submittedAt), 'MMM dd, yyyy HH:mm')}</span> and is currently awaiting instructor evaluation.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-brand-200 rounded-xl text-xs font-bold text-brand-700 hover:bg-brand-100 hover:border-brand-300 shadow-sm transition-all"
                  >
                    View Submitted Solution Link <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {!isPastDueDate && !isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsEditing(true);
                        setFileUrl(submission.fileUrl);
                      }}
                      className="text-xs text-brand-700 border-brand-300 bg-white hover:bg-brand-50 shadow-sm"
                    >
                      Update / Resubmit Solution
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* CALLOUT CASE 3: Overdue & Not Submitted */}
            {!submission && isPastDueDate && (
              <div className="bg-red-50 border border-red-200 text-red-950 rounded-2xl p-6 shadow-sm space-y-3 transition-all">
                <div className="flex items-center gap-2.5 text-red-800 border-b border-red-200/60 pb-4">
                  <AlertCircle className="h-5.5 w-5.5 text-red-600" />
                  <h3 className="text-lg font-bold">Submission Deadline Passed</h3>
                </div>
                <p className="text-sm text-red-800 font-medium bg-white/50 p-4 rounded-xl border border-red-100">
                  The due date for this assignment was <span className="font-bold">{format(new Date(assignment.dueDate), 'MMM dd, yyyy HH:mm')}</span>. Submissions are now closed.
                </p>
              </div>
            )}

            {/* SUBMISSION FORM SECTION */}
            {submission && submission.status === 'Graded' ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-3 text-gray-500 text-sm font-medium">
                <div className="p-2 bg-gray-50 rounded-lg"><Lock className="h-4.5 w-4.5 text-gray-400" /></div>
                <span>Submission Form Locked — Instructor has completed grading your submission.</span>
              </div>
            ) : isPastDueDate ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-3 text-gray-500 text-sm font-medium">
                <div className="p-2 bg-gray-50 rounded-lg"><Lock className="h-4.5 w-4.5 text-gray-400" /></div>
                <span>Submission Form Locked — The assignment due date has passed.</span>
              </div>
            ) : submission && !isEditing ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-gray-700 text-sm font-medium transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
                  <span>You submitted a solution. You can update your link before the deadline.</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsEditing(true);
                    setFileUrl(submission.fileUrl);
                  }}
                  className="text-xs shadow-sm w-full sm:w-auto"
                >
                  Update Solution Link
                </Button>
              </div>
            ) : (
              /* ACTIVE SUBMISSION FORM (NEW OR UPDATE) */
              <div className="bg-white border border-brand-200/60 rounded-2xl p-6 sm:p-8 shadow-md space-y-5 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                <div className="border-b border-gray-100 pb-4 flex items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {isEditing ? 'Update Your Submitted Solution' : 'Submit Your Work'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      Provide a URL link to your completed solution (e.g., GitHub repo, Google Drive, or hosted file).
                    </p>
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="text-xs shadow-sm shrink-0"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium shadow-sm">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmitWork} className="space-y-5">
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

                  <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                        className="shadow-sm"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" variant="primary" isLoading={isSubmitting} className="gap-2 shadow-sm">
                      <Send className="h-4.5 w-4.5" /> {isEditing ? 'Save Updated Solution' : 'Submit Solution'}
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