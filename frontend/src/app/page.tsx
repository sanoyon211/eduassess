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
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-slate-900 text-white font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                EduAssess
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                  Enterprise
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">Role-Based Assignment Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-medium transition-colors h-9 px-4 text-sm border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-medium transition-colors h-9 px-4 text-sm bg-slate-900 text-white hover:bg-slate-800 rounded-md gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" /> Access Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
              Role-Based Access Control (RBAC) Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Academic Assignment & Assessment System
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              EduAssess provides a structured, enterprise-grade environment for faculties, instructors, and students to assign, submit, grade, and evaluate academic coursework with security and transparency.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center font-medium transition-colors h-10 px-5 text-sm bg-slate-900 text-white hover:bg-slate-800 rounded-md gap-2 shadow-sm"
              >
                Go to Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Role Portals Grid */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Role-Based Ecosystem</h2>
            <p className="text-sm text-slate-600">Dedicated interfaces designed specifically for each role in the academic workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Student Portal</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                    Student
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  View assigned coursework, submit solutions before strict deadlines, and track grades.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> View enrolled course assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Deadline enforcement protection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> View grades & teacher feedback
                  </li>
                </ul>
              </div>
            </div>

            {/* Faculty Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Faculty Console</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    Teacher
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Publish assignments, set due dates, review student submissions, and input grades.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Create & publish assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Strict IDOR-protected grading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Record marks & written feedback
                  </li>
                </ul>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Admin Console</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                    Admin
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Manage user accounts, create courses, assign faculty instructors, and enroll students.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Institution user management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Course creation & teacher assignment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Student course enrollment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-900">EduAssess</span>
            <span className="text-slate-400">•</span>
            <span>Academic Role-Based Assignment Management System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
