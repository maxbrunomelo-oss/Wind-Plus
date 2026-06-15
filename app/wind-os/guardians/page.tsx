'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DataTable, { Column } from '@/components/windos/DataTable';
import { IconSearch, IconPlus, IconWhatsapp, IconGuardian } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { guardians, studentName } from '@/lib/windos/mock-data';
import type { Guardian } from '@/lib/windos/types';

export default function GuardiansPage() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => guardians.filter(g => !q || g.name.toLowerCase().includes(q.toLowerCase())), [q]);

  const columns: Column<Guardian>[] = [
    { key: 'name', header: 'Responsável', render: g => (<div><span className="font-medium text-gray-900">{g.name}</span><p className="text-xs text-gray-400">{g.relationship}</p></div>) },
    { key: 'student', header: 'Aluno(s)', render: g => <div className="space-y-0.5">{g.studentIds.map(sid => <Link key={sid} href={`/wind-os/students/${sid}`} className="block text-sm text-[#E30613] hover:underline">{studentName(sid)}</Link>)}</div> },
    { key: 'wa', header: 'WhatsApp', render: g => <span className="text-gray-600 text-sm flex items-center gap-1.5"><IconWhatsapp size={14} className="text-gray-400" /> {g.whatsapp}</span> },
    { key: 'email', header: 'E-mail', render: g => <span className="text-gray-600 text-sm">{g.email ?? '—'}</span> },
    { key: 'cpf', header: 'CPF', render: g => <span className="text-gray-500 text-sm">{g.cpf ?? '—'}</span> },
    { key: 'notes', header: 'Observações', render: g => <span className="text-gray-500 text-xs">{g.notes ?? '—'}</span> },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Responsáveis</h1><p className="text-sm text-gray-500">{guardians.length} responsáveis cadastrados</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo responsável</button>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 max-w-md">
        <IconSearch size={16} className="text-gray-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar responsável..." className="bg-transparent text-sm outline-none flex-1" />
      </div>
      <DataTable columns={columns} rows={filtered} rowKey={g => g.id} empty={<EmptyState title="Nenhum responsável" icon={<IconGuardian size={22} />} />} />
    </div>
  );
}
