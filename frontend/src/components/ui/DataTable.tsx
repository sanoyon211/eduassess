import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No records found',
  keyExtractor,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto', className)}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 select-none',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-slate-500 bg-white"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const rowKey = keyExtractor
                ? keyExtractor(item, index)
                : (item as any)?._id || (item as any)?.id || index;

              return (
                <tr
                  key={rowKey}
                  className="hover:bg-slate-50/60 transition-colors text-slate-900"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 font-normal', col.className)}>
                      {col.render
                        ? col.render(item, index)
                        : (item as any)[col.key] !== undefined
                        ? String((item as any)[col.key])
                        : '-'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
