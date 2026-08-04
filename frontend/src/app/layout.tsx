import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduAssess - Role-Based Assignment Management System',
  description: 'Enterprise academic assessment and assignment management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
