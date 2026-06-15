'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/windos/Sidebar';
import Topbar from '@/components/windos/Topbar';
import { currentUser } from '@/lib/windos/mock-data';
import type { Profile } from '@/lib/windos/types';

export default function WindOsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<Profile>(currentUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/wind-os/login') { setChecked(true); return; }
    const stored = typeof window !== 'undefined' ? localStorage.getItem('windos_user') : null;
    if (!stored) {
      router.replace('/wind-os/login');
    } else {
      try { setUser({ ...currentUser, ...JSON.parse(stored) }); } catch { /* ignore */ }
      setChecked(true);
    }
  }, [pathname, router]);

  if (pathname === '/wind-os/login') return <>{children}</>;

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E30613] flex items-center justify-center text-white font-black text-xl">W</div>
          <p className="text-sm text-gray-400">Carregando Wind OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
