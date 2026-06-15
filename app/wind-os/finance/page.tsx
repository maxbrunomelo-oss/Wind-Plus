'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import StatCard from '@/components/windos/StatCard';
import Badge, { paymentStatusBadge } from '@/components/windos/Badge';
import { IconFinance, IconPlus, IconClock, IconAlert, IconTrend } from '@/components/windos/Icons';
import { payments, studentName, getStudent } from '@/lib/windos/mock-data';
import { brl, dateBR } from '@/lib/windos/format';
import type { Payment } from '@/lib/windos/types';

const dueGroups = [
  { key: '05', label: 'Entradas do dia 05', test: (d: number) => d === 5 },
  { key: '15', label: 'Entradas do dia 15', test: (d: number) => d === 15 },
  { key: '25', label: 'Entradas do dia 25', test: (d: number) => d === 25 },
  { key: 'other', label: 'Outros vencimentos', test: (d: number) => ![5, 15, 25].includes(d) },
];

export default function FinancePage() {
  const [status, setStatus] = useState('');
  const [mod, setMod] = useState('');

  const filtered = useMemo(() => payments.filter(p => {
    const stu = getStudent(p.studentId);
    return (!status || p.status === status) && (!mod || stu?.modalidade === mod);
  }), [status, mod]);

  const sum = (st: string) => filtered.filter(p => p.status === st).reduce((a, p) => a + p.finalAmount, 0);
  const previsto = filtered.filter(p => p.status !== 'CANCELADO').reduce((a, p) => a + p.finalAmount, 0);

  const dueDay = (p: Payment) => Number(p.dueDate.slice(8, 10));
  const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Mensalidades</h1><p className="text-sm text-gray-500">Junho/2026 · {filtered.length} lançamentos</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Gerar mensalidade</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total previsto" value={brl(previsto)} color="dark" icon={<IconTrend size={18} />} />
        <StatCard title="Total recebido" value={brl(sum('PAGO'))} color="green" icon={<IconFinance size={18} />} />
        <StatCard title="Total pendente" value={brl(sum('PENDENTE'))} color="amber" icon={<IconClock size={18} />} />
        <StatCard title="Total atrasado" value={brl(sum('ATRASADO'))} color="red" icon={<IconAlert size={18} />} />
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
          <option value="">Todos status</option>
          {['PAGO', 'PENDENTE', 'ATRASADO', 'CANCELADO'].map(st => <option key={st} value={st}>{paymentStatusBadge(st).label}</option>)}
        </select>
        <select value={mod} onChange={e => setMod(e.target.value)} className={selectCls}>
          <option value="">Todas modalidades</option>
          <option value="ONLINE">Online</option>
          <option value="PRESENCIAL">Presencial</option>
        </select>
      </div>

      <div className="space-y-5">
        {dueGroups.map(group => {
          const rows = filtered.filter(p => group.test(dueDay(p)));
          if (rows.length === 0) return null;
          const groupTotal = rows.reduce((a, p) => a + p.finalAmount, 0);
          return (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">{group.label}</h3>
                <span className="text-xs text-gray-400">{rows.length} · {brl(groupTotal)}</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {rows.map(p => {
                  const b = paymentStatusBadge(p.status);
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <Link href={`/wind-os/students/${p.studentId}`} className="text-sm font-medium text-gray-900 hover:text-[#E30613]">{studentName(p.studentId)}</Link>
                        <p className="text-xs text-gray-400">Vence {dateBR(p.dueDate)} · {p.description}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{brl(p.finalAmount)}</span>
                      <Badge label={b.label} variant={b.variant} />
                      {p.status !== 'PAGO' && p.status !== 'CANCELADO' && (
                        <button className="text-xs font-medium text-green-600 border border-green-200 bg-green-50 rounded-lg px-2.5 py-1 hover:bg-green-100">Marcar pago</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
