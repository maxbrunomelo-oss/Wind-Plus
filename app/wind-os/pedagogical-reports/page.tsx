'use client';
import React from 'react';
import Link from 'next/link';
import Badge, { reportStatusBadge, cefrBadge } from '@/components/windos/Badge';
import { HBarChart } from '@/components/windos/Charts';
import { IconPlus, IconReport, IconAI, IconDownload } from '@/components/windos/Icons';
import { EmptyState } from '@/components/windos/States';
import { pedagogicalReports, studentName, teacherName } from '@/lib/windos/mock-data';

export default function PedagogicalReportsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-gray-900">Relatórios Pedagógicos</h1><p className="text-sm text-gray-500">Acompanhamento de progresso por habilidade CEFR</p></div>
        <button className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo relatório</button>
      </div>

      {pedagogicalReports.length === 0 ? <EmptyState title="Nenhum relatório" icon={<IconReport size={22} />} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pedagogicalReports.map(r => {
            const b = reportStatusBadge(r.status);
            const cf = cefrBadge(r.cefrLevel);
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/wind-os/students/${r.studentId}`} className="text-sm font-semibold text-gray-900 hover:text-[#E30613]">{studentName(r.studentId)}</Link>
                  <Badge label={cf.label} variant={cf.variant} />
                  <Badge label={b.label} variant={b.variant} />
                  <span className="text-xs text-gray-400 ml-auto">{r.referencePeriod}</span>
                </div>
                <div className="mt-4">
                  <HBarChart unit="%" max={100} data={[
                    { label: 'Speaking', value: r.speakingProgress, color: '#E30613' },
                    { label: 'Listening', value: r.listeningProgress, color: '#111111' },
                    { label: 'Reading', value: r.readingProgress, color: '#16a34a' },
                    { label: 'Writing', value: r.writingProgress, color: '#f59e0b' },
                  ]} />
                </div>
                {r.teacherComments && <p className="text-sm text-gray-600 mt-3">{r.teacherComments}</p>}
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <span>Prof. {teacherName(r.teacherId)}</span>
                  <div className="ml-auto flex gap-2">
                    <button className="flex items-center gap-1 text-[#E30613] border border-red-200 bg-red-50 rounded-lg px-2.5 py-1 font-medium hover:bg-red-100"><IconAI size={13} /> Gerar com IA</button>
                    <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50"><IconDownload size={13} /> PDF</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
