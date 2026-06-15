'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/windos/Sidebar';
import Topbar from '@/components/windos/Topbar';
import { createClient } from '@/utils/supabase/client';
import type { Profile, UserRole } from '@/lib/windos/types';

export default function WindOsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/wind-os/login') { setChecked(true); return; }

    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace('/wind-os/login');
        return;
      }

      const { data: profile } = await supabase
        .from('wind_profiles')
        .select('id, name, email, role, status, avatar_url')
        .eq('id', authUser.id)
        .single();

      if (!active) return;

      setUser({
        id: authUser.id,
        name: profile?.name ?? authUser.email?.split('@')[0] ?? 'Usuário',
        email: profile?.email ?? authUser.email ?? '',
        role: (profile?.role as UserRole) ?? 'ADMIN',
        status: profile?.status ?? 'ATIVO',
        avatar: profile?.avatar_url ?? undefined,
      });
      setChecked(true);
    })();

    return () => { active = false; };
  }, [pathname, router]);

  if (pathname === '/wind-os/login') return <>{children}</>;

  if (!checked || !user) {
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
