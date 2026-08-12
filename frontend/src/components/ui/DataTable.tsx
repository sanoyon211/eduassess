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
  if (data.length === 0) {
    return (
      <div className={cn('w-full bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500 shadow-sm', className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item, index) => {
          const rowKey = keyExtractor
            ? keyExtractor(item, index)
            : (item as any)?._id || (item as any)?.id || index;

          return (
            <div
              key={rowKey}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2.5 transition-all duration-200 hover:shadow-md"
            >
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">
                    {col.header}
                  </span>
                  <div className="text-gray-900 font-medium sm:text-right max-w-full break-words">
                    {col.render
                      ? col.render(item, index)
                      : (item as any)[col.key] !== undefined
                      ? String((item as any)[col.key])
                      : '-'}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="hidden md:block w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 select-none',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => {
              const rowKey = keyExtractor
                ? keyExtractor(item, index)
                : (item as any)?._id || (item as any)?.id || index;

              return (
                <tr
                  key={rowKey}
                  className="hover:bg-gray-50/80 transition-colors text-gray-900"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-5 py-4 font-normal whitespace-nowrap', col.className)}>
                      {col.render
                        ? col.render(item, index)
                        : (item as any)[col.key] !== undefined
                        ? String((item as any)[col.key])
                        : '-'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}