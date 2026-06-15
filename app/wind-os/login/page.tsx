'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function WindOsLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !data.session) {
        setError(authError?.message ?? 'E-mail ou senha incorretos.');
        return;
      }
      window.location.href = '/wind-os/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E30613] flex items-center justify-center text-white font-black text-2xl mb-3">W</div>
          <h1 className="text-xl font-bold text-white">Wind OS</h1>
          <p className="text-sm text-white/40">Student &amp; Finance Intelligence Platform</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" placeholder="seu@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Senha</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40" />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-[#E30613] hover:bg-[#B8000D] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
