import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 antialiased selection:bg-brand-500 selection:text-white">
      <div className="max-w-md w-full bg-white border border-gray-200/80 shadow-xl rounded-3xl p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 w-32 h-32 bg-brand-50 rounded-full blur-3xl pointer-events-none opacity-80"></div>

        <div className="flex justify-center relative z-10">
          <div className="h-20 w-20 bg-brand-50 rounded-2xl flex items-center justify-center shadow-inner border border-brand-100">
            <FileQuestion className="h-10 w-10 text-brand-600" />
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-sm text-gray-500 leading-relaxed mt-2">
            Oops! The page you are looking for doesn't exist, has been moved, or you don't have the right permissions to access it.
          </p>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row gap-3 justify-center relative z-10">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full gap-2 h-11 text-sm shadow-md shadow-brand-500/20 px-6">
              <Home className="h-4.5 w-4.5" /> Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}