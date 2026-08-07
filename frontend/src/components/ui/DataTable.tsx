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
      <div className={cn('w-full bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center text-sm text-slate-500 shadow-xs', className)}>
        <div className="max-w-xs mx-auto space-y-2">
          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            📊
          </div>
          <p className="font-semibold text-slate-700 text-sm">{emptyMessage}</p>
          <p className="text-xs text-slate-400">Try adjusting your search terms or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Mobile Stacked Card View (< md) */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {data.map((item, index) => {
          const rowKey = keyExtractor
            ? keyExtractor(item, index)
            : (item as any)?._id || (item as any)?.id || index;

          return (
            <div
              key={rowKey}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3 border-l-4 border-l-indigo-600"
            >
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-slate-100 last:border-b-0 pb-2.5 last:pb-0">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {col.header}
                  </span>
                  <div className="text-slate-900 font-semibold sm:text-right max-w-full break-words">
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

      {/* Desktop Traditional Table View (>= md) */}
      <div className="hidden md:block w-full bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[640px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 select-none',
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => {
                const rowKey = keyExtractor
                  ? keyExtractor(item, index)
                  : (item as any)?._id || (item as any)?.id || index;

                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-indigo-50/20 transition-colors text-slate-900 group"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-5 py-4 text-xs font-medium', col.className)}>
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
    </div>
  );
}
