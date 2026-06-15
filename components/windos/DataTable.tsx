'use client';
import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: React.ReactNode;
}

export default function DataTable<T>({ columns, rows, rowKey, empty }: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map(c => (
                <th key={c.key} className={`text-left font-semibold text-gray-500 text-xs uppercase tracking-wide px-4 py-3 ${c.className ?? ''}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={rowKey(row)} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                {columns.map(c => (
                  <td key={c.key} className={`px-4 py-3 text-gray-700 ${c.className ?? ''}`}>{c.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (empty ?? <div className="py-10 text-center text-sm text-gray-400">Nenhum registro encontrado.</div>)}
    </div>
  );
}
