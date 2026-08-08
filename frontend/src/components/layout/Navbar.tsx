'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, BookOpen, Menu, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full pt-3 pb-2 px-3 sm:px-4 backdrop-blur-md select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Top Left Island Pill: Logo & Brand */}
        <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl p-2.5 px-3.5 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle Mobile Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-blue-600 text-white font-bold shadow-xs shrink-0">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 tracking-tight block leading-tight">
                  EduAssess
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase leading-none block">
                  Academic System
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile compact profile summary */}
          {user && (
            <div className="flex sm:hidden items-center space-x-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getRoleBadgeStyle(
                  user.role
                )}`}
              >
                {user.role}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-1 text-xs px-2 h-7.5 rounded-lg border-slate-300 hover:bg-slate-50 text-slate-700 font-medium shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Top Middle Island Pill: Active Workspace Context */}
        <div className="hidden lg:flex bg-white border border-slate-200/90 rounded-2xl p-2.5 px-4 shadow-md items-center justify-between min-w-[240px]">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800 whitespace-nowrap">
              {user?.role ? `${user.role} Workspace` : 'Guest Session'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 ml-2">
            v1.0.0
          </span>
        </div>

        {/* Top Right Island Pill: Profile & Logout */}
        <div className="hidden sm:flex bg-white border border-slate-200/90 rounded-2xl p-2 px-3.5 shadow-md items-center justify-between shrink-0">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate leading-none">{user.email}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getRoleBadgeStyle(
                  user.role
                )}`}
              >
                {user.role}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-1 text-xs px-2.5 h-7.5 rounded-lg border-slate-300 hover:bg-slate-50 text-slate-700 font-medium shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="w-full text-right text-xs text-slate-500 font-medium">Guest Mode</div>
          )}
        </div>

      </div>
    </header>
  );
}
