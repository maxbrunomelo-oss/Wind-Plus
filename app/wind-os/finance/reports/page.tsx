import React from 'react';
import StatCard from '@/components/windos/StatCard';
import { GroupedBarChart, DonutChart, LineChart } from '@/components/windos/Charts';
import { IconFinance, IconTrend } from '@/components/windos/Icons';
import {
  getStudents, getPayments, getAlerts,
  computeDashboardStats, revenueEvolution, inadimplenciaEvolution,
} from '@/lib/windos/data';
import { brl } from '@/lib/windos/format';
import ReportsExportButton from './ReportsExportButton';

export const dynamic = 'force-dynamic';

export default async function FinanceReportsPage() {
  const [students, payments, alerts] = await Promise.all([
    getStudents(), getPayments(), getAlerts(),
  ]);
  const s = computeDashboardStats(students, payments, alerts);
  const byStatus = (st: string) =>
    payments.filter(p => p.status === st).reduce((a, p) => a + p.finalAmount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatórios Financeiros</h1>
          <p className="text-sm text-gray-500">Visão consolidada de receita e inadimplência</p>
        </div>
        <ReportsExportButton payments={payments} students={students} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Receita prevista"  value={brl(s.previsto)}          color="dark"  icon={<IconTrend size={18} />} />
        <StatCard title="Receita recebida"  value={brl(s.recebido)}          color="green" icon={<IconFinance size={18} />} />
        <StatCard title="Em aberto"         value={brl(s.pendente + s.atrasado)} color="amber" icon={<IconFinance size={18} />} />
        <StatCard title="Inadimplência"     value={`${s.inadimplencia}%`}    color="red"   icon={<IconTrend size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Evolução de receita (R$)</h3>
          <GroupedBarChart data={revenueEvolution.map(r => ({ label: r.label, a: r.previsto, b: r.recebido }))} unit="R$ " />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Composição da receita (mês)</h3>
          <DonutChart
            centerLabel="previsto"
            centerValue={brl(s.previsto)}
            data={[
              { label: 'Recebido', value: byStatus('PAGO'),     color: '#16a34a' },
              { label: 'Pendente', value: byStatus('PENDENTE'), color: '#f59e0b' },
              { label: 'Atrasado', value: byStatus('ATRASADO'), color: '#E30613' },
            ]}
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inadimplência por mês (%)</h3>
          <LineChart data={inadimplenciaEvolution} unit="%" color="#E30613" />
        </div>
      </div>
    </div>
  );
}
