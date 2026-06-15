'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge, { studentStatusBadge, modalidadeBadge, cefrBadge } from '@/components/windos/Badge';
import { IconSearch, IconPlus, IconEye, IconStudents } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { students, teacherName, className, teachers } from '@/lib/windos/mock-data';
import { dateBR } from '@/lib/windos/format';
import type { Student } from '@/lib/windos/types';

export default function StudentsPage() {
  const [q, setQ] = useState('');
  const [mod, setMod] = useState('');
  const [status, setStatus] = useState('');
  const [teacher, setTeacher] = useState('');

  const filtered = useMemo(() => students.filter(s =>
    (!q || s.fullName.toLowerCase().includes(q.toLowerCase())) &&
    (!mod || s.modalidade === mod) &&
    (!status || s.status === status) &&
    (!teacher || s.teacherId === teacher)
  ), [q, mod, status, teacher]);

  const columns: Column<Student>[] = [
    {
      key: 'name', header: 'Aluno', render: s => (
        <div>
          <Link href={`/wind-os/students/${s.id}`} className="font-medium text-gray-900 hover:text-[#E30613]">{s.fullName}</Link>
          <p className="text-xs text-gray-400">{s.email}</p>
        </div>
      ),
    },
    { key: 'mod', header: 'Modalidade', render: s => { const b = modalidadeBadge(s.modalidade); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'cefr', header: 'Nível', render: s => { const b = cefrBadge(s.cefrLevel); return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'class', header: 'Turma', render: s => <span className="text-gray-600">{className(s.classId)}</span> },
    { key: 'teacher', header: 'Professor', render: s => <span className="text-gray-600">{teacherName(s.teacherId)}</span> },
    { key: 'start', header: 'Entrada', render: s => <span className="text-gray-500 text-xs">{dateBR(s.startDate)}</span> },
    { key: 'status', header: 'Status', render: s => { const b = studentStatusBadge(s.status); return <Badge label={b.label} variant={b.variant} />; } },
    {
      key: 'actions', header: '', className: 'text-right', render: s => (
        <Link href={`/wind-os/students/${s.id}`} className="inline-flex items-center gap-1 text-[#E30613] hover:underline text-xs font-medium"><IconEye size={14} /> Perfil</Link>
      ),
    },
  ];

  const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Alunos</h1>
          <p className="text-sm text-gray-500">{filtered.length} de {students.length} alunos</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium transition-colors">
          <IconPlus size={16} /> Novo aluno
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <IconSearch size={16} className="text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome..." className="bg-transparent text-sm outline-none flex-1" />
        </div>
        <select value={mod} onChange={e => setMod(e.target.value)} className={selectCls}>
          <option value="">Todas modalidades</option>
          <option value="ONLINE">Online</option>
          <option value="PRESENCIAL">Presencial</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
          <option value="">Todos status</option>
          {['ATIVO', 'PAUSADO', 'CANCELADO', 'EXPERIMENTAL', 'INADIMPLENTE'].map(st => <option key={st} value={st}>{studentStatusBadge(st).label}</option>)}
        </select>
        <select value={teacher} onChange={e => setTeacher(e.target.value)} className={selectCls}>
          <option value="">Todos professores</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <DataTable
        columns={columns} rows={filtered} rowKey={s => s.id}
        empty={<EmptyState title="Nenhum aluno encontrado" description="Ajuste os filtros ou cadastre um novo aluno." icon={<IconStudents size={22} />} />}
      />
    </div>
  );
}
