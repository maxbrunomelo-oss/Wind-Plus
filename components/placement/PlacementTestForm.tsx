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
    return (
      <div className="text-center max-w-2xl mx-auto py-10 px-4">

        {/* Logos */}
        <div className="flex items-center justify-center gap-10 mb-10">
          {/* Wind Plus logo + stacked wordmark */}
          <div className="flex flex-col items-center gap-1">
            <Image
              src="/logo-wind-plus-hd.png"
              alt="Wind Plus"
              width={110}
              height={110}
              className="object-contain drop-shadow-md"
            />
            <WindPlusWordmark
              variant="stacked"
              windSize="text-2xl"
              plusSize="text-[11px]"
              windColor="text-[#111111]"
              plusColor="text-[#E30613]"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-20 bg-gray-200" />

          {/* CEFR badge */}
          <div className="flex flex-col items-center gap-2">
            {/* Stars ring + CEFR text */}
            <div className="relative flex items-center justify-center w-[110px] h-[110px]">
              {/* Outer ring of stars */}
              <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <circle cx="55" cy="55" r="52" fill="none" stroke="#003399" strokeWidth="2.5" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const cx = 55 + 44 * Math.cos(angle);
                  const cy = 55 + 44 * Math.sin(angle);
                  return (
                    <text key={i} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#FFCC00">★</text>
                  );
                })}
              </svg>
              {/* Inner text */}
              <div className="flex flex-col items-center leading-none z-10">
                <span className="text-[22px] font-black text-[#003399] tracking-tight">CEFR</span>
                <span className="text-[7px] font-bold text-[#003399] uppercase tracking-widest text-center leading-tight mt-0.5">Common European<br/>Framework</span>
              </div>
            </div>
            {/* Level badges */}
            <div className="grid grid-cols-3 gap-1 mt-1">
              {[
                { label: "A1", bg: "#5BC8C1" },
                { label: "B1", bg: "#F5C242" },
                { label: "C1", bg: "#4A90D9" },
                { label: "A2", bg: "#6BBF6A" },
                { label: "B2", bg: "#4CAF50" },
                { label: "C2", bg: "#E8943A" },
              ].map(({ label, bg }) => (
                <div
                  key={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-sm"
                  style={{ backgroundColor: bg }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#111111] mb-3 leading-tight">
          Descubra o seu nível de Inglês
        </h1>
        <p className="text-gray-500 text-base md:text-lg mb-6 leading-relaxed">
          Faça um teste rápido baseado no CEFR e receba uma orientação inicial sobre o seu nível de fluência.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-8 text-left">
          <strong>Aviso importante:</strong> Este teste é uma avaliação diagnóstica inicial. Ele não substitui uma certificação oficial de proficiência, mas ajuda nossa equipe pedagógica a indicar a melhor turma para o seu perfil.
        </div>

        <button
          onClick={() => setStep("form")}
          className="bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-md"
        >
          Começar teste de nivelamento
        </button>
        <p className="text-xs text-gray-400 mt-4">Aproximadamente 15 minutos · Gratuito</p>
      </div>
    );
  }

  // ── FORM ───────────────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <form onSubmit={handleFormSubmit} noValidate className="max-w-lg mx-auto space-y-5 px-4 py-6">
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
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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
      <div className="max-w-2xl mx-auto px-4 py-6">
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
