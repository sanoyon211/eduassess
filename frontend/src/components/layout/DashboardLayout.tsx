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
    <div className="h-screen max-h-screen bg-gradient-to-br from-indigo-400 via-blue-400 to-indigo-400 text-slate-900 flex flex-col font-sans antialiased overflow-hidden">
      {/* Top Floating Segmented Pill Header (Fixed shrink-0) */}
      <div className="shrink-0">
        <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>

      {/* Workspace Island Container (Fills remaining height, no window scroll) */}
      <div className="flex-1 flex gap-3 sm:gap-4 p-3 sm:p-4 pt-1 sm:pt-2 w-full max-w-[1920px] mx-auto items-stretch overflow-hidden min-h-0">
        {/* Left Floating Sidebar Island */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Floating Content Island Pane (Independently Scrollable) */}
        <main className="flex-1 min-w-0 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 h-full overflow-y-auto min-h-0 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
