'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Teacher':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Student':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
      {/* Brand Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center h-9 w-9 rounded-md bg-slate-900 text-white font-bold">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <span className="text-base font-bold text-slate-900 tracking-tight">EduAssess</span>
          <span className="text-xs text-slate-500 block leading-none">Role-Based System</span>
        </div>
      </div>

      {/* User Context & Logout */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 border-r border-slate-200 pr-4">
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 leading-none">{user.email}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={logout} className="gap-1.5 text-xs">
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>
    </header>
  );
}
