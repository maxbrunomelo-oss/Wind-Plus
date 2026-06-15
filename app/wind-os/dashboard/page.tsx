import React from 'react';
import Link from 'next/link';
import StatCard from '@/components/windos/StatCard';
import { GroupedBarChart, DonutChart, LineChart, HBarChart } from '@/components/windos/Charts';
import AlertCard from '@/components/windos/AlertCard';
import Badge, { paymentStatusBadge } from '@/components/windos/Badge';
import {
  IconStudents, IconFinance, IconAlert, IconTrend, IconClock,
} from '@/components/windos/Icons';
import {
  getStudents, getPayments, getAlerts, computeDashboardStats, nameMap,
  revenueEvolution, inadimplenciaEvolution,
} from '@/lib/windos/data';
import { brl, dateBR } from '@/lib/windos/format';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [students, payments, alerts] = await Promise.all([
    getStudents(), getPayments(), getAlerts(),
  ]);
  const s = computeDashboardStats(students, payments, alerts);
  const studentNameById = nameMap(students, t => t.fullName);
  const studentName = (id: string) => studentNameById[id] ?? '—';

  const prio: Record<string, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAIXA: 3 };
  const openAlerts = alerts.filter(a => a.status !== 'RESOLVIDO' && a.status !== 'IGNORADO')
    .sort((a, b) => prio[a.priority] - prio[b.priority]);
  const vencimentos = payments
    .filter(p => p.status === 'PENDENTE' || p.status === 'ATRASADO')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const statusCount = (st: string) => payments.filter(p => p.status === st).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Geral</h1>
          <p className="text-sm text-gray-500">Wind — Escola de Inglês · Junho/2026</p>
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Alunos ativos" value={s.totalAtivos} icon={<IconStudents size={18} />} color="red" subtitle={`${s.online} online · ${s.presencial} presencial`} />
        <StatCard title="Receita prevista (mês)" value={brl(s.previsto)} icon={<IconTrend size={18} />} color="dark" />
        <StatCard title="Receita recebida" value={brl(s.recebido)} icon={<IconFinance size={18} />} color="green" />
        <StatCard title="Receita pendente" value={brl(s.pendente)} icon={<IconClock size={18} />} color="amber" />
        <StatCard title="Total em atraso" value={brl(s.atrasado)} icon={<IconAlert size={18} />} color="red" />
        <StatCard title="Inadimplência" value={`${s.inadimplencia}%`} icon={<IconTrend size={18} />} color="dark" />
        <StatCard title="Novos alunos (mês)" value={s.novos} icon={<IconStudents size={18} />} color="green" />
        <StatCard title="Alunos em risco" value={s.emRisco} icon={<IconAlert size={18} />} color="red" subtitle={`${s.cancelamentos} cancelamento(s) no mês`} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Receita prevista x recebida (R$)</h3>
          <GroupedBarChart data={revenueEvolution.map(r => ({ label: r.label, a: r.previsto, b: r.recebido }))} unit="R$ " />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Alunos por modalidade</h3>
          <DonutChart
            centerLabel="ativos" centerValue={s.totalAtivos}
            data={[
              { label: 'Online', value: s.online, color: '#E30613' },
              { label: 'Presencial', value: s.presencial, color: '#111111' },
            ]}
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pagamentos por status</h3>
          <HBarChart data={[
            { label: 'Pago', value: statusCount('PAGO'), color: '#16a34a' },
            { label: 'Pendente', value: statusCount('PENDENTE'), color: '#f59e0b' },
            { label: 'Atrasado', value: statusCount('ATRASADO'), color: '#E30613' },
            { label: 'Cancelado', value: statusCount('CANCELADO'), color: '#9ca3af' },
          ]} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inadimplência por mês (%)</h3>
          <LineChart data={inadimplenciaEvolution} unit="%" />
        </div>
      </div>

      {/* Alertas + Próximos vencimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Alertas inteligentes</h3>
            <Link href="/wind-os/alerts" className="text-xs text-[#E30613] hover:underline font-medium">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {openAlerts.slice(0, 4).map(a => <AlertCard key={a.id} alert={a} studentName={studentNameById[a.studentId]} />)}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Próximos vencimentos</h3>
            <Link href="/wind-os/finance" className="text-xs text-[#E30613] hover:underline font-medium">Financeiro</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {vencimentos.map(p => {
              const b = paymentStatusBadge(p.status);
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <Link href={`/wind-os/students/${p.studentId}`} className="text-sm font-medium text-gray-900 hover:text-[#E30613] truncate block">{studentName(p.studentId)}</Link>
                    <p className="text-xs text-gray-400">Vence {dateBR(p.dueDate)} · {p.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{brl(p.finalAmount)}</span>
                  <Badge label={b.label} variant={b.variant} />
                </div>
              );
            })}
            {vencimentos.length === 0 && <div className="py-8 text-center text-sm text-gray-400">Sem vencimentos pendentes.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
