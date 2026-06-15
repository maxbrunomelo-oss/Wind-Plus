"use client";

import Link from "next/link";
import { useState } from "react";

const CEFR_LEVELS = [
  { level: "A1", label: "Beginner",     units: 1, done: 0, status: "current"   as const, color: "#E31E24" },
  { level: "A2", label: "Elementary",   units: 1, done: 0, status: "locked"    as const, color: "#2563EB" },
  { level: "B1", label: "Intermediate", units: 1, done: 0, status: "locked"    as const, color: "#7C3AED" },
  { level: "B2", label: "Upper-Int.",   units: 1, done: 0, status: "locked"    as const, color: "#16A34A" },
  { level: "C1", label: "Advanced",     units: 1, done: 0, status: "locked"    as const, color: "#D97706" },
  { level: "C2", label: "Mastery",      units: 1, done: 0, status: "locked"    as const, color: "#EC4899" },
];

const COURSES = [
  { slug: "fluency",  label: "Fluency Course" },
  { slug: "business", label: "Business English" },
  { slug: "medicine", label: "English for Medicine" },
  { slug: "grammar",  label: "Use of Grammar" },
  { slug: "exams",    label: "International Exams" },
];

export default function TrilhaPage() {
  const [activeCourse, setActiveCourse] = useState("fluency");

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-semibold">Minha Trilha</h1>
        <p className="text-white/40 text-sm mt-0.5">Sua jornada CEFR do A1 ao C2</p>
      </div>

      {/* Course selector */}
      <div className="flex gap-2 flex-wrap">
        {COURSES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCourse(c.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCourse === c.slug
                ? "bg-[#E31E24] border-[#E31E24] text-white"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* CEFR Trail */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-white/10" />

        <div className="space-y-4">
          {CEFR_LEVELS.map((lvl, idx) => {
            const isCurrent = lvl.status === "current";
            const isLocked  = lvl.status === "locked";
            const pct = lvl.units > 0 ? Math.round((lvl.done / lvl.units) * 100) : 0;

            return (
              <div key={lvl.level} className="relative flex gap-4">
                {/* Node */}
                <div
                  className={`w-14 h-14 rounded-2xl shrink-0 flex flex-col items-center justify-center z-10 border-2 transition-all ${
                    isCurrent
                      ? "border-[#E31E24] bg-[#E31E24]/20"
                      : isLocked
                      ? "border-white/10 bg-[#1E1E1E]"
                      : "border-green-500 bg-green-500/20"
                  }`}
                >
                  {isLocked ? (
                    <svg viewBox="0 0 16 16" className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="7" width="8" height="7" rx="1" />
                      <path d="M5 7V5.5a3 3 0 016 0V7" />
                    </svg>
                  ) : (
                    <>
                      <span className={`text-sm font-bold ${isCurrent ? "text-[#E31E24]" : "text-green-400"}`}>
                        {lvl.level}
                      </span>
                    </>
                  )}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-xl border p-4 transition-all ${
                    isCurrent
                      ? "bg-[#1E1E1E] border-[#E31E24]/40"
                      : isLocked
                      ? "bg-[#1a1a1a] border-white/5 opacity-50"
                      : "bg-[#1E1E1E] border-green-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{lvl.level}</span>
                        <span className="text-white/40 text-sm">·</span>
                        <span className="text-white/40 text-sm">{lvl.label}</span>
                        {isCurrent && (
                          <span className="bg-[#E31E24]/20 text-[#E31E24] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-white/30 text-xs mt-1">
                        {lvl.done} de {lvl.units} unidade{lvl.units !== 1 ? "s" : ""} concluída{lvl.done !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {!isLocked && (
                      <Link
                        href={`/aluno/licao/${lvl.level.toLowerCase()}-01`}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          isCurrent
                            ? "bg-[#E31E24] text-white hover:bg-[#c41920]"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        }`}
                      >
                        {isCurrent ? "Continuar →" : "Revisar"}
                      </Link>
                    )}
                  </div>

                  {/* Progress bar */}
                  {!isLocked && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isCurrent ? "bg-[#E31E24]" : "bg-green-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-white/20 text-xs mt-1">{pct}% completo</p>
                    </div>
                  )}

                  {/* A1 lesson list */}
                  {isCurrent && activeCourse === "fluency" && (
                    <div className="mt-4 space-y-2">
                      <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">10 Lições</p>
                      {[
                        { id: "a1-01", title: "Hello, Future Me",           skill: "Verb to be",      status: "available"    as const },
                        { id: "a1-02", title: "My Smart Routine",           skill: "Simple Present",  status: "locked"       as const },
                        { id: "a1-03", title: "People & Teams",             skill: "be + adjectives", status: "locked"       as const },
                        { id: "a1-04", title: "Technology Around Me",       skill: "use / can",       status: "locked"       as const },
                        { id: "a1-05", title: "Food & Well-being",          skill: "like / don't like",status: "locked"      as const },
                        { id: "a1-06", title: "Places & Cities",            skill: "there is/are",    status: "locked"       as const },
                        { id: "a1-07", title: "Future Jobs",                skill: "want to",         status: "locked"       as const },
                        { id: "a1-08", title: "Problems & Solutions",       skill: "need / imperatives",status: "locked"     as const },
                        { id: "a1-09", title: "Communication Respectfully", skill: "Can you...?",     status: "locked"       as const },
                        { id: "a1-10", title: "My First Pitch",             skill: "review + connectors",status: "locked"    as const },
                      ].map((lesson, i) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                            lesson.status === "available"
                              ? "bg-white/5 hover:bg-white/10 cursor-pointer"
                              : "opacity-40"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            lesson.status === "available" ? "bg-[#E31E24]/20 text-[#E31E24]" : "bg-white/5 text-white/20"
                          }`}>
                            {i + 1}
                          </div>
                          {lesson.status === "available" ? (
                            <Link href={`/aluno/licao/${lesson.id}`} className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{lesson.title}</p>
                              <p className="text-white/30 text-xs">{lesson.skill}</p>
                            </Link>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <p className="text-white/40 text-sm truncate">{lesson.title}</p>
                              <p className="text-white/20 text-xs">{lesson.skill}</p>
                            </div>
                          )}
                          {lesson.status === "locked" && (
                            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white/20 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="4" y="7" width="8" height="7" rx="1" />
                              <path d="M5 7V5.5a3 3 0 016 0V7" />
                            </svg>
                          )}
                          {lesson.status === "available" && (
                            <span className="text-[#E31E24] text-xs shrink-0">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
