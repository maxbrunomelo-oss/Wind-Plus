"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    group: "APRENDIZADO",
    items: [
      { href: "/aluno/dashboard",     label: "Dashboard",    icon: <IconHome /> },
      { href: "/aluno/trilha",        label: "Minha trilha", icon: <IconTrail /> },
      { href: "/aluno/exercicios",    label: "Exercícios",   icon: <IconPencil /> },
    ],
  },
  {
    group: "PROGRESSO",
    items: [
      { href: "/aluno/ranking",       label: "Ranking",      icon: <IconTrophy /> },
      { href: "/aluno/relatorio",     label: "Relatório",    icon: <IconChart /> },
      { href: "/aluno/configuracoes", label: "Configurações",icon: <IconGear /> },
    ],
  },
];

interface Props {
  studentName: string;
  cefrLevel: string;
  course: string;
}

export default function Sidebar({ studentName, cefrLevel, course }: Props) {
  const pathname = usePathname();
  const initials = studentName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="w-[220px] min-h-screen bg-[#111111] flex flex-col border-r border-white/10 shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-baseline gap-0.5">
          <span className="text-white font-semibold text-lg leading-none">Wind</span>
          <span className="text-[#E31E24] font-semibold text-lg leading-none">+</span>
        </div>
        <p className="text-white/40 text-[10px] font-medium tracking-widest mt-0.5">
          ENGLISH PLATFORM
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="text-white/30 text-[10px] font-medium tracking-widest px-2 mb-1">
              {section.group}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-white/10 text-white border-l-2 border-[#E31E24]"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="w-4 h-4 shrink-0">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E31E24] flex items-center justify-center text-white text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{studentName}</p>
            <p className="text-white/40 text-xs truncate">
              {cefrLevel} · {course}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 6.5L8 2l6 4.5V14a.5.5 0 01-.5.5h-4V10H6.5v4.5h-4A.5.5 0 012 14V6.5z" />
    </svg>
  );
}

function IconTrail() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="3" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="8" cy="13" r="1.5" />
      <path d="M8 4.5v2M8 9.5v2" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 2l3 3-8 8H3v-3l8-8z" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 2h6v5a3 3 0 01-6 0V2zM2 3h3M11 3h3M8 10v3M5.5 13h5" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="9" width="3" height="5" rx="0.5" />
      <rect x="6.5" y="5" width="3" height="9" rx="0.5" />
      <rect x="11" y="2" width="3" height="12" rx="0.5" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </svg>
  );
}
