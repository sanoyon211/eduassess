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
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
              { label: 'Overview', href: '/admin', icon: LayoutDashboard },
              { label: 'Users', href: '/admin/users', icon: Users },
              { label: 'Courses', href: '/admin/courses', icon: BookOpen },
            ],
          },
        ];
      case 'Teacher':
        return [
          {
            section: 'Teaching',
            items: [
              { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
              { label: 'Assignments', href: '/teacher/assignments', icon: FileText },
              { label: 'Submissions', href: '/teacher/submissions', icon: CheckSquare },
            ],
          },
        ];
      case 'Student':
        return [
          {
            section: 'Learning',
            items: [
              { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
              { label: 'Assignments', href: '/student/assignments', icon: FileText },
              { label: 'My Submissions', href: '/student/submissions', icon: CheckSquare },
            ],
          },
        ];
      default:
        return [
          {
            section: 'Portal',
            items: [
              { label: 'Dashboard', href: '/', icon: LayoutDashboard },
            ],
          },
        ];
    }
  };

  const navSections = getRoleNavItems();

  const sidebarContent = (
    <aside className="w-64 bg-white border border-gray-200 rounded-xl flex flex-col h-full overflow-hidden shrink-0 shadow-sm">
      {onClose && (
        <div className="lg:hidden p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-full">{sidebarContent}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-gray-900/50 transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 p-3 h-full max-w-[280px] w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}