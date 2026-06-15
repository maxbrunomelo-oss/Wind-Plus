'use client';
import React from 'react';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge, { entityStatusBadge, modalidadeBadge, cefrBadge } from '@/components/windos/Badge';
import { IconPlus, IconClasses } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import type { SchoolClass } from '@/lib/windos/types';

interface Props {
  classes: SchoolClass[];
  teacherNameById: Record<string, string>;
  studentCount: Record<string, number>;
}

export default function ClassesView({ classes, teacherNameById, studentCount }: Props) {
  const teacherName = (id: string) => teacherNameById[id] ?? '—';

  const columns: Column<SchoolClass>[] = [
    { key: 'name', header: 'Turma', render: c => (<div><span className="font-medium text-gray-900">{c.name}</span><p className="text-xs text-gray-400">{c.weekdays.join(', ')} · {c.schedule}</p></div>) },
    { key: 'mod', header: 'Modalidade', render: c => { const b = modalidadeBadge(c.modalidade); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'teacher', header: 'Professor', render: c => <span className="text-gray-600">{teacherName(c.teacherId)}</span> },
    { key: 'count', header: 'Alunos', render: c => <span className="text-gray-700 font-medium">{studentCount[c.id] ?? 0}</span> },
    { key: 'cefr', header: 'Nível', render: c => { const b = cefrBadge(c.cefrLevel); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'status', header: 'Status', render: c => { const b = entityStatusBadge(c.status); return <Badge label={b.label} variant={b.variant} />; } },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Turmas</h1><p className="text-sm text-gray-500">{classes.length} turmas ativas</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Nova turma</button>
      </div>
      <DataTable columns={columns} rows={classes} rowKey={c => c.id} empty={<EmptyState title="Nenhuma turma" icon={<IconClasses size={22} />} />} />
    </div>
  );
}
