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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 text-white font-bold shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                EduAssess
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  Enterprise
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">Role-Based Assignment Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-medium transition-colors h-9 px-3.5 sm:px-4 text-xs sm:text-sm border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-medium transition-colors h-9 px-3.5 sm:px-4 text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg gap-1.5 shadow-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Access Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4 sm:space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Enterprise Role-Based Assessment Portal
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Academic Assignment & Assessment System
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
              EduAssess provides a structured, enterprise-grade environment for faculties, instructors, and students to assign, submit, grade, and evaluate academic coursework with security and transparency.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold transition-colors h-11 px-6 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-xl gap-2 shadow-md shadow-blue-500/20"
              >
                Go to Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Role Portals Grid Across sm, md, lg, xl */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Role-Based Ecosystem</h2>
            <p className="text-xs sm:text-sm text-slate-600">Dedicated interfaces designed specifically for each role in the academic workflow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors space-y-4">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                    Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  View assigned coursework, submit solutions before strict deadlines, and track grades.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    Submit coursework files
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    Track submission status & grades
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    View instructor feedback
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center font-medium transition-colors h-9 text-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg gap-1.5"
              >
                Student Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Teacher Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors space-y-4">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Teacher Portal</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    Teacher
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Publish assignments, set due dates, review student submissions, and input grades.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Create & manage coursework
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Grade submissions with feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Draft or publish assignments
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center font-medium transition-colors h-9 text-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg gap-1.5"
              >
                Teacher Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-colors space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Admin Portal</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                    Admin
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Manage platform users, define academic courses, and assign faculty instructors.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    Manage system users & roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    Create courses & assign teachers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    Enroll students into courses
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center font-medium transition-colors h-9 text-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg gap-1.5"
              >
                Admin Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          EduAssess © {new Date().getFullYear()} Enterprise Academic Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
