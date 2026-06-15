'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/windos/types';
import { currentUser } from '@/lib/windos/mock-data';

const roles: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'FINANCEIRO', label: 'Financeiro' },
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'SECRETARIA', label: 'Secretaria' },
];

export default function WindOsLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('maxbrunomelo@hotmail.com');
  const [role, setRole] = useState<UserRole>('ADMIN');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('windos_user', JSON.stringify({ ...currentUser, email, role }));
    router.replace('/wind-os/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E30613] flex items-center justify-center text-white font-black text-2xl mb-3">W</div>
          <h1 className="text-xl font-bold text-white">Wind OS</h1>
          <p className="text-sm text-white/40">Student & Finance Intelligence Platform</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Perfil de acesso</label>
            <select value={role} onChange={e => setRole(e.target.value as UserRole)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/40">
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold rounded-lg py-2.5 text-sm transition-colors">
            Entrar
          </button>
          <p className="text-[11px] text-gray-400 text-center">Demonstração — autenticação local. Integração Supabase preparada na migration.</p>
        </form>
      </div>
    </div>
  );
}
