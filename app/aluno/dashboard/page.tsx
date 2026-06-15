import Link from "next/link";
import Image from "next/image";

// ─── Mock data — será substituído por queries Supabase no Módulo 2 ────────────
const STUDENT = {
  name: "Max",
  cefrLevel: "B1",
  nextLevel: "B2",
  course: "Fluency",
  dailyGoal: 5,
  lessonsToday: 3,
  studyMinutesToday: 28,
  studyGoalMin: 30,
  accuracyPct: 87,
  accuracyDelta: 4,
};

const RECENT_LESSONS = [
  {
    id: "1",
    unit: "Unit 7.3",
    title: "Listening: Swiss culture",
    level: "B1",
    durationMin: 15,
    skill: "Listening + Speaking",
    status: "in_progress" as const,
  },
  {
    id: "2",
    unit: "Unit 7.2",
    title: "Grammar: Comparatives",
    level: "B1",
    durationMin: 20,
    skill: "Grammar",
    status: "done" as const,
  },
  {
    id: "3",
    unit: "Unit 7.4",
    title: "Speaking: Debate",
    level: "B1+",
    durationMin: 25,
    skill: "Speaking",
    status: "locked" as const,
  },
];

const COURSES = [
  { slug: "fluency",  title: "Fluency Course",       color: "#E31E24", icon: null },
  { slug: "business", title: "Business English",      color: "#2563EB", icon: null },
  { slug: "medicine", title: "English for Medicine",  color: "#16A34A", icon: null },
  { slug: "grammar",  title: "Use of Grammar",        color: "#7C3AED", icon: null },
  { slug: "exams",    title: "International Exams",   color: "#D97706", icon: null },
];

// ─── Status helpers ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "in_progress" | "done" | "locked" }) {
  const map = {
    in_progress: { label: "Em andamento", cls: "bg-[#E31E24]/20 text-[#E31E24]" },
    done:        { label: "Concluída",    cls: "bg-green-500/20 text-green-400" },
    locked:      { label: "Bloqueada",    cls: "bg-white/10 text-white/40" },
  };
  const { label, cls } = map[status];
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
}

function LessonIcon({ status }: { status: "in_progress" | "done" | "locked" }) {
  if (status === "done")
    return (
      <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 16 16" className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  if (status === "locked")
    return (
      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 16 16" className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="7" width="8" height="7" rx="1" />
          <path d="M5 7V5.5a3 3 0 016 0V7" />
        </svg>
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-lg bg-[#E31E24]/20 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 16 16" className="w-4 h-4 text-[#E31E24]" fill="currentColor">
        <path d="M5 3.5l8 4.5-8 4.5V3.5z" />
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const dailyPct = Math.round((STUDENT.lessonsToday / STUDENT.dailyGoal) * 100);

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#E31E24] text-xs font-semibold tracking-widest uppercase mb-1">
            Bem-vindo de volta
          </p>
          <h1 className="text-white text-2xl font-semibold">
            Continue de onde parou
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Unit 7 — Cultural Contrasts · B1
          </p>
        </div>
        {/* CEFR Badge */}
        <div className="bg-[#E31E24]/20 border border-[#E31E24]/30 rounded-xl px-5 py-3 text-center">
          <p className="text-[#E31E24] text-xs font-medium mb-0.5">Nível atual</p>
          <p className="text-white font-semibold text-lg">
            {STUDENT.cefrLevel} → {STUDENT.nextLevel}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Meta Diária */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4v4l3 2" strokeLinecap="round" />
            </svg>
            <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Meta Diária</span>
          </div>
          <p className="text-white text-3xl font-semibold">
            {STUDENT.lessonsToday}
            <span className="text-white/30 text-xl">/{STUDENT.dailyGoal}</span>
          </p>
          <div className="mt-3">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E31E24] rounded-full transition-all"
                style={{ width: `${dailyPct}%` }}
              />
            </div>
            <p className="text-white/30 text-xs mt-1.5">lições · {dailyPct}%</p>
          </div>
        </div>

        {/* Tempo Hoje */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 5v3.5l2.5 1.5" strokeLinecap="round" />
            </svg>
            <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Tempo Hoje</span>
          </div>
          <p className="text-white text-3xl font-semibold">
            {STUDENT.studyMinutesToday}
            <span className="text-white/30 text-xl">m</span>
          </p>
          <p className="text-white/30 text-xs mt-3">Meta: {STUDENT.studyGoalMin} min</p>
        </div>

        {/* Precisão */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Precisão</span>
          </div>
          <p className="text-white text-3xl font-semibold">
            {STUDENT.accuracyPct}
            <span className="text-white/30 text-xl">%</span>
          </p>
          <p className="text-green-400 text-xs mt-3">
            ↑ {STUDENT.accuracyDelta}% vs. ontem
          </p>
        </div>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-white font-medium mb-3">Continue aprendendo</h2>
        <div className="space-y-2">
          {RECENT_LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-4 bg-[#1E1E1E] rounded-xl px-4 py-3.5 border border-white/5 ${
                lesson.status !== "locked" ? "hover:border-white/15 transition-colors cursor-pointer" : "opacity-60"
              }`}
            >
              <LessonIcon status={lesson.status} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {lesson.unit} — {lesson.title}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {lesson.level} · {lesson.durationMin} min · {lesson.skill}
                </p>
              </div>
              <StatusBadge status={lesson.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-white font-medium mb-3">Trilhas disponíveis</h2>
        <div className="grid grid-cols-5 gap-3">
          {COURSES.map((c) => (
            <Link
              key={c.slug}
              href={`/aluno/trilha?curso=${c.slug}`}
              className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors text-center group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-3 overflow-hidden"
                style={{ backgroundColor: `${c.color}20` }}
              >
                {c.slug === "fluency" ? (
                  <Image
                    src="/fluency-course.png"
                    alt="Fluency Course"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : c.slug === "business" ? (
                  <Image
                    src="/business-english.png"
                    alt="Business English"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : c.slug === "medicine" ? (
                  <Image
                    src="/medicine-english.png"
                    alt="English for Medicine"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : c.slug === "grammar" ? (
                  <Image
                    src="/grammar-english.png"
                    alt="Use of Grammar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : c.slug === "exams" ? (
                  <Image
                    src="/international-exams.png"
                    alt="International Exams"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  c.icon
                )}
              </div>
              <p className="text-white text-xs font-medium leading-tight group-hover:text-white/90">
                {c.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
