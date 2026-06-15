'use client';
import React from 'react';
import Link from 'next/link';
import { use } from 'react';
import Badge, { statusBadge } from '@/components/eleva/Badge';
import { BarChart, HBarChart } from '@/components/eleva/Charts';
import StatCard from '@/components/eleva/StatCard';
import { IconSchool, IconStudents, IconTeacher, IconClasses, IconChevron, IconEdit, IconEval } from '@/components/eleva/Icons';
import { schools, turmas, students } from '@/lib/eleva/mock-data';

export default function EscolaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const school = schools.find(s => s.id === id);

  if (!school) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Escola não encontrada.</p>
        <Link href="/eleva/escolas" className="text-[#2E8C99] text-sm mt-2 inline-block">← Voltar</Link>
      </div>
    );
  }

  const schoolTurmas = turmas.filter(t => t.schoolId === id);
  const schoolStudents = students.filter(s => s.schoolId === id);

  const turmaScores = schoolTurmas.map(t => ({ label: t.name, value: t.avgScore, color: '#2E8C99' }));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/eleva/escolas" className="hover:text-[#2E8C99] transition-colors">Escolas</Link>
        <IconChevron size={14} />
        <span className="text-gray-900 font-medium">{school.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2E8C99] flex items-center justify-center">
            <IconSchool size={28} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{school.name}</h1>
              <Badge label={statusBadge(school.status).label} variant={statusBadge(school.status).variant} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{school.code} · {school.address}</p>
            <p className="text-sm text-gray-500">Gestor: <span className="font-medium text-gray-700">{school.gestorName}</span></p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors">
          <IconEdit size={15} />
          Editar escola
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Turmas" value={school.classCount} icon={<IconClasses size={18} />} color="blue" />
        <StatCard title="Estudantes" value={school.studentCount} icon={<IconStudents size={18} />} color="orange" />
        <StatCard title="Professores" value={school.teacherCount} icon={<IconTeacher size={18} />} color="blue" />
        <StatCard title="Índice Eleva+" value={`${school.elevaIndex}%`} icon={<IconEval size={18} />} color={school.elevaIndex >= 80 ? 'green' : school.elevaIndex >= 60 ? 'blue' : 'orange'} accent />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {turmaScores.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Desempenho por Turma</h3>
            <BarChart data={turmaScores} height={160} maxValue={10} />
          </div>
        )}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Indicadores da Escola</h3>
          <HBarChart
            data={[
              { label: 'Participação', value: school.participationRate },
              { label: 'Índice Eleva+', value: school.elevaIndex },
              { label: 'Média (x10)', value: Math.round(school.avgScore * 10) },
            ]}
          />
        </div>
      </div>

      {/* Turmas table */}
      {schoolTurmas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Turmas vinculadas</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Turma</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Série</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Professor</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alunos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Média</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {schoolTurmas.map(t => {
                const sb = statusBadge(t.participationStatus);
                return (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.serie}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{t.teacherName}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{t.studentCount}</td>
                    <td className="px-4 py-3 text-center font-semibold text-[#2E8C99]">{t.avgScore.toFixed(1)}</td>
                    <td className="px-4 py-3 text-center"><Badge label={sb.label} variant={sb.variant} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
