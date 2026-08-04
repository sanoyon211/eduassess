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

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await api.get('/admin/courses');
        const allCourses: CourseOption[] = response.data.data || [];

        // Filter courses where assignedTeacherId matches current user ID
        const teacherCourses = allCourses.filter((c) => {
          const tId = typeof c.assignedTeacherId === 'object' ? c.assignedTeacherId?._id : c.assignedTeacherId;
          return tId === user?._id;
        });

        // If no filtered course (e.g. admin seeded test), show all courses
        setCourses(teacherCourses.length > 0 ? teacherCourses : allCourses);
        if (teacherCourses.length > 0) {
          setCourseId(teacherCourses[0]._id);
        } else if (allCourses.length > 0) {
          setCourseId(allCourses[0]._id);
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

    if (!title || !description || !dueDate || !courseId) {
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
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
          <Link href="/teacher">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FilePlus2 className="h-6 w-6 text-slate-700" /> Create New Assignment
            </h1>
            <p className="text-sm text-slate-600">
              Publish coursework, set submission deadlines, and assign instructions.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
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
              <label className="block text-sm font-medium text-slate-700">Course Module</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
                disabled={isSubmitting || isLoadingCourses}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
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
              <label className="block text-sm font-medium text-slate-700">Description & Instructions</label>
              <textarea
                rows={5}
                placeholder="Provide detailed instructions, requirements, and evaluation criteria for students..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Submission Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Publishing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="Published">Published (Visible to Students)</option>
                  <option value="Draft">Draft (Hidden from Students)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link href="/teacher">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="gap-1.5">
                <Send className="h-4 w-4" /> Save & Publish
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
