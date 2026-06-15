'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge, { entityStatusBadge } from '@/components/windos/Badge';
import { IconPlus, IconEdit, IconWhatsapp, IconMail, IconTeacher } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { FormModal, FieldDef, FormValues } from '@/components/windos/Modal';
import { saveTeacher } from '@/app/wind-os/actions';
import type { Teacher } from '@/lib/windos/types';

interface Props {
  teachers: Teacher[];
  classesCount: Record<string, number>;
  studentsCount: Record<string, number>;
}

const fields: FieldDef[] = [
  { name: 'name', label: 'Nome', type: 'text', required: true },
  { name: 'email', label: 'E-mail', type: 'email', required: true, half: true },
  { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: true, half: true },
  { name: 'status', label: 'Status', type: 'select', half: true, options: [{ value: 'ATIVO', label: 'Ativo' }, { value: 'INATIVO', label: 'Inativo' }] },
  { name: 'notes', label: 'Observações', type: 'textarea' },
];

export default function TeachersView({ teachers, classesCount, studentsCount }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t: Teacher) => { setEditing(t); setModalOpen(true); };

  const toInitial = (t: Teacher): FormValues => ({ name: t.name, email: t.email, whatsapp: t.whatsapp, status: t.status, notes: t.notes ?? '' });

  const columns: Column<Teacher>[] = [
    { key: 'name', header: 'Professor', render: t => (<div><span className="font-medium text-gray-900">{t.name}</span><p className="text-xs text-gray-400">{t.notes}</p></div>) },
    { key: 'contact', header: 'Contato', render: t => (<div className="text-sm text-gray-600 space-y-0.5"><span className="flex items-center gap-1.5"><IconMail size={13} className="text-gray-400" /> {t.email}</span><span className="flex items-center gap-1.5"><IconWhatsapp size={13} className="text-gray-400" /> {t.whatsapp}</span></div>) },
    { key: 'classes', header: 'Turmas', render: t => <span className="text-gray-700 font-medium">{classesCount[t.id] ?? 0}</span> },
    { key: 'students', header: 'Alunos', render: t => <span className="text-gray-700 font-medium">{studentsCount[t.id] ?? 0}</span> },
    { key: 'status', header: 'Status', render: t => { const b = entityStatusBadge(t.status); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'actions', header: '', className: 'text-right', render: t => (
      <button onClick={() => openEdit(t)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs font-medium"><IconEdit size={14} /> Editar</button>
    ) },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Professores</h1><p className="text-sm text-gray-500">{teachers.length} professores</p></div>
        <button onClick={openNew} className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo professor</button>
      </div>
      <DataTable columns={columns} rows={teachers} rowKey={t => t.id} empty={<EmptyState title="Nenhum professor" icon={<IconTeacher size={22} />} />} />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar professor' : 'Novo professor'}
        subtitle={editing ? editing.name : 'Cadastre um novo professor'}
        fields={fields}
        initial={editing ? toInitial(editing) : undefined}
        submitLabel={editing ? 'Salvar alterações' : 'Cadastrar professor'}
        onSubmit={async (values) => {
          const res = await saveTeacher(values, editing?.id);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
