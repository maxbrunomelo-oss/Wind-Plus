"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { placementQuestions, writingPrompt, CefrLevel } from "@/lib/placement/cefrQuestions";
import { BandStats } from "@/lib/placement/scoring";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";
import WindPlusWordmark from "@/components/ui/WindPlusWordmark";

type Step = "intro" | "form" | "test" | "writing" | "result";

type StudentInfo = {
  studentName: string;
  email: string;
  phone: string;
  age: string;
  objective: string;
  selfDeclaredLevel: string;
  consentAccepted: boolean;
  responsibleConsent: boolean;
};

type ResultData = {
  cefrLevel: CefrLevel;
  percentage: number;
  rawScore: number;
  maxScore: number;
  diagnosticSummary: string;
  recommendedCourse: string;
  bandBreakdown: Record<CefrLevel, BandStats>;
};

const OBJECTIVES = [
  "Conversação",
  "Business English",
  "Viagens",
  "Estudos",
  "Exames internacionais",
  "Entrevistas de emprego",
  "Atendimento profissional",
  "Desenvolvimento pessoal",
  "Outro",
];

const SELF_LEVELS = [
  "Nunca estudei inglês",
  "Sei apenas palavras soltas",
  "Consigo me apresentar",
  "Consigo conversar sobre temas simples",
  "Consigo manter conversas intermediárias",
  "Consigo falar com boa autonomia",
  "Não sei informar",
];

