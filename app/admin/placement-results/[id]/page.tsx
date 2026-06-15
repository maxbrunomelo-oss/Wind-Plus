import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { CefrLevel, placementQuestions } from "@/lib/placement/cefrQuestions";
import { BandStats } from "@/lib/placement/scoring";

// ── Types ──────────────────────────────────────────────────────────────────

type BandBreakdown = Record<CefrLevel, BandStats>;

interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface SmartGoal {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const LEVEL_ORDER: CefrLevel[] = ["starter", "A1", "A2", "B1", "B2", "C1"];

const LEVEL_LABELS: Record<CefrLevel, string> = {
  starter: "Starter / Pre-A1",
  A1: "A1 — Elementary",
  A2: "A2 — Pre-Intermediate",
  B1: "B1 — Intermediate",
  B2: "B2 — Upper-Intermediate",
  C1: "C1 — Advanced",
};

const LEVEL_COLORS: Record<CefrLevel, string> = {
  starter: "bg-gray-100 text-gray-700 border-gray-300",
  A1:      "bg-green-50 text-green-700 border-green-300",
  A2:      "bg-teal-50 text-teal-700 border-teal-300",
  B1:      "bg-yellow-50 text-yellow-700 border-yellow-400",
  B2:      "bg-orange-50 text-orange-700 border-orange-400",
  C1:      "bg-red-50 text-red-700 border-red-400",
};

const BAND_BAR_COLORS: Record<CefrLevel, string> = {
  starter: "bg-gray-400",
  A1:      "bg-green-500",
  A2:      "bg-teal-500",
  B1:      "bg-yellow-500",
  B2:      "bg-orange-500",
  C1:      "bg-red-500",
};

// ── SWOT Generator ─────────────────────────────────────────────────────────

function generateSwot(
  bands: BandBreakdown,
  cefrLevel: CefrLevel,
  objective: string | null
): SwotAnalysis {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  const levelIdx = LEVEL_ORDER.indexOf(cefrLevel);

  // Strengths: levels with ≥70% accuracy
  for (const lvl of LEVEL_ORDER) {
    const b = bands[lvl];
    if (b.total > 0 && b.percentage >= 70) {
      strengths.push(
        `Bom desempenho no nível ${lvl === "starter" ? "Starter" : lvl} (${b.percentage}% de acertos — ${b.correct}/${b.total} questões)`
      );
    }
  }
  if (strengths.length === 0) {
    strengths.push("Determinação em buscar avaliação e melhoria do inglês.");
  }

  // Weaknesses: levels with <40% accuracy (only levels at or below assigned level)
  for (let i = 0; i <= Math.min(levelIdx + 1, LEVEL_ORDER.length - 1); i++) {
    const lvl = LEVEL_ORDER[i];
    const b = bands[lvl];
    if (b.total > 0 && b.percentage < 40) {
      weaknesses.push(
        `Dificuldade no nível ${lvl === "starter" ? "Starter" : lvl}: apenas ${b.percentage}% de acertos (${b.correct}/${b.total})`
      );
    }
  }

  // Analyze by skill across all questions
  const skillStats: Record<string, { correct: number; total: number }> = {};
  for (const q of placementQuestions) {
    if (!skillStats[q.skill]) skillStats[q.skill] = { correct: 0, total: 0 };
    skillStats[q.skill].total += 1;
  }
  // We don't have per-answer data here, but we flag the skills from weak bands
  const weakLevels = LEVEL_ORDER.filter((lvl) => bands[lvl].total > 0 && bands[lvl].percentage < 40);
  const weakSkills = new Set<string>();
  for (const q of placementQuestions) {
    if (weakLevels.includes(q.cefrLevel)) weakSkills.add(q.skill);
  }
  for (const skill of weakSkills) {
    const skillLabel: Record<string, string> = {
      grammar: "Gramática",
      vocabulary: "Vocabulário",
      reading: "Leitura/Compreensão",
      functional: "Inglês funcional/comunicativo",
      discourse: "Coesão e discurso",
    };
    weaknesses.push(`Necessita reforço em: ${skillLabel[skill] ?? skill}`);
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Nenhuma fraqueza crítica identificada. Manter ritmo de estudos.");
  }

  // Opportunities: next level threshold
  if (levelIdx < LEVEL_ORDER.length - 1) {
    const nextLevel = LEVEL_ORDER[levelIdx + 1];
    const currentBand = bands[cefrLevel];
    const nextBand = bands[nextLevel];
    opportunities.push(
      `Potencial para avançar ao nível ${nextLevel}: atualmente ${nextBand.percentage}% de acertos nessa banda. Meta: ≥55%.`
    );
    if (currentBand.percentage >= 60) {
      opportunities.push(
        `Desempenho sólido no nível atual (${cefrLevel}: ${currentBand.percentage}%) indica prontidão para desafios mais complexos.`
      );
    }
  }

  const obj = (objective ?? "").toLowerCase();
  if (obj.includes("business") || obj.includes("profissional")) {
    opportunities.push("Objetivo profissional alinhado: Wind Plus Business English Track disponível a partir do B1.");
  }
  if (obj.includes("exam") || obj.includes("certificaç") || obj.includes("internacional")) {
    opportunities.push("Objetivo de certificação: Wind Plus Exam Prep Track com foco em IELTS/TOEFL disponível.");
  }
  if (opportunities.length === 0) {
    opportunities.push("Consolidar o nível atual antes de avançar para o próximo estágio.");
  }

  // Threats: gaps between adjacent levels
  for (let i = 1; i <= levelIdx; i++) {
    const prev = LEVEL_ORDER[i - 1];
    const curr = LEVEL_ORDER[i];
    const gap = bands[curr].percentage - bands[prev].percentage;
    if (gap < -30 && bands[curr].total > 0 && bands[prev].total > 0) {
      threats.push(
        `Queda acentuada entre ${prev} (${bands[prev].percentage}%) e ${curr} (${bands[curr].percentage}%): possível lacuna de conteúdo.`
      );
    }
  }
  const topBand = bands[cefrLevel];
  if (topBand.percentage < 50 && topBand.total > 0) {
    threats.push(
      `Desempenho limítrofe no nível classificado (${cefrLevel}: ${topBand.percentage}%): risco de ser colocado em turma acima da capacidade atual.`
    );
  }
  if (threats.length === 0) {
    threats.push("Sem inconsistências críticas no perfil. Progressão uniforme identificada.");
  }

  return { strengths, weaknesses, opportunities, threats };
}

// ── SMART Goal Generator ───────────────────────────────────────────────────

function generateSmart(
  cefrLevel: CefrLevel,
  percentage: number,
  objective: string | null,
  bands: BandBreakdown
): SmartGoal {
  const levelIdx = LEVEL_ORDER.indexOf(cefrLevel);
  const nextLevel = levelIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[levelIdx + 1] : null;
  const obj = objective ?? "desenvolvimento pessoal";

  const weakSkills: string[] = [];
  for (const lvl of [cefrLevel, ...(levelIdx > 0 ? [LEVEL_ORDER[levelIdx - 1]] : [])]) {
    const b = bands[lvl];
    if (b.percentage < 60 && b.total > 0) {
      const qs = placementQuestions.filter((q) => q.cefrLevel === lvl);
      const skills = [...new Set(qs.map((q) => q.skill))];
      weakSkills.push(...skills);
    }
  }
  const skillMap: Record<string, string> = {
    grammar: "gramática", vocabulary: "vocabulário", reading: "leitura",
    functional: "comunicação funcional", discourse: "coesão textual",
  };
  const weakList = [...new Set(weakSkills)].map((s) => skillMap[s] ?? s).join(", ") || "gramática e vocabulário";

  const timelineMap: Record<CefrLevel, string> = {
    starter: "4 a 6 meses",
    A1: "4 a 6 meses",
    A2: "5 a 7 meses",
    B1: "6 a 9 meses",
    B2: "8 a 12 meses",
    C1: "12+ meses",
  };

  return {
    specific: `Desenvolver ${weakList} no nível ${cefrLevel}${nextLevel ? ` e iniciar exposição ao ${nextLevel}` : ""}, com foco em ${obj}.`,
    measurable: `Atingir ≥75% de acertos nas bandas ${cefrLevel}${nextLevel ? ` e ≥50% em ${nextLevel}` : ""} no próximo teste diagnóstico.`,
    achievable: `Partindo de ${percentage}% de aproveitamento geral, a meta é realista com aulas regulares de 2–3x por semana e prática diária de 20–30 min.`,
    relevant: `Alinhado ao objetivo declarado: "${objective ?? "Não informado"}". O avanço para ${nextLevel ?? "C1"} ampliará as oportunidades de ${obj}.`,
    timeBound: `Meta para ${timelineMap[cefrLevel] ?? "6 meses"} de estudo contínuo. Reaplicar teste diagnóstico ao final deste período.`,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}min ${s.toString().padStart(2, "0")}s`;
}

function getTimingLabel(seconds: number): { label: string; color: string } {
  if (seconds <= 15) return { label: "Rápido", color: "text-green-600" };
  if (seconds <= 40) return { label: "Normal", color: "text-blue-600" };
  if (seconds <= 90) return { label: "Lento", color: "text-yellow-600" };
  return { label: "Muito lento", color: "text-red-600" };
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function PlacementResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ── Auth: use proper SSR client (same as listing page) ──────────────────
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) redirect("/admin/login");
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  if (!allowed.includes(user.email?.toLowerCase() ?? "")) redirect("/admin/login");

  // ── Fetch result ─────────────────────────────────────────────────────────
  const adminSupabase = createAdminClient();
  const { data: r, error } = await adminSupabase
    .from("placement_test_results")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !r) notFound();

  const bands = (r.cefr_band_breakdown ?? {}) as BandBreakdown;
  const questionTimings = (r.question_timings ?? {}) as Record<string, number>;
  const cefrLevel = r.cefr_level as CefrLevel;

  const swot = generateSwot(bands, cefrLevel, r.objective);
  const smart = generateSmart(cefrLevel, r.percentage, r.objective, bands);

  // Per-question analysis
  const objectiveAnswers = (r.objective_answers ?? {}) as Record<string, string>;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#111111] border-b border-white/5 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/placement-results"
              className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Voltar
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-white font-semibold text-sm">Relatório Detalhado</span>
          </div>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Hero card ── */}
        <div className="bg-[#111111] rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{r.student_name}</h1>
              <p className="text-gray-400 text-sm mt-1">{r.email} · {r.phone}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(r.created_at).toLocaleString("pt-BR", {
                  dateStyle: "full", timeStyle: "short"
                })}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-xl font-bold text-lg border ${LEVEL_COLORS[cefrLevel] ?? "bg-gray-100"}`}>
                {cefrLevel === "starter" ? "Starter" : cefrLevel}
              </span>
              <p className="text-gray-400 text-sm mt-2">{r.raw_score}/{r.max_score} pts · {r.percentage}%</p>
              <p className="text-gray-500 text-xs mt-1">⏱ Duração total: {formatDuration(r.duration_seconds)}</p>
            </div>
          </div>
        </div>

        {/* ── Grid: Personal + Result ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="📋 Dados do Aluno">
            <Row label="Nome" value={r.student_name} />
            <Row label="E-mail" value={r.email} />
            <Row label="WhatsApp" value={r.phone} />
            <Row label="Idade" value={r.age ? `${r.age} anos` : "—"} />
            <Row label="Objetivo" value={r.objective ?? "—"} />
            <Row label="Nível autodeclarado" value={r.self_declared_level ?? "—"} />
          </Section>

          <Section title="🎯 Resultado CEFR">
            <Row label="Nível classificado"
              value={<span className="font-bold text-[#E30613]">{LEVEL_LABELS[cefrLevel] ?? cefrLevel}</span>} />
            <Row label="Pontuação" value={`${r.raw_score} / ${r.max_score} pontos`} />
            <Row label="Aproveitamento" value={`${r.percentage}%`} />
            <Row label="Curso recomendado" value={r.recommended_course ?? "—"} />
            <Row label="Diagnóstico" value={<span className="text-xs text-gray-600 leading-relaxed">{r.diagnostic_summary}</span>} />
          </Section>
        </div>

        {/* ── Timing summary ── */}
        <Section title="⏱ Tempo de Realização">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <StatCard label="Duração total" value={formatDuration(r.duration_seconds)} />
            <StatCard label="Média por questão"
              value={r.duration_seconds && Object.keys(questionTimings).length > 0
                ? formatDuration(Math.round(r.duration_seconds / 45))
                : "—"} />
            <StatCard label="Questões respondidas" value={`${Object.keys(objectiveAnswers).length}/45`} />
            <StatCard label="Questões cronometradas" value={`${Object.keys(questionTimings).length}/45`} />
          </div>
          {Object.keys(questionTimings).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tempo por questão</p>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {placementQuestions.map((q, idx) => {
                  const secs = questionTimings[q.id];
                  if (!secs) return null;
                  const { label, color } = getTimingLabel(secs);
                  const answered = objectiveAnswers[q.id];
                  const correct = answered === q.correctOptionId;
                  return (
                    <div key={q.id} className="flex items-center gap-3 text-xs py-1 border-b border-gray-100">
                      <span className="w-6 text-gray-400 shrink-0">Q{idx + 1}</span>
                      <span className="w-20 text-gray-500 shrink-0">{q.cefrLevel === "starter" ? "Starter" : q.cefrLevel}</span>
                      <span className="w-28 text-gray-500 shrink-0 capitalize">{q.skill}</span>
                      <span className="w-16 font-medium text-gray-700 shrink-0">{formatDuration(secs)}</span>
                      <span className={`w-20 shrink-0 ${color}`}>{label}</span>
                      {answered && (
                        <span className={`shrink-0 font-semibold ${correct ? "text-green-600" : "text-red-500"}`}>
                          {correct ? "✓ Acertou" : "✗ Errou"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Section>

        {/* ── Band breakdown ── */}
        <Section title="📊 Desempenho por Nível CEFR">
          <div className="space-y-4">
            {LEVEL_ORDER.map((lvl) => {
              const band = bands[lvl];
              if (!band || band.total === 0) return null;
              const pct = band.percentage;
              const barColor = BAND_BAR_COLORS[lvl];
              const status = pct >= 70 ? "✅ Sólido" : pct >= 50 ? "⚠️ Satisfatório" : "❌ Fraco";
              return (
                <div key={lvl}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {LEVEL_LABELS[lvl]}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{band.correct}/{band.total} questões</span>
                      <span className="text-xs font-semibold text-gray-700">{pct}%</span>
                      <span className="text-xs">{status}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${barColor} h-3 rounded-full transition-all`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── Per-question breakdown ── */}
        <Section title="🔍 Análise Questão a Questão">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">#</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Nível</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Habilidade</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Pontos</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Resposta aluno</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Gabarito</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Resultado</th>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {placementQuestions.map((q, idx) => {
                  const studentAns = objectiveAnswers[q.id];
                  const isCorrect = studentAns === q.correctOptionId;
                  const notAnswered = !studentAns;
                  const secs = questionTimings[q.id];
                  return (
                    <tr key={q.id} className={`hover:bg-gray-50 ${!notAnswered && !isCorrect ? "bg-red-50/40" : ""}`}>
                      <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${LEVEL_COLORS[q.cefrLevel]}`}>
                          {q.cefrLevel === "starter" ? "Starter" : q.cefrLevel}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-600 capitalize">{q.skill}</td>
                      <td className="py-2 px-3 text-gray-500">{q.points}pt{q.points > 1 ? "s" : ""}</td>
                      <td className="py-2 px-3 font-semibold text-gray-700">{studentAns?.toUpperCase() ?? "—"}</td>
                      <td className="py-2 px-3 font-semibold text-green-700">{q.correctOptionId.toUpperCase()}</td>
                      <td className="py-2 px-3">
                        {notAnswered
                          ? <span className="text-gray-400">Não resp.</span>
                          : isCorrect
                            ? <span className="text-green-600 font-semibold">✓ Correto</span>
                            : <span className="text-red-500 font-semibold">✗ Errado</span>
                        }
                      </td>
                      <td className="py-2 px-3 text-gray-500">{secs ? formatDuration(secs) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Writing ── */}
        <Section title="✍️ Produção Escrita">
          {r.writing_answer ? (
            <>
              <div className="inline-block mb-3 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                ⏳ Aguardando correção manual pelo professor
              </div>
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-200">
                {r.writing_answer}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Nenhuma resposta escrita enviada.</p>
          )}
        </Section>

        {/* ── SWOT ── */}
        <div>
          <h2 className="text-lg font-bold text-[#111111] mb-4">🔎 Análise SWOT do Aluno</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SwotCard title="💪 Forças (Strengths)" items={swot.strengths} color="border-green-400 bg-green-50" titleColor="text-green-800" />
            <SwotCard title="⚠️ Fraquezas (Weaknesses)" items={swot.weaknesses} color="border-red-300 bg-red-50" titleColor="text-red-800" />
            <SwotCard title="🚀 Oportunidades (Opportunities)" items={swot.opportunities} color="border-blue-300 bg-blue-50" titleColor="text-blue-800" />
            <SwotCard title="🛑 Ameaças (Threats)" items={swot.threats} color="border-orange-300 bg-orange-50" titleColor="text-orange-800" />
          </div>
        </div>

        {/* ── SMART ── */}
        <Section title="🎯 Plano SMART — Sugestão de Plano de Aula">
          <div className="space-y-4">
            <SmartRow letter="S" label="Específico" color="bg-blue-600" value={smart.specific} />
            <SmartRow letter="M" label="Mensurável" color="bg-purple-600" value={smart.measurable} />
            <SmartRow letter="A" label="Atingível" color="bg-green-600" value={smart.achievable} />
            <SmartRow letter="R" label="Relevante" color="bg-yellow-500" value={smart.relevant} />
            <SmartRow letter="T" label="Temporal" color="bg-red-600" value={smart.timeBound} />
          </div>
          <div className="mt-6 bg-[#111111] rounded-xl p-4 text-sm text-white">
            <p className="font-semibold mb-2">📚 Recomendação de início de plano de aula:</p>
            <p className="text-gray-300 leading-relaxed">
              Inicie com revisão das estruturas do nível {cefrLevel === "starter" ? "Starter" : cefrLevel} onde o aluno demonstrou menor desempenho.
              Priorize as habilidades:{" "}
              {[...new Set(
                placementQuestions
                  .filter((q) => q.cefrLevel === cefrLevel && objectiveAnswers[q.id] !== q.correctOptionId && objectiveAnswers[q.id])
                  .map((q) => q.skill)
              )].map((s) => (
                { grammar: "Gramática", vocabulary: "Vocabulário", reading: "Leitura", functional: "Inglês funcional", discourse: "Coesão textual" }[s] ?? s
              )).join(", ") || "Todas as habilidades do nível"}.
              {" "}Use atividades comunicativas alinhadas ao objetivo declarado:{" "}
              <em>{r.objective ?? "não informado"}</em>.
            </p>
          </div>
        </Section>

        {/* ── Technical ── */}
        <details className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-gray-500 uppercase tracking-wide select-none">
            🔧 Informações Técnicas
          </summary>
          <div className="px-6 pb-6 pt-2 space-y-1">
            <Row label="ID" value={<code className="text-xs bg-gray-100 px-2 py-1 rounded">{r.id}</code>} />
            <Row label="Origem" value={r.source ?? "website"} />
            <Row label="IP Hash" value={r.ip_hash ?? "—"} />
            <Row label="User Agent" value={<span className="text-xs text-gray-500 break-all">{r.user_agent ?? "—"}</span>} />
          </div>
        </details>

      </div>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
      <p className="text-xl font-bold text-[#111111]">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function SwotCard({ title, items, color, titleColor }: {
  title: string; items: string[]; color: string; titleColor: string;
}) {
  return (
    <div className={`rounded-xl border-2 p-4 ${color}`}>
      <h3 className={`font-bold text-sm mb-3 ${titleColor}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-700 flex gap-2">
            <span className="shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmartRow({ letter, label, color, value }: {
  letter: string; label: string; color: string; value: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className={`shrink-0 w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center font-bold text-sm`}>
        {letter}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
