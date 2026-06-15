'use client';
import React from 'react';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge, { entityStatusBadge } from '@/components/windos/Badge';
import { IconPlus, IconWhatsapp, IconMail, IconTeacher } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { teachers, classes, students } from '@/lib/windos/mock-data';
import type { Teacher } from '@/lib/windos/types';

export default function TeachersPage() {
  const classesOf = (id: string) => classes.filter(c => c.teacherId === id).length;
  const studentsOf = (id: string) => students.filter(s => s.teacherId === id && s.status !== 'CANCELADO').length;

  const columns: Column<Teacher>[] = [
    { key: 'name', header: 'Professor', render: t => (<div><span className="font-medium text-gray-900">{t.name}</span><p className="text-xs text-gray-400">{t.notes}</p></div>) },
    { key: 'contact', header: 'Contato', render: t => (<div className="text-sm text-gray-600 space-y-0.5"><span className="flex items-center gap-1.5"><IconMail size={13} className="text-gray-400" /> {t.email}</span><span className="flex items-center gap-1.5"><IconWhatsapp size={13} className="text-gray-400" /> {t.whatsapp}</span></div>) },
    { key: 'classes', header: 'Turmas', render: t => <span className="text-gray-700 font-medium">{classesOf(t.id)}</span> },
    { key: 'students', header: 'Alunos', render: t => <span className="text-gray-700 font-medium">{studentsOf(t.id)}</span> },
    { key: 'status', header: 'Status', render: t => { const b = entityStatusBadge(t.status); return <Badge label={b.label} variant={b.variant} />; } },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Professores</h1><p className="text-sm text-gray-500">{teachers.length} professores</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo professor</button>
      </div>
      <DataTable columns={columns} rows={teachers} rowKey={t => t.id} empty={<EmptyState title="Nenhum professor" icon={<IconTeacher size={22} />} />} />
    </div>
  );
}
