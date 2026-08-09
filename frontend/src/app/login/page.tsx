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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 antialiased">
      <div className="max-w-md w-full space-y-6">
        {/* Main Centered Login Card */}
        <div className="bg-white border border-gray-200/80 shadow-xl rounded-2xl p-8 space-y-6 transition-all">
          {/* Brand & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-brand-600 text-white font-bold mb-3 shadow-lg shadow-brand-500/30">
              <BookOpen className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Sign in to EduAssess
            </h1>
            <p className="text-sm text-gray-500">
              Enter your institutional credentials to access your portal.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
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
              className="w-full justify-center h-11 text-[15px]"
              isLoading={isSubmitting}
            >
              <KeyRound className="h-4.5 w-4.5" />
              Sign In
            </Button>
          </form>
        </div>

        {/* Demo Credentials Quick Fill */}
        <div className="bg-white border border-gray-200/80 shadow-sm rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <Shield className="h-4 w-4 text-gray-400" />
            Demo Accounts (Password: <span className="font-mono text-gray-900 font-bold bg-gray-100 px-1.5 py-0.5 rounded">Password123!</span>)
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin@eduassess.com')}
              className="px-3 py-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-all duration-200 text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('teacher1@eduassess.com')}
              className="px-3 py-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-all duration-200 text-center"
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('student1@eduassess.com')}
              className="px-3 py-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-all duration-200 text-center"
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}