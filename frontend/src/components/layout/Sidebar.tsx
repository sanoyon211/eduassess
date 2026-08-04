'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  FileCheck,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const adminNavItems: NavItem[] = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
    { label: 'Manage Courses', href: '/admin/courses', icon: BookOpen },
  ];

  const teacherNavItems: NavItem[] = [
    { label: 'Overview', href: '/teacher', icon: LayoutDashboard },
    { label: 'My Assignments', href: '/teacher/assignments', icon: FileText },
    { label: 'Grade Submissions', href: '/teacher/submissions', icon: FileCheck },
  ];

  const studentNavItems: NavItem[] = [
    { label: 'Overview', href: '/student', icon: LayoutDashboard },
    { label: 'Course Assignments', href: '/student/assignments', icon: FileText },
    { label: 'My Submissions', href: '/student/submissions', icon: CheckCircle },
  ];

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'Admin':
        return adminNavItems;
      case 'Teacher':
        return teacherNavItems;
      case 'Student':
        return studentNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Role Header Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700">
          <GraduationCap className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {user?.role || 'Guest'} Portal
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
