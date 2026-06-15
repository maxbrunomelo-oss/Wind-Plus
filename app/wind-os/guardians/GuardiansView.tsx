'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/windos/DataTable';
import { IconSearch, IconPlus, IconEdit, IconWhatsapp, IconGuardian } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { FormModal, FieldDef, FormValues } from '@/components/windos/Modal';
import { saveGuardian } from '@/app/wind-os/actions';
import type { Guardian } from '@/lib/windos/types';

interface Props {
  guardians: Guardian[];
  students: { id: string; name: string }[];
  studentNameById: Record<string, string>;
}

export default function GuardiansView({ guardians, students, studentNameById }: Props) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Guardian | null>(null);

  const filtered = useMemo(() => guardians.filter(g => !q || g.name.toLowerCase().includes(q.toLowerCase())), [q, guardians]);
  const studentName = (id: string) => studentNameById[id] ?? '—';

  const fields: FieldDef[] = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'relationship', label: 'Parentesco', type: 'text', half: true, placeholder: 'Mãe, Pai, Responsável...' },
    { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: true, half: true },
    { name: 'email', label: 'E-mail', type: 'email', half: true },
    { name: 'cpf', label: 'CPF', type: 'text', half: true },
    { name: 'address', label: 'Endereço', type: 'text' },
    { name: 'studentIds', label: 'Alunos vinculados', type: 'multiselect', options: students.map(s => ({ value: s.id, label: s.name })) },
    { name: 'notes', label: 'Observações', type: 'textarea' },
  ];

  const toInitial = (g: Guardian): FormValues => ({
    name: g.name, relationship: g.relationship ?? '', whatsapp: g.whatsapp, email: g.email ?? '',
    cpf: g.cpf ?? '', address: g.address ?? '', studentIds: g.studentIds ?? [], notes: g.notes ?? '',
  });

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (g: Guardian) => { setEditing(g); setModalOpen(true); };

  const columns: Column<Guardian>[] = [
    { key: 'name', header: 'Responsável', render: g => (<div><span className="font-medium text-gray-900">{g.name}</span><p className="text-xs text-gray-400">{g.relationship}</p></div>) },
    { key: 'student', header: 'Aluno(s)', render: g => <div className="space-y-0.5">{g.studentIds.map(sid => <Link key={sid} href={`/wind-os/students/${sid}`} className="block text-sm text-[#E30613] hover:underline">{studentName(sid)}</Link>)}</div> },
    { key: 'wa', header: 'WhatsApp', render: g => <span className="text-gray-600 text-sm flex items-center gap-1.5"><IconWhatsapp size={14} className="text-gray-400" /> {g.whatsapp}</span> },
    { key: 'email', header: 'E-mail', render: g => <span className="text-gray-600 text-sm">{g.email ?? '—'}</span> },
    { key: 'cpf', header: 'CPF', render: g => <span className="text-gray-500 text-sm">{g.cpf ?? '—'}</span> },
    { key: 'actions', header: '', className: 'text-right', render: g => (
      <button onClick={() => openEdit(g)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs font-medium"><IconEdit size={14} /> Editar</button>
    ) },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Responsáveis</h1><p className="text-sm text-gray-500">{guardians.length} responsáveis cadastrados</p></div>
        <button onClick={openNew} className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo responsável</button>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 max-w-md">
        <IconSearch size={16} className="text-gray-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar responsável..." className="bg-transparent text-sm outline-none flex-1" />
      </div>
      <DataTable columns={columns} rows={filtered} rowKey={g => g.id} empty={<EmptyState title="Nenhum responsável" icon={<IconGuardian size={22} />} />} />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar responsável' : 'Novo responsável'}
        subtitle={editing ? editing.name : 'Cadastre um novo responsável'}
        fields={fields}
        initial={editing ? toInitial(editing) : undefined}
        submitLabel={editing ? 'Salvar alterações' : 'Cadastrar responsável'}
        onSubmit={async (values) => {
          const res = await saveGuardian(values, editing?.id);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