export default function PlacementTestForm() {
  const [step, setStep] = useState<Step>("intro");
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    studentName: "", email: "", phone: "", age: "",
    objective: "", selfDeclaredLevel: "",
    consentAccepted: false, responsibleConsent: false,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StudentInfo, string>>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingAnswer, setWritingAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  // Timing
  const testStartRef = useRef<number | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const [questionTimings, setQuestionTimings] = useState<Record<string, number>>({});

  const totalQuestions = placementQuestions.length;
  const currentQuestion = placementQuestions[currentQuestionIdx];
  const isUnder18 = studentInfo.age !== "" && parseInt(studentInfo.age) < 18;

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof StudentInfo, string>> = {};
    if (!studentInfo.studentName.trim()) errors.studentName = "Nome é obrigatório";
    if (!studentInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentInfo.email))
      errors.email = "E-mail inválido";
    if (!studentInfo.phone.trim()) errors.phone = "WhatsApp é obrigatório";
    if (!studentInfo.consentAccepted) errors.consentAccepted = "Você precisa aceitar o consentimento";
    if (isUnder18 && !studentInfo.responsibleConsent)
      errors.responsibleConsent = "Necessário autorização do responsável legal";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      testStartRef.current = Date.now();
      questionStartRef.current = Date.now();
      setStep("test");
    }
  };

  const handleSelectOption = useCallback((optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }, [currentQuestion]);

  const recordQuestionTiming = useCallback(() => {
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    const qId = placementQuestions[currentQuestionIdx].id;
    setQuestionTimings((prev) => ({ ...prev, [qId]: (prev[qId] ?? 0) + elapsed }));
    questionStartRef.current = Date.now();
  }, [currentQuestionIdx]);

  const handleNextQuestion = () => {
    recordQuestionTiming();
    if (currentQuestionIdx < totalQuestions - 1) setCurrentQuestionIdx((i) => i + 1);
    else setStep("writing");
  };

  const handlePrevQuestion = () => {
    recordQuestionTiming();
    if (currentQuestionIdx > 0) setCurrentQuestionIdx((i) => i - 1);
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        studentName: studentInfo.studentName,
        email: studentInfo.email,
        phone: studentInfo.phone,
        age: studentInfo.age ? parseInt(studentInfo.age) : undefined,
        objective: studentInfo.objective || undefined,
        selfDeclaredLevel: studentInfo.selfDeclaredLevel || undefined,
        consentAccepted: true,
        responsibleConsent: studentInfo.responsibleConsent || undefined,
        objectiveAnswers: answers,
        writingAnswer: writingAnswer || undefined,
        durationSeconds: testStartRef.current
          ? Math.round((Date.now() - testStartRef.current) / 1000)
          : undefined,
        questionTimings,
      };
      const res = await fetch("/api/placement-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar o teste.");
      setResult(data.result);
      setStep("result");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === "intro") {
    const cefrLevels = [
      { id: "A1", desc: "Iniciante",      d: "wp-d3" },
      { id: "A2", desc: "Básico",         d: "wp-d4" },
      { id: "B1", desc: "Intermediário",  d: "wp-d5" },
      { id: "B2", desc: "Intermediário+", d: "wp-d6" },
      { id: "C1", desc: "Avançado",       d: "wp-d7" },
      { id: "C2", desc: "Fluente",        d: "wp-d8" },
    ];

    return (
      <div className="relative min-h-[calc(100vh-68px)] flex items-center overflow-hidden">

        {/* ── Background: subtle grid ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* ── Red ambient glow ── */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none wp-glow"
          style={{
            top: "50%", left: "55%",
            transform: "translate(-50%, -50%)",
            width: 700, height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(227,6,19,0.07) 0%, transparent 65%)",
          }}
        />

        {/* ── Decorative pixel blocks ── */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* top-right cluster */}
          <div className="absolute top-[8%] right-[7%]  w-3   h-3   bg-[#E30613] opacity-70 wp-pixel-float" />
          <div className="absolute top-[12%] right-[10%] w-1.5 h-1.5 bg-[#E30613] opacity-35" />
          <div className="absolute top-[7%]  right-[5%]  w-10  h-10  border border-[#E30613]/15 rounded-sm" />
          <div className="absolute top-[16%] right-[6%]  w-5   h-5   border border-white/8 rounded-sm" />
          {/* left side */}
          <div className="absolute top-[35%] left-[2%]   w-1   h-20  bg-gradient-to-b from-transparent via-[#E30613]/25 to-transparent" />
          <div className="absolute bottom-[25%] left-[4%] w-2  h-2   bg-white opacity-10 wp-pixel-float" style={{animationDelay:"1.5s"}} />
          <div className="absolute bottom-[18%] left-[6%] w-5  h-1   bg-[#E30613] opacity-40" />
          {/* bottom-right */}
          <div className="absolute bottom-[12%] right-[8%] w-4  h-4  border border-white/8 rounded-sm" />
          <div className="absolute bottom-[8%]  right-[5%] w-1.5 h-1.5 bg-[#E30613] opacity-50" />
          {/* large faint frames */}
          <div className="absolute -top-10 -right-10 w-64 h-64 border border-white/[0.03]" />
          <div className="absolute -bottom-6 -left-6  w-40 h-40 border border-white/[0.03]" />
        </div>

        {/* ── Main content grid ── */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-24 items-center">

            {/* ══ LEFT: Text content ══ */}
            <div className="flex flex-col gap-7">

              {/* Eyebrow */}
              <div className="wp-fade-up inline-flex items-center gap-2.5 w-fit border border-white/[0.1] bg-white/[0.04] rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] shrink-0" />
                <span className="text-[11px] font-medium text-white/45 uppercase tracking-[0.18em]">
                  Diagnóstico CEFR · Gratuito
                </span>
              </div>

              {/* Title */}
              <div className="wp-fade-up wp-d1">
                <h1
                  className="text-5xl md:text-6xl xl:text-[70px] font-black text-white leading-[1.02] tracking-[-0.025em]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Descubra<br />
                  o seu nível<br />
                  <span className="text-[#E30613]">de Inglês</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="wp-fade-up wp-d2 text-white/45 text-base lg:text-[17px] leading-relaxed max-w-[420px]">
                Faça um teste rápido baseado no CEFR e receba uma orientação inicial sobre o seu nível de fluência.
              </p>

              {/* Warning card */}
              <div className="wp-fade-up wp-d3 flex gap-3 items-start bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 lg:p-5">
                <div className="shrink-0 w-6 h-6 rounded-md bg-[#E30613]/12 border border-[#E30613]/25 flex items-center justify-center mt-0.5">
                  <span className="text-[#E30613] text-[11px] font-black leading-none">!</span>
                </div>
                <p className="text-white/38 text-sm leading-relaxed">
                  <span className="text-white/58 font-semibold">Aviso importante —</span>{" "}
                  Este teste é uma avaliação diagnóstica inicial. Ele não substitui uma certificação oficial de proficiência, mas ajuda nossa equipe pedagógica a indicar a melhor turma para o seu perfil.
                </p>
              </div>

              {/* CTA */}
              <div className="wp-fade-up wp-d4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => setStep("form")}
                  className="wp-cta group relative overflow-hidden bg-[#E30613] text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all duration-300 hover:bg-[#C5000E] shadow-[0_0_32px_rgba(227,6,19,0.22)] hover:shadow-[0_0_48px_rgba(227,6,19,0.38)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
                >
                  <span>Começar teste de nivelamento</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 text-lg leading-none">→</span>
                  <span className="wp-cta-shimmer" aria-hidden="true" />
                </button>
                <p className="text-white/22 text-xs tracking-wide">Aprox. 15 minutos · Gratuito</p>
              </div>
            </div>

            {/* ══ RIGHT: Visual panel ══ */}
            <div className="wp-fade-in wp-d2 flex flex-col items-center gap-10">

              {/* Brand display */}
              <div className="relative flex flex-col items-center gap-3">
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(227,6,19,0.14) 0%, transparent 70%)" }}
                />
                <Image
                  src="/logo-wind-plus-hd.png"
                  alt="Wind Plus"
                  width={130}
                  height={130}
                  className="relative object-contain drop-shadow-2xl"
                />
                <WindPlusWordmark
                  variant="stacked"
                  windSize="text-3xl"
                  plusSize="text-[13px]"
                  windColor="text-white"
                  plusColor="text-[#E30613]"
                />
              </div>

              {/* Divider */}
              <div className="w-full flex items-center gap-4 max-w-[320px]">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-[9px] font-medium text-white/25 uppercase tracking-[0.22em] whitespace-nowrap">
                  Framework de Referência
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* CEFR levels grid */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-[320px]">
                {cefrLevels.map(({ id, desc, d }) => (
                  <div
                    key={id}
                    className={`wp-fade-up ${d} wp-cefr-card relative group bg-white/[0.04] hover:bg-[#E30613]/[0.08] border border-white/[0.08] hover:border-[#E30613]/30 rounded-lg p-3 text-center transition-all duration-300 cursor-default overflow-hidden`}
                  >
                    <div
                      className="font-black text-xl text-white/85 group-hover:text-white transition-colors duration-200"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {id}
                    </div>
                    <div className="text-[9px] text-white/25 group-hover:text-white/40 mt-0.5 leading-tight transition-colors duration-200">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom label */}
              <p className="text-[9px] text-white/18 uppercase tracking-[0.22em]">
                Common European Framework of Reference
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── FORM ───────────────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <form onSubmit={handleFormSubmit} noValidate className="max-w-lg mx-auto space-y-5 px-4 py-8 my-8 bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.55)]">
        <h2 className="text-xl font-bold text-[#111111]">Suas informações</h2>
        <p className="text-sm text-gray-500 -mt-2">Preencha abaixo para começar o teste.</p>

        <Field label="Nome completo *" error={formErrors.studentName}>
          <input type="text" required value={studentInfo.studentName}
            onChange={(e) => setStudentInfo((s) => ({ ...s, studentName: e.target.value }))}
            className={inputCls(!!formErrors.studentName)} placeholder="Seu nome completo" />
        </Field>

        <Field label="E-mail *" error={formErrors.email}>
          <input type="email" required value={studentInfo.email}
            onChange={(e) => setStudentInfo((s) => ({ ...s, email: e.target.value }))}
            className={inputCls(!!formErrors.email)} placeholder="seu@email.com" />
        </Field>

        <Field label="WhatsApp *" error={formErrors.phone}>
          <input type="tel" required value={studentInfo.phone}
            onChange={(e) => setStudentInfo((s) => ({ ...s, phone: e.target.value }))}
            className={inputCls(!!formErrors.phone)} placeholder="+55 (11) 99999-9999" />
        </Field>

        <Field label="Idade">
          <input type="number" min={5} max={100} value={studentInfo.age}
            onChange={(e) => setStudentInfo((s) => ({ ...s, age: e.target.value }))}
            className={inputCls(false)} placeholder="Sua idade" />
        </Field>

        <Field label="Objetivo com o inglês">
          <select value={studentInfo.objective}
            onChange={(e) => setStudentInfo((s) => ({ ...s, objective: e.target.value }))}
            className={inputCls(false)}>
            <option value="">Selecione...</option>
            {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>

        <Field label="Qual é o seu nível atual (na sua opinião)?">
          <select value={studentInfo.selfDeclaredLevel}
            onChange={(e) => setStudentInfo((s) => ({ ...s, selfDeclaredLevel: e.target.value }))}
            className={inputCls(false)}>
            <option value="">Selecione...</option>
            {SELF_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-xs text-gray-600 leading-relaxed">
          A Wind Plus utilizará seus dados apenas para avaliação de nível, orientação pedagógica e contato sobre turmas disponíveis. Seus dados não serão vendidos nem compartilhados com terceiros para fins comerciais externos.
          {/* TODO: Replace with official Wind Plus Privacy Policy URL */}
        </div>

        <Field error={formErrors.consentAccepted}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={studentInfo.consentAccepted}
              onChange={(e) => setStudentInfo((s) => ({ ...s, consentAccepted: e.target.checked }))}
              className="mt-1 h-4 w-4 accent-[#E30613]" />
            <span className="text-sm text-gray-700">
              Autorizo a Wind Plus a utilizar meus dados exclusivamente para fins de avaliação de nível, orientação pedagógica e contato sobre turmas disponíveis. *
            </span>
          </label>
        </Field>

        {isUnder18 && (
          <Field error={formErrors.responsibleConsent}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={studentInfo.responsibleConsent}
                onChange={(e) => setStudentInfo((s) => ({ ...s, responsibleConsent: e.target.checked }))}
                className="mt-1 h-4 w-4 accent-[#E30613]" />
              <span className="text-sm text-gray-700">
                Declaro que o envio deste teste foi autorizado por um responsável legal. *
              </span>
            </label>
          </Field>
        )}

        <button type="submit"
          className="w-full bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold px-6 py-4 rounded-xl transition-colors shadow-sm">
          Iniciar teste →
        </button>
      </form>
    );
  }

  // ── TEST ───────────────────────────────────────────────────────────────────
  if (step === "test") {
    const selectedOption = answers[currentQuestion.id] ?? null;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 my-8 space-y-6 bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.55)]">
        <ProgressBar current={currentQuestionIdx + 1} total={totalQuestions} />
        <QuestionCard question={currentQuestion} selectedOption={selectedOption} onSelect={handleSelectOption} />
        <div className="flex justify-between gap-4">
          <button type="button" onClick={handlePrevQuestion} disabled={currentQuestionIdx === 0}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            ← Anterior
          </button>
          <button type="button" onClick={handleNextQuestion} disabled={!selectedOption}
            className="px-6 py-3 rounded-xl bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold text-sm disabled:opacity-40 transition-colors">
            {currentQuestionIdx < totalQuestions - 1 ? "Próxima →" : "Ir para escrita →"}
          </button>
        </div>
      </div>
    );
  }

  // ── WRITING ────────────────────────────────────────────────────────────────
  if (step === "writing") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 my-8 space-y-6 bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.55)]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <span className="inline-block bg-[#E30613]/10 text-[#E30613] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Produção Escrita
          </span>
          <p className="text-gray-900 font-medium text-base md:text-lg leading-relaxed">
            {writingPrompt.prompt}
          </p>
          <textarea value={writingAnswer} onChange={(e) => setWritingAnswer(e.target.value)}
            rows={8} maxLength={2000}
            className="mt-5 w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613]/40 resize-none"
            placeholder="Write your answer here in English..." aria-label="Writing answer" />
          <p className="text-xs text-gray-400 text-right mt-1">{writingAnswer.length}/2000</p>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{submitError}</div>
        )}

        <div className="flex justify-between gap-4">
          <button type="button"
            onClick={() => { setStep("test"); setCurrentQuestionIdx(totalQuestions - 1); }}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
            ← Voltar
          </button>
          <button type="button" onClick={handleSubmitTest} disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold text-sm disabled:opacity-60 transition-colors flex items-center gap-2">
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </>
            ) : "Ver meu resultado →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (step === "result" && result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 my-8 bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.55)]">
        <ResultCard {...result} studentName={studentInfo.studentName} />
      </div>
    );
  }

  return null;
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613]/40`;
}

function Field({ label, error, children }: { label?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
