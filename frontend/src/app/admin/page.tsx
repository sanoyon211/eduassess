'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsCard } from '@/components/ui/StatsCard';
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
        <PageHeader
          title="Admin Overview"
          subtitle="Institution metrics, user management, and course allocation."
          actions={
            <Link href="/admin/courses">
              <Button variant="primary" size="md" className="gap-2 shadow-sm">
                <PlusCircle className="h-4.5 w-4.5" /> Create Course
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Users"
            value={totalUsers ?? 0}
            subtitle="Registered platform accounts"
            icon={Users}
            colorScheme="brand"
            isLoading={isLoading}
          />
          <StatsCard
            title="Faculty Teachers"
            value={totalTeachers ?? 0}
            subtitle="Assigned course instructors"
            icon={GraduationCap}
            colorScheme="accent"
            isLoading={isLoading}
          />
          <StatsCard
            title="Students"
            value={totalStudents ?? 0}
            subtitle="Active learners in system"
            icon={FileText}
            colorScheme="blue"
            isLoading={isLoading}
          />
          <StatsCard
            title="Courses"
            value="Active"
            subtitle="Manage course catalogs"
            icon={BookOpen}
            colorScheme="amber"
            isLoading={false}
          />
        </div>

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