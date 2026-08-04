'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BookOpen, Shield, KeyRound, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to sign in. Please check your credentials.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Main Centered Login Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 space-y-6">
          {/* Brand & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-slate-900 text-white font-bold mb-2">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign in to EduAssess
            </h1>
            <p className="text-sm text-slate-600">
              Enter your institutional credentials to access your portal.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@eduassess.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center h-10"
              isLoading={isSubmitting}
            >
              <KeyRound className="h-4 w-4" />
              Sign In
            </Button>
          </form>
        </div>

        {/* Demo Credentials Quick Fill */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            Demo Accounts (Default Password: <span className="font-mono text-slate-900 font-bold">Password123!</span>)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin@eduassess.com')}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('teacher1@eduassess.com')}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors text-center"
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('student1@eduassess.com')}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors text-center"
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
