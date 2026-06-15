'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge, { entityStatusBadge, modalidadeBadge, cefrBadge } from '@/components/windos/Badge';
import { IconPlus, IconEdit, IconClasses } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { FormModal, FieldDef, FormValues } from '@/components/windos/Modal';
import { saveClass } from '@/app/wind-os/actions';
import type { SchoolClass } from '@/lib/windos/types';

interface Props {
  classes: SchoolClass[];
  teachers: { id: string; name: string }[];
  teacherNameById: Record<string, string>;
  studentCount: Record<string, number>;
}

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const WEEKDAYS = [
  { value: 'SEG', label: 'Seg' }, { value: 'TER', label: 'Ter' }, { value: 'QUA', label: 'Qua' },
  { value: 'QUI', label: 'Qui' }, { value: 'SEX', label: 'Sex' }, { value: 'SAB', label: 'Sáb' }, { value: 'DOM', label: 'Dom' },
];

export default function ClassesView({ classes, teachers, teacherNameById, studentCount }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolClass | null>(null);

  const teacherName = (id: string) => teacherNameById[id] ?? '—';

  const fields: FieldDef[] = [
    { name: 'name', label: 'Nome da turma', type: 'text', required: true },
    { name: 'teacherId', label: 'Professor', type: 'select', required: true, half: true, options: teachers.map(t => ({ value: t.id, label: t.name })) },
    { name: 'modalidade', label: 'Modalidade', type: 'select', required: true, half: true, options: [{ value: 'ONLINE', label: 'Online' }, { value: 'PRESENCIAL', label: 'Presencial' }] },
    { name: 'cefrLevel', label: 'Nível CEFR', type: 'select', half: true, options: CEFR.map(c => ({ value: c, label: c })) },
    { name: 'status', label: 'Status', type: 'select', half: true, options: [{ value: 'ATIVO', label: 'Ativo' }, { value: 'INATIVO', label: 'Inativo' }] },
    { name: 'weekdays', label: 'Dias da semana', type: 'multiselect', options: WEEKDAYS },
    { name: 'schedule', label: 'Horário', type: 'text', half: true, placeholder: '19h - 20h30' },
    { name: 'notes', label: 'Observações', type: 'textarea' },
  ];

  const toInitial = (c: SchoolClass): FormValues => ({
    name: c.name, teacherId: c.teacherId ?? '', modalidade: c.modalidade, cefrLevel: c.cefrLevel,
    status: c.status, weekdays: c.weekdays ?? [], schedule: c.schedule ?? '', notes: c.notes ?? '',
  });

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: SchoolClass) => { setEditing(c); setModalOpen(true); };

  const columns: Column<SchoolClass>[] = [
    { key: 'name', header: 'Turma', render: c => (<div><span className="font-medium text-gray-900">{c.name}</span><p className="text-xs text-gray-400">{c.weekdays.join(', ')} · {c.schedule}</p></div>) },
    { key: 'mod', header: 'Modalidade', render: c => { const b = modalidadeBadge(c.modalidade); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'teacher', header: 'Professor', render: c => <span className="text-gray-600">{teacherName(c.teacherId)}</span> },
    { key: 'count', header: 'Alunos', render: c => <span className="text-gray-700 font-medium">{studentCount[c.id] ?? 0}</span> },
    { key: 'cefr', header: 'Nível', render: c => { const b = cefrBadge(c.cefrLevel); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'status', header: 'Status', render: c => { const b = entityStatusBadge(c.status); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'actions', header: '', className: 'text-right', render: c => (
      <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs font-medium"><IconEdit size={14} /> Editar</button>
    ) },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Turmas</h1><p className="text-sm text-gray-500">{classes.length} turmas ativas</p></div>
        <button onClick={openNew} className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Nova turma</button>
      </div>
      <DataTable columns={columns} rows={classes} rowKey={c => c.id} empty={<EmptyState title="Nenhuma turma" icon={<IconClasses size={22} />} />} />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar turma' : 'Nova turma'}
        subtitle={editing ? editing.name : 'Cadastre uma nova turma'}
        fields={fields}
        initial={editing ? toInitial(editing) : undefined}
        submitLabel={editing ? 'Salvar alterações' : 'Cadastrar turma'}
        onSubmit={async (values) => {
          const res = await saveClass(values, editing?.id);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
