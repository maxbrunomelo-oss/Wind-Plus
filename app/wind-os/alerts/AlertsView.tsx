'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AlertCard from '@/components/windos/AlertCard';
import StatCard from '@/components/windos/StatCard';
import { IconAlert, IconPlus } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { FormModal, FieldDef } from '@/components/windos/Modal';
import { saveAlert, setAlertStatus } from '@/app/wind-os/actions';
import type { Alert } from '@/lib/windos/types';

const order: Record<string, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAIXA: 3 };

const ALERT_TYPES = [
  { value: 'PAGAMENTO_ATRASADO', label: 'Pagamento atrasado' },
  { value: 'RISCO_CANCELAMENTO', label: 'Risco de cancelamento' },
  { value: 'SEM_REGISTRO_PEDAGOGICO', label: 'Sem registro pedagógico' },
  { value: 'RENOVACAO_PROXIMA', label: 'Renovação próxima' },
  { value: 'FAMILIA_SEM_RETORNO', label: 'Família sem retorno' },
  { value: 'OUTRO', label: 'Outro' },
];

interface Props {
  alerts: Alert[];
  students: { id: string; name: string }[];
  studentNameById: Record<string, string>;
}

export default function AlertsView({ alerts, students, studentNameById }: Props) {
  const router = useRouter();
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('ABERTO');
  const [modalOpen, setModalOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => alerts
    .filter(a => (!priority || a.priority === priority) && (!status || a.status === status))
    .sort((a, b) => order[a.priority] - order[b.priority]), [alerts, priority, status]);

  const count = (p: string) => alerts.filter(a => a.priority === p && a.status !== 'RESOLVIDO').length;
  const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30';

  const fields: FieldDef[] = [
    { name: 'studentId', label: 'Aluno', type: 'select', required: true, options: students.map(s => ({ value: s.id, label: s.name })) },
    { name: 'alertType', label: 'Tipo', type: 'select', half: true, options: ALERT_TYPES },
    { name: 'priority', label: 'Prioridade', type: 'select', half: true, options: ['CRITICA', 'ALTA', 'MEDIA', 'BAIXA'].map(p => ({ value: p, label: p })) },
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea' },
    { name: 'dueDate', label: 'Prazo', type: 'date', half: true },
  ];

  const changeStatus = async (id: string, st: string) => {
    setBusyId(id);
    const res = await setAlertStatus(id, st);
    setBusyId(null);
    if (res.ok) router.refresh();
    else alert(res.error ?? 'Erro ao atualizar.');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Alertas Inteligentes</h1><p className="text-sm text-gray-500">Monitoramento de risco e ações prioritárias</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo alerta</button>
      </div>

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
        <div className="space-y-3">{filtered.map(a => (
          <div key={a.id} className="space-y-2">
            <AlertCard alert={a} studentName={studentNameById[a.studentId]} />
            {a.status !== 'RESOLVIDO' && a.status !== 'IGNORADO' && (
              <div className="flex items-center gap-2 pl-4">
                <button onClick={() => changeStatus(a.id, 'EM_ANDAMENTO')} disabled={busyId === a.id} className="text-xs font-medium text-sky-600 border border-sky-200 bg-sky-50 rounded-lg px-2.5 py-1 hover:bg-sky-100 disabled:opacity-50">Em andamento</button>
                <button onClick={() => changeStatus(a.id, 'RESOLVIDO')} disabled={busyId === a.id} className="text-xs font-medium text-green-600 border border-green-200 bg-green-50 rounded-lg px-2.5 py-1 hover:bg-green-100 disabled:opacity-50">Resolver</button>
                <button onClick={() => changeStatus(a.id, 'IGNORADO')} disabled={busyId === a.id} className="text-xs font-medium text-gray-500 border border-gray-200 bg-gray-50 rounded-lg px-2.5 py-1 hover:bg-gray-100 disabled:opacity-50">Ignorar</button>
              </div>
            )}
          </div>
        ))}</div>
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo alerta"
        subtitle="Registre uma ação prioritária ou risco"
        fields={fields}
        submitLabel="Criar alerta"
        onSubmit={async (values) => {
          const res = await saveAlert(values);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
