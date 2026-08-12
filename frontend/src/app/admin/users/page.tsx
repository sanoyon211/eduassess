'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
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
      className: 'min-w-[180px]',
      render: (u) => <span className="font-semibold text-gray-900 whitespace-nowrap">{u.name}</span>,
    },
    {
      key: 'email',
      header: 'Email Address',
      className: 'min-w-[200px]',
      render: (u) => <span className="text-gray-500 font-mono text-xs whitespace-nowrap">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'Assigned Role',
      className: 'min-w-[120px]',
      render: (u) => <StatusBadge status={u.role} />,
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      className: 'min-w-[140px]',
      render: (u) => (
        <span className="text-gray-500 text-xs font-medium whitespace-nowrap">
          {u.createdAt ? format(new Date(u.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Institution Users"
          subtitle="Complete list of all registered accounts across Admin, Faculty, and Student roles."
          icon={Users}
          iconClassName="text-brand-600"
          actions={
            <Button variant="outline" size="md" onClick={fetchUsers} className="gap-2 shadow-sm">
              <RefreshCw className="h-4 w-4" /> Refresh List
            </Button>
          }
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm transition-all">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Users
            </span>
            <span className="text-sm text-brand-700 font-bold bg-white px-2.5 py-0.5 rounded-md shadow-sm border border-gray-100">
              {filteredUsers.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

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