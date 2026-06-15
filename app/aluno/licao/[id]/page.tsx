"use client";

import { useState, use } from "react";
import Link from "next/link";
import { A1_LESSONS, type Lesson } from "@/lib/platform/a1-lessons";

const ALL_LESSONS: Record<string, Lesson> = Object.fromEntries(
  A1_LESSONS.map((l) => [l.id, l])
);

const TABS = [
  { id: "vocabulary", label: "Vocabulary",  icon: "📚" },
  { id: "reading",    label: "Reading",     icon: "📖" },
  { id: "listening",  label: "Listening",   icon: "🎧" },
  { id: "speaking",   label: "Speaking",    icon: "🗣️" },
  { id: "writing",    label: "Writing",     icon: "✍️" },
  { id: "game",       label: "Atividade",   icon: "🎮" },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function VocabularyTab({ data }: { data: Lesson["content"]["vocabulary"] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  return (
    <div className="space-y-3">
      <p className="text-white/40 text-sm mb-4">Clique em cada card para ver a tradução e o exemplo.</p>
      <div className="grid grid-cols-2 gap-3">
        {data.words.map((w, i) => {
          const isOpen = revealed.has(i);
          return (
            <button
              key={i}
              onClick={() => setRevealed((prev) => { const s = new Set(prev); isOpen ? s.delete(i) : s.add(i); return s; })}
              className="bg-[#1E1E1E] border border-white/5 rounded-xl p-4 text-left hover:border-white/15 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white font-medium">{w.word}</p>
                  {w.phonetic && <p className="text-white/30 text-xs mt-0.5">{w.phonetic}</p>}
                </div>
                <span className="text-white/20 text-xs shrink-0 mt-0.5">{isOpen ? "▲" : "▼"}</span>
              </div>
              {isOpen && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                  <p className="text-[#E31E24] text-sm font-medium">{w.translation}</p>
                  <p className="text-white/50 text-xs italic">{w.example}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => setRevealed(new Set(data.words.map((_, i) => i)))}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Revelar todos
        </button>
      </div>
    </div>
  );
}

function ReadingTab({ data }: { data: Lesson["content"]["reading"] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-6">
      {/* Text */}
      <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5">
        <h3 className="text-white font-medium mb-3">{data.title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{data.text}</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Questões de Compreensão</h3>
        {data.questions.map((q, qi) => (
          <div key={qi} className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
            <p className="text-white text-sm font-medium mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const correct  = q.correct === oi;
                let cls = "border-white/10 text-white/60 hover:border-white/20";
                if (checked) {
                  if (correct)  cls = "border-green-500 bg-green-500/10 text-green-400";
                  else if (selected && !correct) cls = "border-red-500 bg-red-500/10 text-red-400";
                } else if (selected) {
                  cls = "border-[#E31E24] bg-[#E31E24]/10 text-white";
                }
                return (
                  <button
                    key={oi}
                    disabled={checked}
                    onClick={() => setAnswers((p) => ({ ...p, [qi]: oi }))}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${cls}`}
                  >
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {!checked ? (
          <button
            disabled={Object.keys(answers).length < data.questions.length}
            onClick={() => setChecked(true)}
            className="w-full py-3 rounded-xl bg-[#E31E24] text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c41920] transition-colors"
          >
            Verificar Respostas
          </button>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-green-400 font-medium">
              {data.questions.filter((q, i) => answers[i] === q.correct).length} / {data.questions.length} corretas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ListeningTab({ data }: { data: Lesson["content"]["listening"] }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-6">
      {/* Player mockup */}
      <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5">
        <h3 className="text-white font-medium mb-4">{data.title}</h3>
        <div className="bg-black/30 rounded-lg p-4 flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-[#E31E24] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M5 3.5l8 4.5-8 4.5V3.5z" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#E31E24] rounded-full w-0 transition-all" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-white/30 text-xs">0:00</span>
              <span className="text-white/30 text-xs">~3:00</span>
            </div>
          </div>
          <div className="flex gap-1">
            {["0.75x","1x","1.25x","1.5x"].map((s) => (
              <button key={s} className={`text-xs px-1.5 py-0.5 rounded ${s === "1x" ? "bg-[#E31E24]/20 text-[#E31E24]" : "text-white/20 hover:text-white/50"}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Transcript toggle */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="mt-3 text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
        >
          {showTranscript ? "▲ Ocultar" : "▼ Ver"} transcrição
        </button>
        {showTranscript && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{data.transcript}</p>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Questões de Compreensão</h3>
        {data.questions.map((q, qi) => (
          <div key={qi} className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
            <p className="text-white text-sm font-medium mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const correct  = q.correct === oi;
                let cls = "border-white/10 text-white/60 hover:border-white/20";
                if (checked) {
                  if (correct)  cls = "border-green-500 bg-green-500/10 text-green-400";
                  else if (selected && !correct) cls = "border-red-500 bg-red-500/10 text-red-400";
                } else if (selected) {
                  cls = "border-[#E31E24] bg-[#E31E24]/10 text-white";
                }
                return (
                  <button key={oi} disabled={checked} onClick={() => setAnswers((p) => ({ ...p, [qi]: oi }))}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${cls}`}>
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {!checked ? (
          <button disabled={Object.keys(answers).length < data.questions.length} onClick={() => setChecked(true)}
            className="w-full py-3 rounded-xl bg-[#E31E24] text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c41920] transition-colors">
            Verificar Respostas
          </button>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-green-400 font-medium">
              {data.questions.filter((q, i) => answers[i] === q.correct).length} / {data.questions.length} corretas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SpeakingTab({ data }: { data: Lesson["content"]["speaking"] }) {
  const [showModel, setShowModel] = useState(false);
  return (
    <div className="space-y-5">
      <div className="bg-[#E31E24]/10 border border-[#E31E24]/20 rounded-xl p-5">
        <p className="text-[#E31E24] text-xs font-semibold uppercase tracking-wider mb-2">Sua tarefa</p>
        <p className="text-white text-sm leading-relaxed">{data.prompt}</p>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 space-y-2">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">💡 Dicas</p>
        {data.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[#E31E24] text-xs mt-0.5 shrink-0">•</span>
            <p className="text-white/60 text-sm">{tip}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">🎤 Grave sua resposta</p>
        <button className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-white/30 text-sm hover:border-[#E31E24]/40 hover:text-white/50 transition-all flex items-center justify-center gap-2">
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="1" width="6" height="9" rx="3" />
            <path d="M2 8a6 6 0 0012 0M8 14v2" strokeLinecap="round" />
          </svg>
          Clique para gravar (em breve)
        </button>
      </div>

      <button onClick={() => setShowModel(!showModel)}
        className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
        {showModel ? "▲ Ocultar" : "▼ Ver"} modelo de resposta
      </button>
      {showModel && (
        <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/10">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Modelo</p>
          <p className="text-white/60 text-sm leading-relaxed italic">{data.model}</p>
        </div>
      )}
    </div>
  );
}

function WritingTab({ data }: { data: Lesson["content"]["writing"] }) {
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="bg-[#E31E24]/10 border border-[#E31E24]/20 rounded-xl p-5">
        <p className="text-[#E31E24] text-xs font-semibold uppercase tracking-wider mb-2">Sua tarefa</p>
        <p className="text-white text-sm leading-relaxed">{data.prompt}</p>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 space-y-2">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">💡 Dicas</p>
        {data.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[#E31E24] text-xs mt-0.5 shrink-0">•</span>
            <p className="text-white/60 text-sm">{tip}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva aqui em inglês..."
          rows={8}
          className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl p-4 text-white text-sm placeholder-white/20 resize-none focus:outline-none focus:border-[#E31E24]/50 transition-colors"
        />
        <div className="flex justify-between items-center">
          <p className={`text-xs ${wordCount >= data.minWords ? "text-green-400" : "text-white/30"}`}>
            {wordCount} / {data.minWords} palavras mínimas
          </p>
          {wordCount >= data.minWords && (
            <button className="bg-[#E31E24] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#c41920] transition-colors">
              Enviar ✓
            </button>
          )}
        </div>
      </div>

      <button onClick={() => setShowModel(!showModel)}
        className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
        {showModel ? "▲ Ocultar" : "▼ Ver"} modelo de resposta
      </button>
      {showModel && (
        <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/10">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Modelo</p>
          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line italic">{data.model}</p>
        </div>
      )}
    </div>
  );
}

function GameTab({ data }: { data: Lesson["content"]["game"] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const score = checked
    ? data.items.filter((item, i) =>
        answers[i]?.toLowerCase().trim() === item.answer.toLowerCase().trim()
      ).length
    : 0;

  return (
    <div className="space-y-5">
      <div className="bg-[#E31E24]/10 border border-[#E31E24]/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎮</span>
          <p className="text-white font-medium">{data.title}</p>
        </div>
        <p className="text-white/50 text-sm">{data.instructions}</p>
      </div>

      <div className="space-y-3">
        {data.items.map((item, i) => {
          const isCorrect = checked && answers[i]?.toLowerCase().trim() === item.answer.toLowerCase().trim();
          const isWrong   = checked && answers[i] !== undefined && !isCorrect;

          return (
            <div key={i} className={`bg-[#1E1E1E] rounded-xl p-4 border transition-all ${
              isCorrect ? "border-green-500/40" : isWrong ? "border-red-500/40" : "border-white/5"
            }`}>
              <p className="text-white/60 text-sm mb-2">{item.question}</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={answers[i] ?? ""}
                  disabled={checked}
                  onChange={(e) => setAnswers((p) => ({ ...p, [i]: e.target.value }))}
                  placeholder="Sua resposta..."
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-60"
                />
                {isCorrect && <span className="text-green-400 text-lg shrink-0">✓</span>}
                {isWrong   && <span className="text-red-400  text-lg shrink-0">✗</span>}
              </div>
              {isWrong && (
                <p className="text-white/40 text-xs mt-1.5">Resposta: <span className="text-green-400">{item.answer}</span></p>
              )}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button
          onClick={() => setChecked(true)}
          className="w-full py-3 rounded-xl bg-[#E31E24] text-white font-medium text-sm hover:bg-[#c41920] transition-colors"
        >
          Verificar Respostas
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Resultado</p>
            <p className={`text-2xl font-bold ${score === data.items.length ? "text-green-400" : score >= data.items.length / 2 ? "text-yellow-400" : "text-[#E31E24]"}`}>
              {score} / {data.items.length}
            </p>
            <p className="text-white/40 text-xs mt-1">
              {score === data.items.length ? "Perfeito! 🎉" : score >= data.items.length / 2 ? "Bom trabalho! 👍" : "Continue praticando! 💪"}
            </p>
          </div>
          <button
            onClick={() => { setAnswers({}); setChecked(false); }}
            className="w-full py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/70 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LicaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = ALL_LESSONS[id];
  const [activeTab, setActiveTab] = useState<TabId>("vocabulary");

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-white/30 text-sm">Lição não encontrada.</p>
        <Link href="/aluno/trilha" className="text-[#E31E24] text-sm hover:underline">← Voltar para a Trilha</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-white/30 text-sm">
        <Link href="/aluno/trilha" className="hover:text-white/60 transition-colors">Trilha</Link>
        <span>/</span>
        <span className="text-[#E31E24]">A1</span>
        <span>/</span>
        <span className="text-white/60">Lição {lesson.order}</span>
      </div>

      {/* Header */}
      <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#E31E24]/20 text-[#E31E24] text-xs font-semibold px-2 py-0.5 rounded-full">A1 · Lição {lesson.order}</span>
              <span className="text-white/20 text-xs">{lesson.durationMin} min</span>
            </div>
            <h1 className="text-white text-xl font-semibold">{lesson.title}</h1>
            <p className="text-white/40 text-sm mt-1">
              {lesson.communicativeFunction} · <span className="text-white/60">{lesson.grammarCore}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-yellow-400 font-bold">+{lesson.xpReward} XP</p>
            <p className="text-white/30 text-xs mt-0.5">Produto Final</p>
            <p className="text-white/60 text-xs">{lesson.finalProduct}</p>
          </div>
        </div>

        {/* WEF Skill badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-white/20 text-xs">WEF Skill:</span>
          <span className="bg-white/5 text-white/50 text-xs px-2 py-0.5 rounded-full border border-white/10">{lesson.wefSkill}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#E31E24]/20 text-[#E31E24] border border-[#E31E24]/30"
                : "text-white/40 hover:text-white/70 border border-transparent"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "vocabulary" && <VocabularyTab data={lesson.content.vocabulary} />}
        {activeTab === "reading"    && <ReadingTab    data={lesson.content.reading}    />}
        {activeTab === "listening"  && <ListeningTab  data={lesson.content.listening}  />}
        {activeTab === "speaking"   && <SpeakingTab   data={lesson.content.speaking}   />}
        {activeTab === "writing"    && <WritingTab     data={lesson.content.writing}    />}
        {activeTab === "game"       && <GameTab        data={lesson.content.game}       />}
      </div>

      {/* Next lesson */}
      {lesson.order < 10 && (
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-white/30 text-xs">Próxima lição</p>
            <p className="text-white text-sm font-medium">
              {A1_LESSONS[lesson.order]?.title ?? ""}
            </p>
          </div>
          <span className="text-white/20 text-sm">🔒 Complete esta lição primeiro</span>
        </div>
      )}
    </div>
  );
}
