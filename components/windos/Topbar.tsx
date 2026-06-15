'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IconMenu, IconLogout, IconSearch } from './Icons';
import { initials } from '@/lib/windos/format';
import type { Profile } from '@/lib/windos/types';

const roleLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  FINANCEIRO: 'Financeiro',
  PROFESSOR: 'Professor',
  SECRETARIA: 'Secretaria',
};

export default function Topbar({ user, onMenuClick }: { user: Profile; onMenuClick: () => void }) {
  const router = useRouter();
  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('windos_user');
    router.replace('/wind-os/login');
  };
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 p-1"><IconMenu size={20} /></button>
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-72">
          <IconSearch size={16} className="text-gray-400" />
          <input placeholder="Buscar aluno, turma, professor..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{roleLabel[user.role]}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#E30613] text-white flex items-center justify-center text-sm font-bold">{initials(user.name)}</div>
        <button onClick={logout} title="Sair" className="text-gray-400 hover:text-[#E30613] p-1.5 rounded-lg hover:bg-gray-50"><IconLogout size={18} /></button>
      </div>
    </header>
  );
}
