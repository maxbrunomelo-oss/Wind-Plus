import React from 'react';
import type { StudentLog } from '@/lib/windos/types';
import Badge, { sentimentBadge } from './Badge';
import { dateBR } from '@/lib/windos/format';
import { EmptyState } from './States';
import { IconLog } from './Icons';

const logTypeLabel: Record<string, string> = {
  PEDAGOGICO: 'Pedagógico',
  FINANCEIRO: 'Financeiro',
  ATENDIMENTO: 'Atendimento',
  REUNIAO: 'Reunião',
  ALERTA: 'Alerta',
  OBSERVACAO: 'Observação',
  RENOVACAO: 'Renovação',
  CANCELAMENTO: 'Cancelamento',
};

const dotColor: Record<string, string> = {
  PEDAGOGICO: 'bg-sky-500',
  FINANCEIRO: 'bg-amber-500',
  ATENDIMENTO: 'bg-violet-500',
  REUNIAO: 'bg-emerald-500',
  ALERTA: 'bg-red-600',
  OBSERVACAO: 'bg-gray-400',
  RENOVACAO: 'bg-green-600',
  CANCELAMENTO: 'bg-gray-700',
};

export default function StudentTimeline({ logs }: { logs: StudentLog[] }) {
  if (logs.length === 0) {
    return <EmptyState title="Nenhum registro" description="Ainda não há registros no histórico deste aluno." icon={<IconLog size={22} />} />;
  }
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-200" />
      <div className="space-y-5">
        {logs.map(log => {
          const s = sentimentBadge(log.sentiment);
          return (
            <div key={log.id} className="relative">
              <span className={`absolute -left-[18px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${dotColor[log.logType]}`} />
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={logTypeLabel[log.logType]} variant="gray" />
                  <Badge label={s.label} variant={s.variant} />
                  <span className="text-xs text-gray-400 ml-auto">{dateBR(log.createdAt)}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mt-2">{log.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{log.content}</p>
                {log.nextAction && (
                  <div className="mt-2 text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-600">
                    <span className="font-semibold text-gray-700">Próxima ação:</span> {log.nextAction}
                    {log.nextActionDate && <span className="text-gray-400"> · {dateBR(log.nextActionDate)}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
