/**
 * GET /api/keep-alive
 *
 * Rota chamada pelo Vercel Cron Job diariamente para manter o projeto
 * Supabase ativo no Free Tier (evita auto-pausa por inatividade).
 *
 * Protegida pelo header Authorization: Bearer <CRON_SECRET>
 * que o Vercel injeta automaticamente nas chamadas de cron.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Vercel injeta este header em chamadas de cron com CRON_SECRET configurado
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('wind_students')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    const payload = {
      ok: true,
      timestamp: new Date().toISOString(),
      message: `Supabase ativo — ${count ?? 0} aluno(s) cadastrado(s)`,
    };

    console.log('[keep-alive]', payload.message);
    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[keep-alive] erro:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
