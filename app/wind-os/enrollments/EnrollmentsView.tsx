'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/windos/DataTable';
import Badge from '@/components/windos/Badge';
import { IconPlus, IconEdit, IconEnroll, IconWhatsapp, IconDoc } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { FormModal, FieldDef, FormValues } from '@/components/windos/Modal';
import { brl, dateBR } from '@/lib/windos/format';
import { saveEnrollment } from '@/app/wind-os/actions';
import type { Enrollment } from '@/lib/windos/types';

const enrollStatus: Record<string, { label: string; variant: 'green' | 'gray' | 'red' | 'yellow' }> = {
  ATIVA: { label: 'Ativa', variant: 'green' },
  ENCERRADA: { label: 'Encerrada', variant: 'gray' },
  CANCELADA: { label: 'Cancelada', variant: 'red' },
  PAUSADA: { label: 'Pausada', variant: 'yellow' },
};

interface Props {
  enrollments: Enrollment[];
  students: { id: string; name: string }[];
  classes: { id: string; name: string }[];
  studentNameById: Record<string, string>;
  classNameById: Record<string, string>;
}

const PAYMENT_METHODS = ['PIX', 'BOLETO', 'CARTAO', 'DINHEIRO', 'TRANSFERENCIA', 'OUTRO'];
const ENROLL_STATUS = ['ATIVA', 'ENCERRADA', 'CANCELADA', 'PAUSADA'];

export default function EnrollmentsView({ enrollments, students, classes, studentNameById, classNameById }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Enrollment | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const studentName = (id: string) => studentNameById[id] ?? '—';
  const className = (id: string) => classNameById[id] ?? '—';

  const matriculaUrl = typeof window !== 'undefined' ? `${window.location.origin}/matricula` : '/matricula';

  const fields: FieldDef[] = [
    { name: 'studentId', label: 'Aluno', type: 'select', required: true, half: true, options: students.map(s => ({ value: s.id, label: s.name })) },
    { name: 'classId', label: 'Turma', type: 'select', required: true, half: true, options: classes.map(c => ({ value: c.id, label: c.name })) },
    { name: 'startDate', label: 'Início', type: 'date', required: true, half: true },
    { name: 'endDate', label: 'Término', type: 'date', half: true },
    { name: 'monthlyAmount', label: 'Mensalidade (R$)', type: 'number', required: true, half: true, step: '0.01', min: 0 },
    { name: 'discountAmount', label: 'Desconto (R$)', type: 'number', half: true, step: '0.01', min: 0 },
    { name: 'dueDay', label: 'Dia de vencimento', type: 'number', half: true, min: 1, max: 28, help: 'Entre 1 e 28' },
    { name: 'paymentMethod', label: 'Forma de pagamento', type: 'select', half: true, options: PAYMENT_METHODS.map(m => ({ value: m, label: m })) },
    { name: 'status', label: 'Status', type: 'select', half: true, options: ENROLL_STATUS.map(s => ({ value: s, label: enrollStatus[s].label })) },
    { name: 'notes', label: 'Observações', type: 'textarea' },
  ];

  const toInitial = (e: Enrollment): FormValues => ({
    studentId: e.studentId, classId: e.classId, startDate: e.startDate, endDate: e.endDate ?? '',
    monthlyAmount: String(e.monthlyAmount), discountAmount: String(e.discountAmount ?? 0),
    dueDay: String(e.dueDay), paymentMethod: e.paymentMethod, status: e.status, notes: e.notes ?? '',
  });

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (e: Enrollment) => { setEditing(e); setModalOpen(true); };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(matriculaUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };
  const waShare = `https://wa.me/?text=${encodeURIComponent(`Olá! Faça sua matrícula na Wind English pelo link: ${matriculaUrl}`)}`;

  const columns: Column<Enrollment>[] = [
    { key: 'student', header: 'Aluno', render: e => <Link href={`/wind-os/students/${e.studentId}`} className="font-medium text-gray-900 hover:text-[#E30613]">{studentName(e.studentId)}</Link> },
    { key: 'class', header: 'Turma', render: e => <span className="text-gray-600">{className(e.classId)}</span> },
    { key: 'start', header: 'Início', render: e => <span className="text-gray-500 text-xs">{dateBR(e.startDate)}</span> },
    { key: 'amount', header: 'Mensalidade', render: e => (<div><span className="font-medium text-gray-900">{brl(e.monthlyAmount - e.discountAmount)}</span>{e.discountAmount > 0 && <p className="text-xs text-green-600">desc. {brl(e.discountAmount)}</p>}</div>) },
    { key: 'due', header: 'Vencimento', render: e => <span className="text-gray-600">Dia {e.dueDay}</span> },
    { key: 'method', header: 'Forma', render: e => <Badge label={e.paymentMethod} variant="gray" /> },
    { key: 'status', header: 'Status', render: e => { const b = enrollStatus[e.status]; return <Badge label={b.label} variant={b.variant} />; } },
    { key: 'actions', header: '', className: 'text-right', render: e => (
      <button onClick={() => openEdit(e)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs font-medium"><IconEdit size={14} /> Editar</button>
    ) },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Matrículas</h1><p className="text-sm text-gray-500">Vínculo entre aluno, turma e plano financeiro</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLinkModalOpen(true)} className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 font-medium"><IconWhatsapp size={16} /> Enviar link de cadastro</button>
          <button onClick={openNew} className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Nova matrícula</button>
        </div>
      </div>
      <DataTable columns={columns} rows={enrollments} rowKey={e => e.id} empty={<EmptyState title="Nenhuma matrícula" icon={<IconEnroll size={22} />} />} />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar matrícula' : 'Nova matrícula'}
        subtitle={editing ? studentName(editing.studentId) : 'Vincule um aluno a uma turma e plano financeiro'}
        fields={fields}
        initial={editing ? toInitial(editing) : undefined}
        submitLabel={editing ? 'Salvar alterações' : 'Criar matrícula'}
        onSubmit={async (values) => {
          const res = await saveEnrollment(values, editing?.id);
          if (res.ok) router.refresh();
          return res;
        }}
      />

      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8" onMouseDown={() => setLinkModalOpen(false)}>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl my-4" onMouseDown={ev => ev.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Link de auto-cadastro</h2>
              <p className="text-xs text-gray-500 mt-0.5">Envie este link para o aluno preencher os próprios dados de matrícula.</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <IconDoc size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 truncate flex-1">{matriculaUrl}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyLink} className="flex-1 text-sm bg-gray-900 hover:bg-black text-white rounded-lg px-4 py-2 font-medium">{copied ? 'Copiado!' : 'Copiar link'}</button>
                <a href={waShare} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-[#25D366] hover:brightness-95 text-white rounded-lg px-4 py-2 font-medium"><IconWhatsapp size={16} /> WhatsApp</a>
              </div>
            </div>
            <div className="flex items-center justify-end px-5 py-4 border-t border-gray-100">
              <button onClick={() => setLinkModalOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
