import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { CefrLevel } from "@/lib/placement/cefrQuestions";
import { BandStats } from "@/lib/placement/scoring";

async function getAuthenticatedAdminEmail(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) return null;
    const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
    return allowed.includes(user.email.toLowerCase()) ? user.email : null;
  } catch {
    return null;
  }
}

const levelOrder: CefrLevel[] = ["starter", "A1", "A2", "B1", "B2", "C1"];

export default async function PlacementResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: r, error } = await supabase
    .from("placement_test_results")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !r) notFound();

  const bands = r.cefr_band_breakdown as Record<CefrLevel, BandStats>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/placement-results" className="text-blue-600 hover:underline text-sm">
            ← Voltar
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Detalhe do Resultado</h1>
        </div>

        {/* Personal info */}
        <Section title="Dados pessoais">
          <Row label="Nome" value={r.student_name} />
          <Row label="E-mail" value={r.email} />
          <Row label="WhatsApp" value={r.phone} />
          <Row label="Idade" value={r.age ?? "—"} />
          <Row label="Objetivo" value={r.objective ?? "—"} />
          <Row label="Nível autodeclarado" value={r.self_declared_level ?? "—"} />
          <Row label="Data de envio" value={new Date(r.created_at).toLocaleString("pt-BR")} />
        </Section>

        {/* Result */}
        <Section title="Resultado CEFR">
          <Row label="Nível calculado" value={<span className="font-bold text-blue-700">{r.cefr_level}</span>} />
          <Row label="Pontuação" value={`${r.raw_score}/${r.max_score} (${r.percentage}%)`} />
          <Row label="Diagnóstico" value={r.diagnostic_summary} />
          <Row label="Curso recomendado" value={r.recommended_course ?? "—"} />
        </Section>

        {/* Band breakdown */}
        <Section title="Desempenho por banda CEFR">
          {levelOrder.map((lvl) => {
            const band = bands?.[lvl];
            if (!band) return null;
            return (
              <div key={lvl} className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium">{lvl === "starter" ? "Starter" : lvl}</span>
                  <span>{band.correct}/{band.total} ({band.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${band.percentage}%` }} />
                </div>
              </div>
            );
          })}
        </Section>

        {/* Writing */}
        <Section title="Resposta escrita">
          {r.writing_answer ? (
            <>
              <div className="inline-block mb-3 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                Writing pending human review
              </div>
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-200">
                {r.writing_answer}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Nenhuma resposta escrita enviada.</p>
          )}
        </Section>

        {/* Technical */}
        <Section title="Informações técnicas">
          <Row label="ID" value={<code className="text-xs bg-gray-100 px-2 py-1 rounded">{r.id}</code>} />
          <Row label="Origem" value={r.source ?? "website"} />
          <Row label="IP Hash" value={r.ip_hash ?? "—"} />
          <Row label="User Agent" value={<span className="text-xs text-gray-500 break-all">{r.user_agent ?? "—"}</span>} />
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-500 sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
