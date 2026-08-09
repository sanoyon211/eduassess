'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Users, BookOpen, GraduationCap, FileText, ArrowRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

interface UserData {
  _id: string;
  role: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalTeachers, setTotalTeachers] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/admin/users');
        const users: UserData[] = response.data.data || [];

        setTotalUsers(users.length);
        setTotalTeachers(users.filter((u) => u.role === 'Teacher').length);
        setTotalStudents(users.filter((u) => u.role === 'Student').length);
      } catch (error) {
        console.error('[AdminDashboard] Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
            <p className="text-sm text-gray-500 mt-1">
              Institution metrics, user management, and course allocation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/admin/courses">
              <Button variant="primary" size="md" className="gap-2 shadow-sm">
                <PlusCircle className="h-4.5 w-4.5" /> Create Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Users Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Users
              </span>
              <div className="h-9 w-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{totalUsers ?? 0}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">Registered platform accounts</p>
          </div>

          {/* Total Faculty Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Faculty Teachers
              </span>
              <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{totalTeachers ?? 0}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">Assigned course instructors</p>
          </div>

          {/* Enrolled Students Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Students
              </span>
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="h-4.5 w-4.5" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{totalStudents ?? 0}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">Active learners in system</p>
          </div>

          {/* Active Modules Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Courses
              </span>
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">Active</p>
            <p className="text-xs text-gray-500 font-medium">Manage course catalogs</p>
          </div>
        </div>

        {/* Quick Navigation Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <h2 className="text-base font-bold text-gray-900">User Management</h2>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                View all institution accounts, check assigned user roles, and monitor system access across the entire platform.
              </p>
            </div>
            <Link href="/admin/users" className="inline-block mt-4">
              <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
                Manage All Users <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <h2 className="text-base font-bold text-gray-900">Course Management</h2>
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Create academic courses, assign faculty instructors, and enroll students into specific classes and modules.
              </p>
            </div>
            <Link href="/admin/courses" className="inline-block mt-4">
              <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
                Manage Courses & Enrollments <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}