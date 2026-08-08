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
  CheckSquare,
  X,
  Shield,
  GraduationCap,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getRoleNavItems = (): { section: string; items: NavItem[] }[] => {
    switch (user?.role) {
      case 'Admin':
        return [
          {
            section: 'Administration',
            items: [
              { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, description: 'Overview & metrics' },
              { label: 'Users', href: '/admin/users', icon: Users, description: 'Manage accounts & roles' },
              { label: 'Courses', href: '/admin/courses', icon: BookOpen, description: 'Course allocations' },
            ],
          },
        ];
      case 'Teacher':
        return [
          {
            section: 'Teaching',
            items: [
              { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard, description: 'Overview & status' },
              { label: 'Assignments', href: '/teacher/assignments', icon: FileText, description: 'Create & manage tasks' },
              { label: 'Submissions', href: '/teacher/submissions', icon: CheckSquare, description: 'Grade student work' },
            ],
          },
        ];
      case 'Student':
        return [
          {
            section: 'Learning',
            items: [
              { label: 'Dashboard', href: '/student', icon: LayoutDashboard, description: 'Academic overview' },
              { label: 'Assignments', href: '/student/assignments', icon: FileText, description: 'View & submit tasks' },
              { label: 'My Submissions', href: '/student/submissions', icon: CheckSquare, description: 'Track grades & feedback' },
            ],
          },
        ];
      default:
        return [
          {
            section: 'Portal',
            items: [
              { label: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Main portal' },
            ],
          },
        ];
    }
  };

  const navSections = getRoleNavItems();

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4 text-slate-800" />;
      case 'Teacher':
        return <GraduationCap className="h-4 w-4 text-emerald-700" />;
      case 'Student':
        return <UserCheck className="h-4 w-4 text-blue-700" />;
      default:
        return <LayoutDashboard className="h-4 w-4 text-slate-600" />;
    }
  };

  const sidebarContent = (
    <aside className="w-64 bg-white border border-slate-200/90 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/80">
            {getRoleIcon(user?.role)}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Navigation</h2>
            <p className="text-[11px] text-slate-500 font-medium">{user?.role || 'Guest'} Portal</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6 min-h-0">
        {navSections.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.section}
            </h3>

            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose && onClose()}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <div className="truncate">
                        <span className="block truncate">{item.label}</span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
                        isActive
                          ? 'text-white/80 translate-x-0.5'
                          : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      {user && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/70 text-xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
              Logged in as
            </span>
            <p className="font-bold text-slate-800 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on lg screens and up) */}
      <div className="hidden lg:block h-full">{sidebarContent}</div>

      {/* Mobile Drawer (visible on smaller screens when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <div className="relative z-10 p-3 h-full max-w-[280px] w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
