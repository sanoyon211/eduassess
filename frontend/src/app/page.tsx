import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  FileCheck2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-2xl bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20 shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                EduAssess
                <span className="hidden sm:inline-flex text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md border border-brand-200/80">
                  Enterprise
                </span>
              </span>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">Role-Based Assignment Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-medium transition-all duration-200 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-semibold transition-all duration-200 h-8 w-8 sm:h-9 sm:w-auto sm:px-4 text-xs sm:text-sm bg-brand-600 text-white hover:bg-brand-700 rounded-lg sm:rounded-xl gap-2 shadow-sm shadow-brand-500/20 shrink-0"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Access Portal</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <section className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-12 lg:p-16 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none opacity-60"></div>
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-[10px] sm:text-xs font-bold text-brand-700 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600" />
              Enterprise Role-Based Assessment Portal
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Academic Assignment & Assessment System
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-normal">
              EduAssess provides a structured, enterprise-grade environment for faculties, instructors, and students to assign, submit, grade, and evaluate academic coursework with security and transparency.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold transition-all duration-200 h-12 px-8 text-sm bg-brand-600 text-white hover:bg-brand-700 rounded-2xl gap-2 shadow-md shadow-brand-500/25"
              >
                Go to Portal <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Role Portals Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Role-Based Ecosystem</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Dedicated interfaces designed specifically for each role in the academic workflow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-brand-300 transition-all duration-200 hover:shadow-md space-y-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-2xs">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Student Portal</h3>
                  <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg border border-brand-200">
                    Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  View assigned coursework, submit solutions before strict deadlines, and track grades.
                </p>
                <ul className="space-y-2.5 text-xs font-medium text-gray-700 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                    Submit coursework files securely
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                    Track submission status & grades
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                    View instructor written feedback
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center font-medium transition-all duration-200 h-10 text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl gap-2 shadow-sm"
              >
                Student Sign In <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
              </Link>
            </div>

            {/* Teacher Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all duration-200 hover:shadow-md space-y-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Teacher Portal</h3>
                  <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                    Teacher
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Publish assignments, set due dates, review student submissions, and input grades.
                </p>
                <ul className="space-y-2.5 text-xs font-medium text-gray-700 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Create & manage coursework
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Grade submissions with feedback
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Draft or publish assignments
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center font-medium transition-all duration-200 h-10 text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl gap-2 shadow-sm"
              >
                Teacher Sign In <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all duration-200 hover:shadow-md space-y-6 sm:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Admin Portal</h3>
                  <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                    Admin
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Manage platform users, define academic courses, and assign faculty instructors.
                </p>
                <ul className="space-y-2.5 text-xs font-medium text-gray-700 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    Manage system users & roles
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    Create courses & assign teachers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    Enroll students into courses
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center font-medium transition-all duration-200 h-10 text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl gap-2 shadow-sm"
              >
                Admin Sign In <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 font-medium">
          EduAssess © {new Date().getFullYear()} Enterprise Academic Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}