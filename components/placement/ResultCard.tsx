"use client";

import { CefrLevel } from "@/lib/placement/cefrQuestions";
import { BandStats } from "@/lib/placement/scoring";

type Props = {
  cefrLevel: CefrLevel;
  percentage: number;
  rawScore: number;
  maxScore: number;
  diagnosticSummary: string;
  recommendedCourse: string;
  bandBreakdown: Record<CefrLevel, BandStats>;
  studentName: string;
};

const levelColors: Record<CefrLevel, string> = {
  starter: "from-gray-500 to-gray-700",
  A1: "from-green-500 to-green-700",
  A2: "from-teal-500 to-teal-700",
  B1: "from-blue-500 to-blue-700",
  B2: "from-indigo-500 to-indigo-700",
  C1: "from-purple-600 to-purple-800",
};

const levelLabels: Record<CefrLevel, string> = {
  starter: "Starter / Pré-A1",
  A1: "A1 — Iniciante",
  A2: "A2 — Básico",
  B1: "B1 — Intermediário",
  B2: "B2 — Intermediário Superior",
  C1: "C1 — Avançado",
};

const levelOrder: CefrLevel[] = ["starter", "A1", "A2", "B1", "B2", "C1"];

const whatsappNumber = process.env.NEXT_PUBLIC_WIND_WHATSAPP_NUMBER ?? "5511999999999";

export default function ResultCard({
  cefrLevel,
  percentage,
  rawScore,
  maxScore,
  diagnosticSummary,
  recommendedCourse,
  bandBreakdown,
  studentName,
}: Props) {
  const firstName = studentName.split(" ")[0];
  const whatsappText = encodeURIComponent(
    `Olá! Acabei de fazer o teste de nivelamento da Wind Plus e meu resultado foi ${levelLabels[cefrLevel]}. Gostaria de saber mais sobre as turmas disponíveis.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header card */}
      <div className={`bg-gradient-to-br ${levelColors[cefrLevel]} rounded-2xl p-8 text-white text-center shadow-lg`}>
        <p className="text-white/80 text-sm font-medium mb-2">Parabéns, {firstName}!</p>
        <h2 className="text-4xl font-bold mb-1">{levelLabels[cefrLevel]}</h2>
        <p className="text-white/90 text-lg mt-3">
          Pontuação: {rawScore}/{maxScore} &middot; {percentage}%
        </p>
      </div>

      {/* Diagnostic */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Diagnóstico pedagógico</h3>
        <p className="text-gray-700 leading-relaxed">{diagnosticSummary}</p>
      </div>

      {/* Band breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Desempenho por nível CEFR</h3>
        <div className="space-y-3">
          {levelOrder.map((lvl) => {
            const band = bandBreakdown[lvl];
            return (
              <div key={lvl}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium">{lvl === "starter" ? "Starter" : lvl}</span>
                  <span>{band.correct}/{band.total} corretas ({band.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${band.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended course */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Curso recomendado</p>
        <p className="text-blue-900 font-bold text-lg">{recommendedCourse}</p>
      </div>

      {/* Final message */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          A equipe da Wind Plus analisará seu resultado e poderá entrar em contato para indicar a melhor turma para o seu perfil.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Falar com a Wind Plus no WhatsApp
        </a>
      </div>

      {/* LGPD notice */}
      <p className="text-center text-xs text-gray-400 pb-4">
        Este teste é uma avaliação diagnóstica inicial e não substitui uma certificação oficial de proficiência.
      </p>
    </div>
  );
}
