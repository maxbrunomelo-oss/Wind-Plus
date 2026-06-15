'use client';
import React, { useState, useMemo } from 'react';
import AlertCard from '@/components/windos/AlertCard';
import StatCard from '@/components/windos/StatCard';
import { IconAlert } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import type { Alert } from '@/lib/windos/types';

const order: Record<string, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAIXA: 3 };

interface Props {
  alerts: Alert[];
  studentNameById: Record<string, string>;
}

export default function AlertsView({ alerts, studentNameById }: Props) {
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('ABERTO');

  const filtered = useMemo(() => alerts
    .filter(a => (!priority || a.priority === priority) && (!status || a.status === status))
    .sort((a, b) => order[a.priority] - order[b.priority]), [alerts, priority, status]);

  const count = (p: string) => alerts.filter(a => a.priority === p && a.status !== 'RESOLVIDO').length;
  const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div><h1 className="text-xl font-bold text-gray-900">Alertas Inteligentes</h1><p className="text-sm text-gray-500">Monitoramento de risco e ações prioritárias</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Críticos" value={count('CRITICA')} color="red" icon={<IconAlert size={18} />} />
        <StatCard title="Alta prioridade" color="amber" value={count('ALTA')} icon={<IconAlert size={18} />} />
        <StatCard title="Média" value={count('MEDIA')} color="blue" icon={<IconAlert size={18} />} />
        <StatCard title="Baixa" value={count('BAIXA')} color="gray" icon={<IconAlert size={18} />} />
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
          <option value="">Todos status</option>
          <option value="ABERTO">Aberto</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="RESOLVIDO">Resolvido</option>
          <option value="IGNORADO">Ignorado</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className={selectCls}>
          <option value="">Todas prioridades</option>
          {['CRITICA', 'ALTA', 'MEDIA', 'BAIXA'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState title="Nenhum alerta" description="Não há alertas com os filtros selecionados." icon={<IconAlert size={22} />} /> : (
        <div className="space-y-3">{filtered.map(a => <AlertCard key={a.id} alert={a} studentName={studentNameById[a.studentId]} />)}</div>
      )}
    </div>
  );
}
