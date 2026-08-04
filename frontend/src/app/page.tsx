import React from 'react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      <header className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">EduAssess System Portal</h1>
        <p className="text-slate-600 mt-2">
          Role-Based Assignment Management System for Students, Teachers, and Admins.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Student Portal</h2>
          <p className="text-sm text-slate-600 mt-1">Submit assignments & track grades.</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Teacher Portal</h2>
          <p className="text-sm text-slate-600 mt-1">Create assignments & grade submissions.</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Admin Portal</h2>
          <p className="text-sm text-slate-600 mt-1">Manage users, courses, & permissions.</p>
        </div>
      </div>
    </div>
  );
}
