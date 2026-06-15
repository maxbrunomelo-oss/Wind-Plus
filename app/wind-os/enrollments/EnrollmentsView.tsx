'use client';
import React from 'react';
import Link from 'next/link';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge from '@/components/windos/Badge';
import { IconPlus, IconEnroll } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { brl, dateBR } from '@/lib/windos/format';
import type { Enrollment } from '@/lib/windos/types';

const enrollStatus: Record<string, { label: string; variant: 'green' | 'gray' | 'red' | 'yellow' }> = {
  ATIVA: { label: 'Ativa', variant: 'green' },
  ENCERRADA: { label: 'Encerrada', variant: 'gray' },
  CANCELADA: { label: 'Cancelada', variant: 'red' },
  PAUSADA: { label: 'Pausada', variant: 'yellow' },
};

interface Props {
  enrollments: Enrollment[];
  studentNameById: Record<string, string>;
  classNameById: Record<string, string>;
}

export default function EnrollmentsView({ enrollments, studentNameById, classNameById }: Props) {
  const studentName = (id: string) => studentNameById[id] ?? '—';
  const className = (id: string) => classNameById[id] ?? '—';

  const columns: Column<Enrollment>[] = [
    { key: 'student', header: 'Aluno', render: e => <Link href={`/wind-os/students/${e.studentId}`} className="font-medium text-gray-900 hover:text-[#E30613]">{studentName(e.studentId)}</Link> },
    { key: 'class', header: 'Turma', render: e => <span className="text-gray-600">{className(e.classId)}</span> },
    { key: 'start', header: 'Início', render: e => <span className="text-gray-500 text-xs">{dateBR(e.startDate)}</span> },
    { key: 'amount', header: 'Mensalidade', render: e => (<div><span className="font-medium text-gray-900">{brl(e.monthlyAmount - e.discountAmount)}</span>{e.discountAmount > 0 && <p className="text-xs text-green-600">desc. {brl(e.discountAmount)}</p>}</div>) },
    { key: 'due', header: 'Vencimento', render: e => <span className="text-gray-600">Dia {e.dueDay}</span> },
    { key: 'method', header: 'Forma', render: e => <Badge label={e.paymentMethod} variant="gray" /> },
    { key: 'status', header: 'Status', render: e => { const b = enrollStatus[e.status]; return <Badge label={b.label} variant={b.variant} />; } },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Matrículas</h1><p className="text-sm text-gray-500">Vínculo entre aluno, turma e plano financeiro</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Nova matrícula</button>
      </div>
      <DataTable columns={columns} rows={enrollments} rowKey={e => e.id} empty={<EmptyState title="Nenhuma matrícula" icon={<IconEnroll size={22} />} />} />
    </div>
  );
}
