'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconDashboard, IconStudents, IconGuardian, IconTeacher, IconClasses,
  IconEnroll, IconFinance, IconReport, IconLog, IconAlert, IconAI,
  IconSettings, IconX,
} from './Icons';

interface NavItem { label: string; href: string; icon: React.ReactNode; }
interface NavGroup { title: string; items: NavItem[]; }

const groups: NavGroup[] = [
  {
    title: 'Visão geral',
    items: [{ label: 'Dashboard', href: '/wind-os/dashboard', icon: <IconDashboard size={18} /> }],
  },
  {
    title: 'Gestão acadêmica',
    items: [
      { label: 'Alunos', href: '/wind-os/students', icon: <IconStudents size={18} /> },
      { label: 'Responsáveis', href: '/wind-os/guardians', icon: <IconGuardian size={18} /> },
      { label: 'Professores', href: '/wind-os/teachers', icon: <IconTeacher size={18} /> },
      { label: 'Turmas', href: '/wind-os/classes', icon: <IconClasses size={18} /> },
      { label: 'Matrículas', href: '/wind-os/enrollments', icon: <IconEnroll size={18} /> },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { label: 'Mensalidades', href: '/wind-os/finance', icon: <IconFinance size={18} /> },
      { label: 'Relatórios financeiros', href: '/wind-os/finance/reports', icon: <IconReport size={18} /> },
    ],
  },
  {
    title: 'Pedagógico & CRM',
    items: [
      { label: 'CRM / Registros', href: '/wind-os/student-logs', icon: <IconLog size={18} /> },
      { label: 'Relatórios pedagógicos', href: '/wind-os/pedagogical-reports', icon: <IconReport size={18} /> },
      { label: 'Alertas', href: '/wind-os/alerts', icon: <IconAlert size={18} /> },
      { label: 'IA Wind Assistant', href: '/wind-os/ai-assistant', icon: <IconAI size={18} /> },
    ],
  },
  {
    title: 'Sistema',
    items: [{ label: 'Configurações', href: '/wind-os/settings', icon: <IconSettings size={18} /> }],
  },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-50 lg:static lg:z-auto w-64 bg-[#111111] text-white flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E30613] flex items-center justify-center text-white font-black text-sm">W</div>
            <div>
              <div className="font-bold text-base leading-none">Wind OS</div>
              <p className="text-[10px] text-white/40 mt-0.5">Student & Finance Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1"><IconX size={18} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {groups.map(group => (
            <div key={group.title}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = pathname === item.href || (item.href !== '/wind-os/finance' && pathname.startsWith(item.href + '/'));
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-[#E30613] text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
