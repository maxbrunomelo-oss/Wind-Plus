'use client';
import React from 'react';
import Badge from '@/components/windos/Badge';
import { IconSettings, IconStudents, IconFinance } from '@/components/windos/Icons';

const roles = [
  { role: 'ADMIN', label: 'Administrador', desc: 'Acesso total ao sistema.', perms: ['Tudo'] },
  { role: 'FINANCEIRO', label: 'Financeiro', desc: 'Dados financeiros, pagamentos, relatórios e inadimplência.', perms: ['Financeiro', 'Relatórios'] },
  { role: 'PROFESSOR', label: 'Professor', desc: 'Seus alunos, turmas, registros e relatórios pedagógicos.', perms: ['Pedagógico', 'Alunos (próprios)'] },
  { role: 'SECRETARIA', label: 'Secretaria', desc: 'Alunos, responsáveis, turmas e matrículas.', perms: ['Alunos', 'Matrículas', 'Turmas'] },
];

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center"><IconSettings size={20} /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Configurações</h1><p className="text-sm text-gray-500">Perfis de acesso, dados da escola e integrações</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Perfis de acesso (RBAC)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roles.map(r => (
            <div key={r.role} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{r.label}</span>
                <Badge label={r.role} variant="gray" />
              </div>
              <p className="text-sm text-gray-500">{r.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">{r.perms.map(p => <Badge key={p} label={p} variant="red" />)}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Arquitetura preparada para Row Level Security no Supabase. As permissões completas serão aplicadas via políticas RLS por <code className="bg-gray-100 px-1 rounded">profiles.role</code>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><IconStudents size={16} /> Dados da escola</h3>
          <Row label="Nome" value="Wind — Escola de Inglês" />
          <Row label="Modalidades" value="Online · Presencial" />
          <Row label="Níveis CEFR" value="A1 a C2" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><IconFinance size={16} /> Integrações</h3>
          <Row label="Banco de dados" value="Supabase (migration pronta)" />
          <Row label="Storage" value="Comprovantes — a habilitar" />
          <Row label="IA Assistant" value="Mockado — pronto p/ API" />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
