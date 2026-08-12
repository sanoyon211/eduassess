'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { FilePlus2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

interface CourseOption {
  _id: string;
  name: string;
  code: string;
  assignedTeacherId?: {
    _id: string;
  } | string;
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await api.get('/teacher/courses');
        const teacherCourses: CourseOption[] = response.data.data || [];

        setCourses(teacherCourses);
        if (teacherCourses.length > 0) {
          setCourseId(teacherCourses[0]._id);
        }
      } catch (err) {
        console.error('[NewAssignment] Failed to fetch courses:', err);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !dueDate || !courseId || !maxMarks) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/teacher/assignments', {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        courseId,
        maxMarks: Number(maxMarks),
        status,
      });

      router.push('/teacher');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-start space-x-4 border-b border-gray-200 pb-5">
          <Link href="/teacher" className="mt-1">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl shadow-sm hover:border-gray-300">
              <ArrowLeft className="h-4.5 w-4.5 text-gray-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FilePlus2 className="h-6 w-6 text-accent-600" /> Create New Assignment
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Publish coursework, set submission deadlines, and assign instructions.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Assignment Title"
              placeholder="e.g. Binary Search Trees & Recursion Lab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Course Module</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
                disabled={isSubmitting || isLoadingCourses}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50"
              >
                {courses.length === 0 ? (
                  <option value="">No assigned courses available</option>
                ) : (
                  courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} - {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Description & Instructions</label>
              <textarea
                rows={5}
                placeholder="Provide detailed instructions, requirements, and evaluation criteria for students..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Submission Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Maximum Marks"
                type="number"
                min={1}
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Publishing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm transition-all duration-200"
                >
                  <option value="Published">Published (Visible)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-5 border-t border-gray-100 mt-2">
              <Link href="/teacher">
                <Button type="button" variant="outline" className="shadow-sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="gap-2 shadow-sm">
                <Send className="h-4 w-4" /> Save & Publish
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}