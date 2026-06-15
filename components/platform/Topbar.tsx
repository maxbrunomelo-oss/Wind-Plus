"use client";

interface Props {
  streakDays: number;
  xpTotal: number;
}

export default function Topbar({ streakDays, xpTotal }: Props) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-[#111111] shrink-0">
      <div /> {/* page title injected by each page via context if needed */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <span className="text-orange-400 text-sm">🔥</span>
          <span className="text-white text-sm font-medium">{streakDays} dias</span>
        </div>
        {/* XP */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <span className="text-yellow-400 text-sm">⚡</span>
          <span className="text-white text-sm font-medium">
            {xpTotal.toLocaleString("pt-BR")} XP
          </span>
        </div>
      </div>
    </header>
  );
}
