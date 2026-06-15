import React from 'react';
import Link from 'next/link';
import type { Alert } from '@/lib/windos/types';
import Badge, { priorityBadge, alertStatusBadge } from './Badge';
import { studentName } from '@/lib/windos/mock-data';
import { dateBR } from '@/lib/windos/format';
import { IconAlert } from './Icons';

const alertTypeLabel: Record<string, string> = {
  PAGAMENTO_ATRASADO: 'Pagamento atrasado',
  RISCO_CANCELAMENTO: 'Risco de cancelamento',
  SEM_REGISTRO_PEDAGOGICO: 'Sem registro pedagógico',
  RENOVACAO_PROXIMA: 'Renovação próxima',
  FAMILIA_SEM_RETORNO: 'Família sem retorno',
  OUTRO: 'Outro',
};

const borderByPriority: Record<string, string> = {
  CRITICA: 'border-l-red-600',
  ALTA: 'border-l-orange-500',
  MEDIA: 'border-l-sky-500',
  BAIXA: 'border-l-gray-300',
};

export default function AlertCard({ alert, showStudent = true }: { alert: Alert; showStudent?: boolean }) {
  const p = priorityBadge(alert.priority);
  const s = alertStatusBadge(alert.status);
  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${borderByPriority[alert.priority]} p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="text-red-500 mt-0.5"><IconAlert size={18} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
            <Badge label={p.label} variant={p.variant} />
            <Badge label={s.label} variant={s.variant} />
          </div>
          <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
            <span>{alertTypeLabel[alert.alertType]}</span>
            {showStudent && <Link href={`/wind-os/students/${alert.studentId}`} className="text-[#E30613] hover:underline font-medium">{studentName(alert.studentId)}</Link>}
            {alert.dueDate && <span>Prazo: {dateBR(alert.dueDate)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
