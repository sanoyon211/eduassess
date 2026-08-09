'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BookOpen, Plus, UserPlus, UserCheck, X, Check } from 'lucide-react';
import api from '@/lib/axios';

interface TeacherUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface StudentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface CourseRecord {
  _id: string;
  name: string;
  code: string;
  assignedTeacherId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  enrolledStudentIds: ({
    _id: string;
    name: string;
    email: string;
  } | string)[];
  createdAt: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherUser[]>([]);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals visibility
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<CourseRecord | null>(null);

  // Form states for Create Course
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [assignedTeacherId, setAssignedTeacherId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state for Enroll Students
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch users to extract teachers & students
      const usersRes = await api.get('/admin/users');
      const allUsers: any[] = usersRes.data.data || [];
      const teacherList = allUsers.filter((u) => u.role === 'Teacher');
      const studentList = allUsers.filter((u) => u.role === 'Student');

      setTeachers(teacherList);
      setStudents(studentList);

      // Fetch courses (We can use a dummy/direct query or build simulated list from models if backend endpoint exists)
      // Since backend has courses schema and createCourse endpoint:
      try {
        const coursesRes = await api.get('/admin/courses').catch(() => ({ data: { data: [] } }));
        setCourses(coursesRes.data.data || []);
      } catch (e) {
        setCourses([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course management data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!courseName || !courseCode || !assignedTeacherId) {
      setFormError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/admin/courses', {
        name: courseName,
        code: courseCode,
        assignedTeacherId,
      });

      const newCourse = response.data.data;
      setCourses((prev) => [newCourse, ...prev]);

      // Reset form and close modal
      setCourseName('');
      setCourseCode('');
      setAssignedTeacherId('');
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create new course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEnrollModal = (course: CourseRecord) => {
    setSelectedCourseForEnroll(course);
    // Pre-select currently enrolled student IDs
    const existingIds = (course.enrolledStudentIds || []).map((s) => (typeof s === 'string' ? s : s._id));
    setSelectedStudentIds(existingIds);
    setIsEnrollModalOpen(true);
  };

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleEnrollStudents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEnroll) return;

    setIsEnrolling(true);
    try {
      const response = await api.post(
        `/admin/courses/${selectedCourseForEnroll._id}/enroll-students`,
        { studentIds: selectedStudentIds }
      );

      const updatedCourse = response.data.data;
      setCourses((prev) => prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c)));
      setIsEnrollModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to enroll students.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const columns: DataTableColumn<CourseRecord>[] = [
    {
      key: 'code',
      header: 'Course Code',
      className: 'min-w-[130px]',
      render: (c) => <span className="font-mono font-bold text-gray-900 whitespace-nowrap">{c.code}</span>,
    },
    {
      key: 'name',
      header: 'Course Name',
      className: 'min-w-[200px]',
      render: (c) => <span className="font-semibold text-gray-900">{c.name}</span>,
    },
    {
      key: 'assignedTeacherId',
      header: 'Assigned Teacher',
      className: 'min-w-[180px]',
      render: (c) => (
        <span className="text-gray-800 text-sm font-medium whitespace-nowrap">
          {c.assignedTeacherId ? c.assignedTeacherId.name : 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'enrolledStudentIds',
      header: 'Enrolled Students',
      className: 'min-w-[140px]',
      render: (c) => (
        <Badge variant="info" className="whitespace-nowrap">
          {c.enrolledStudentIds ? c.enrolledStudentIds.length : 0} Students
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'min-w-[150px]',
      render: (c) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openEnrollModal(c)}
          className="gap-1.5 text-xs whitespace-nowrap"
        >
          <UserPlus className="h-3.5 w-3.5 shrink-0" /> Enroll Students
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-brand-600" /> Course Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create academic courses, assign faculty instructors, and enroll students.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="h-4.5 w-4.5" /> Create Course
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Data Table or Skeleton Loader */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <DataTable
            columns={columns}
            data={courses}
            emptyMessage="No courses created yet. Click 'Create Course' to add your first course module."
          />
        )}

        {/* MODAL 1: Create New Course */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Create New Course</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <Input
                  label="Course Code"
                  placeholder="e.g. CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  required
                />

                <Input
                  label="Course Name"
                  placeholder="e.g. Computer Science 101"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Assign Faculty Teacher
                  </label>
                  <select
                    value={assignedTeacherId}
                    onChange={(e) => setAssignedTeacherId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm transition-all duration-200"
                  >
                    <option value="">Select a Teacher...</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Create & Assign
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Enroll Students */}
        {isEnrollModalOpen && selectedCourseForEnroll && (
          <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Enroll Students into {selectedCourseForEnroll.code}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedCourseForEnroll.name}</p>
                </div>
                <button
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollStudents} className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">
                  Select students to enroll in this course:
                </p>

                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 p-2 space-y-1 shadow-inner bg-gray-50/50">
                  {students.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">
                      No students available in system.
                    </p>
                  ) : (
                    students.map((student) => {
                      const isSelected = selectedStudentIds.includes(student._id);
                      return (
                        <div
                          key={student._id}
                          onClick={() => handleToggleStudentSelection(student._id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all duration-200 border ${
                            isSelected 
                            ? 'bg-brand-50 text-brand-900 border-brand-200 shadow-sm' 
                            : 'bg-white hover:bg-gray-50 text-gray-800 border-transparent hover:border-gray-200'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-sm">{student.name}</p>
                            <p className={`${isSelected ? 'text-brand-600' : 'text-gray-500'}`}>{student.email}</p>
                          </div>
                          {isSelected && <Check className="h-4.5 w-4.5 text-brand-600" />}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEnrollModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isEnrolling}>
                    Save Enrollment ({selectedStudentIds.length})
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