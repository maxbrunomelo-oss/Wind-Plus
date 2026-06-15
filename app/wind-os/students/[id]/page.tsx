'use client';
import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Badge, {
  studentStatusBadge, modalidadeBadge, cefrBadge, paymentStatusBadge, reportStatusBadge,
} from '@/components/windos/Badge';
import StatCard from '@/components/windos/StatCard';
import StudentTimeline from '@/components/windos/StudentTimeline';
import AlertCard from '@/components/windos/AlertCard';
import { HBarChart } from '@/components/windos/Charts';
import { EmptyState } from '@/components/windos/States';
import {
  IconArrowLeft, IconWhatsapp, IconMail, IconFinance, IconReport, IconDoc, IconEdit,
} from '@/components/windos/Icons';
import {
  getStudent, teacherName, className, studentGuardians, studentPayments,
  studentLogsFor, studentAlerts, studentReports, studentRevenue, studentOpenAmount,
} from '@/lib/windos/mock-data';
import { brl, dateBR, initials } from '@/lib/windos/format';

const tabs = ['Visão geral', 'Financeiro', 'Pedagógico', 'CRM / Histórico', 'Relatórios', 'Documentos'] as const;
type Tab = typeof tabs[number];

export default function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = getStudent(id);
  const [tab, setTab] = useState<Tab>('Visão geral');
  if (!student) return notFound();

  const guardians = studentGuardians(id);
  const payments = studentPayments(id);
  const logs = studentLogsFor(id);
  const alerts = studentAlerts(id);
  const reports = studentReports(id);
  const revenue = studentRevenue(id);
  const open = studentOpenAmount(id);

  const st = studentStatusBadge(student.status);
  const md = modalidadeBadge(student.modalidade);
  const cf = cefrBadge(student.cefrLevel);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <Link href="/wind-os/students" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E30613]"><IconArrowLeft size={16} /> Voltar para alunos</Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E30613] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">{initials(student.fullName)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{student.fullName}</h1>
              <Badge label={st.label} variant={st.variant} />
              <Badge label={md.label} variant={md.variant} />
              <Badge label={`CEFR ${cf.label}`} variant={cf.variant} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><IconMail size={14} /> {student.email}</span>
              <span className="flex items-center gap-1.5"><IconWhatsapp size={14} /> {student.whatsapp}</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 font-medium"><IconEdit size={15} /> Editar</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#E30613] text-[#E30613]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Visão geral ── */}
      {tab === 'Visão geral' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Receita gerada" value={brl(revenue)} color="green" icon={<IconFinance size={18} />} />
            <StatCard title="Em aberto" value={brl(open)} color="amber" icon={<IconFinance size={18} />} />
            <StatCard title="Registros" value={logs.length} color="dark" icon={<IconReport size={18} />} />
            <StatCard title="Alertas ativos" value={alerts.length} color="red" icon={<IconReport size={18} />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Dados principais</h3>
              <Field label="Turma" value={className(student.classId)} />
              <Field label="Professor" value={teacherName(student.teacherId)} />
              <Field label="Data de entrada" value={dateBR(student.startDate)} />
              <Field label="Nascimento" value={dateBR(student.birthDate)} />
              <Field label="CPF" value={student.cpf ?? '—'} />
              <Field label="Objetivo" value={student.goal ?? '—'} />
              <Field label="Interesses" value={student.interests ?? '—'} />
              <Field label="Obs. pedagógicas" value={student.pedagogicalNotes ?? '—'} />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Responsáveis</h3>
                {guardians.length === 0 ? <p className="text-sm text-gray-400">Nenhum responsável vinculado.</p> : (
                  <div className="space-y-2">
                    {guardians.map(g => (
                      <div key={g.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2">
                        <div><span className="font-medium text-gray-900">{g.name}</span><span className="text-gray-400"> · {g.relationship}</span></div>
                        <span className="text-gray-500 text-xs flex items-center gap-1"><IconWhatsapp size={13} /> {g.whatsapp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {alerts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Alertas ativos</h3>
                  <div className="space-y-2">{alerts.map(a => <AlertCard key={a.id} alert={a} showStudent={false} />)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Financeiro ── */}
      {tab === 'Financeiro' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {payments.length === 0 ? <EmptyState title="Sem mensalidades" icon={<IconFinance size={22} />} /> :
            payments.map(p => {
              const b = paymentStatusBadge(p.status);
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{p.description}</p>
                    <p className="text-xs text-gray-400">Vencimento {dateBR(p.dueDate)}{p.paymentDate && ` · Pago em ${dateBR(p.paymentDate)}`}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{brl(p.finalAmount)}</span>
                  <Badge label={b.label} variant={b.variant} />
                </div>
              );
            })}
        </div>
      )}

      {/* ── Pedagógico ── */}
      {tab === 'Pedagógico' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Progresso por habilidade (último relatório)</h3>
            {reports[0] ? (
              <HBarChart unit="%" max={100} data={[
                { label: 'Speaking', value: reports[0].speakingProgress, color: '#E30613' },
                { label: 'Listening', value: reports[0].listeningProgress, color: '#111111' },
                { label: 'Reading', value: reports[0].readingProgress, color: '#16a34a' },
                { label: 'Writing', value: reports[0].writingProgress, color: '#f59e0b' },
              ]} />
            ) : <p className="text-sm text-gray-400">Sem relatórios pedagógicos.</p>}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Notas pedagógicas</h3>
            <p className="text-sm text-gray-600">{student.pedagogicalNotes ?? 'Sem observações registradas.'}</p>
            {reports[0]?.strengths && <Field label="Pontos fortes" value={reports[0].strengths} />}
            {reports[0]?.improvementPoints && <Field label="A melhorar" value={reports[0].improvementPoints} />}
          </div>
        </div>
      )}

      {/* ── CRM / Histórico ── */}
      {tab === 'CRM / Histórico' && <StudentTimeline logs={logs} />}

      {/* ── Relatórios ── */}
      {tab === 'Relatórios' && (
        <div className="space-y-3">
          {reports.length === 0 ? <EmptyState title="Sem relatórios" description="Nenhum relatório pedagógico criado." icon={<IconReport size={22} />} /> :
            reports.map(r => {
              const b = reportStatusBadge(r.status);
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-gray-900">Relatório · {r.referencePeriod}</h4>
                    <Badge label={b.label} variant={b.variant} />
                    <span className="text-xs text-gray-400 ml-auto">Prof. {teacherName(r.teacherId)}</span>
                  </div>
                  {r.teacherComments && <p className="text-sm text-gray-600 mt-2">{r.teacherComments}</p>}
                  {r.recommendations && <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Recomendações:</span> {r.recommendations}</p>}
                </div>
              );
            })}
        </div>
      )}

      {/* ── Documentos ── */}
      {tab === 'Documentos' && (
        <EmptyState title="Sem documentos" description="Upload de documentos será habilitado com o Supabase Storage." icon={<IconDoc size={22} />} />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
