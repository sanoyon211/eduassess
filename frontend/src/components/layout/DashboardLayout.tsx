'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
