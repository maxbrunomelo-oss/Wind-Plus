'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Badge, { sentimentBadge } from '@/components/windos/Badge';
import { IconPlus, IconLog } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { studentLogs, studentName, students } from '@/lib/windos/mock-data';
import { dateBR } from '@/lib/windos/format';

const logTypeLabel: Record<string, string> = {
  PEDAGOGICO: 'Pedagógico', FINANCEIRO: 'Financeiro', ATENDIMENTO: 'Atendimento',
  REUNIAO: 'Reunião', ALERTA: 'Alerta', OBSERVACAO: 'Observação',
  RENOVACAO: 'Renovação', CANCELAMENTO: 'Cancelamento',
};

export default function StudentLogsPage() {
  const [type, setType] = useState('');
  const [student, setStudent] = useState('');

  const filtered = useMemo(() => studentLogs
    .filter(l => (!type || l.logType === type) && (!student || l.studentId === student))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [type, student]);

  const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">CRM / Registros</h1><p className="text-sm text-gray-500">Linha do tempo de interações com os alunos</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo registro</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={student} onChange={e => setStudent(e.target.value)} className={selectCls}>
          <option value="">Todos os alunos</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className={selectCls}>
          <option value="">Todos os tipos</option>
          {Object.entries(logTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState title="Nenhum registro" icon={<IconLog size={22} />} /> : (
        <div className="space-y-3">
          {filtered.map(log => {
            const s = sentimentBadge(log.sentiment);
            return (
              <div key={log.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={logTypeLabel[log.logType]} variant="gray" />
                  <Badge label={s.label} variant={s.variant} />
                  <Link href={`/wind-os/students/${log.studentId}`} className="text-sm font-medium text-[#E30613] hover:underline">{studentName(log.studentId)}</Link>
                  <span className="text-xs text-gray-400 ml-auto">{dateBR(log.createdAt)}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mt-2">{log.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{log.content}</p>
                {log.nextAction && <div className="mt-2 text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-600"><span className="font-semibold">Próxima ação:</span> {log.nextAction}{log.nextActionDate && ` · ${dateBR(log.nextActionDate)}`}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
