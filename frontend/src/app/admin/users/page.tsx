'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Users, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import api from '@/lib/axios';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/users');
      const data: UserRecord[] = response.data.data || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const columns: DataTableColumn<UserRecord>[] = [
    {
      key: 'name',
      header: 'User Name',
      render: (u) => <span className="font-semibold text-slate-900">{u.name}</span>,
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (u) => <span className="text-slate-600 font-mono text-xs">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => {
        switch (u.role) {
          case 'Admin':
            return <Badge variant="default">Admin</Badge>;
          case 'Teacher':
            return <Badge variant="success">Teacher</Badge>;
          case 'Student':
            return <Badge variant="info">Student</Badge>;
          default:
            return <Badge variant="secondary">{u.role}</Badge>;
        }
      },
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      render: (u) => (
        <span className="text-slate-500 text-xs">
          {u.createdAt ? format(new Date(u.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-slate-700" /> Institution Users
            </h1>
            <p className="text-sm text-slate-600">
              Complete list of all registered accounts across Admin, Faculty, and Student roles.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh List
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Users: <span className="text-slate-900 font-bold">{filteredUsers.length}</span>
          </span>
        </div>

        {/* Error message display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* User Data Table or Skeleton Loader */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={4} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers}
            emptyMessage="No users found matching your search filter."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
