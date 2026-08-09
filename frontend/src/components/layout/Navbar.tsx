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
        return 'bg-brand-700 text-white border-brand-600'; // Deep Indigo for Admin
      case 'Teacher':
        return 'bg-accent-50 text-accent-700 border-accent-200'; // Emerald for Teacher
      case 'Student':
        return 'bg-brand-50 text-brand-700 border-brand-200'; // Light Indigo for Student
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full pt-3 pb-2 px-3 sm:px-4 backdrop-blur-md select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Top Left Island Pill: Logo & Brand */}
        <div className="flex-1 bg-white border border-gray-200/80 rounded-2xl p-2.5 px-3.5 shadow-sm flex items-center justify-between transition-all">
          <div className="flex items-center space-x-2.5">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Toggle Mobile Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-brand-600 text-white font-bold shadow-sm shrink-0 group-hover:bg-brand-700 transition-colors">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 tracking-tight block leading-tight">
                  EduAssess
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase leading-none block mt-0.5">
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
                className="gap-1 text-xs px-2 h-7.5 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-medium shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Top Middle Island Pill: Active Workspace Context */}
        <div className="hidden lg:flex bg-white border border-gray-200/80 rounded-2xl p-2.5 px-4 shadow-sm items-center justify-between min-w-[240px]">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Sparkles className="h-4 w-4 text-brand-600 shrink-0" />
            <span className="font-semibold text-gray-800 whitespace-nowrap">
              {user?.role ? `${user.role} Workspace` : 'Guest Session'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200 ml-2">
            v1.0.0
          </span>
        </div>

        {/* Top Right Island Pill: Profile & Logout */}
        <div className="hidden sm:flex bg-white border border-gray-200/80 rounded-2xl p-2 px-3.5 shadow-sm items-center justify-between shrink-0">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-gray-900 truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate leading-none mt-0.5">{user.email}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border shrink-0 ${getRoleBadgeStyle(
                  user.role
                )}`}
              >
                {user.role}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-1.5 text-xs px-3 h-8 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-medium shrink-0 ml-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="w-full text-right text-xs text-gray-500 font-medium">Guest Mode</div>
          )}
        </div>

      </div>
    </header>
  );
}