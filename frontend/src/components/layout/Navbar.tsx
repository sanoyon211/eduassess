'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, BookOpen, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export function Navbar({ onToggleMobileMenu }: NavbarProps) {
  const { user, logout } = useAuth();

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-slate-900 text-white border-slate-800';
      case 'Teacher':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Student':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 bg-white/95 backdrop-blur px-3 sm:px-6 flex items-center justify-between min-w-0">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Toggle Mobile Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link href="/" className="flex items-center space-x-2.5 shrink-0">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="shrink-0">
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight">
              EduAssess
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase hidden sm:block leading-none">
              Academic Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Right: User Context & Logout */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-3 border-r border-slate-200 pr-2 sm:pr-4 shrink-0">
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-500 leading-none">{user.email}</p>
            </div>
            <span
              className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded border shrink-0 ${getRoleBadgeStyle(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="gap-1.5 text-xs px-2.5 sm:px-3.5 h-8.5 rounded-md border-slate-300 hover:bg-slate-50 text-slate-700 font-medium shrink-0"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
