'use client';

import React, { useEffect } from 'react';
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
  X,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Auto close drawer when route changes on mobile
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 shadow-xl lg:shadow-none select-none">
      {/* Role Header Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-800">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block leading-tight text-slate-800">
              {user?.role || 'Guest'} Portal
            </span>
            <span className="text-[10px] text-slate-500 font-medium block leading-none">
              Authenticated Session
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close Navigation Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-700 font-bold border-r-2 border-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Mini Summary */}
      <div className="p-3 m-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center space-x-2 text-xs">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 truncate">{user?.name || 'Active User'}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Secured Token'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Slide Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 max-w-full flex animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
