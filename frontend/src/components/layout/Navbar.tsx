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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 w-full max-w-[1920px] mx-auto">
        
        <div className="flex items-center gap-4 w-1/3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle Mobile Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group outline-none">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-600 text-white font-bold transition-transform group-hover:scale-105">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight leading-none block">
                EduAssess
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center w-1/3">
          {user && (
            <div className="flex items-center gap-2 text-lg text-gray-800 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200/60 shadow-xs">
              <span className="font-bold ">
                {user.role} Workspace
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                <UserIcon className="h-5 w-5" />
              </div>

              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-bold text-gray-900 leading-none">{user.name}</span>
                <span className="text-xs text-gray-500 mt-1">{user.email}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-gray-400 hover:text-red-600 hover:bg-red-50 hidden sm:flex px-2 ml-2 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              <button 
                onClick={logout}
                className="sm:hidden p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 ml-1 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 font-medium">Guest Mode</div>
          )}
        </div>

      </div>
    </header>
  );
}