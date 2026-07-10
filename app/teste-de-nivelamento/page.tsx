import type { Metadata } from "next";
import Image from "next/image";
import PlacementTestForm from "@/components/placement/PlacementTestForm";
import WindPlusWordmark from "@/components/ui/WindPlusWordmark";

export const metadata: Metadata = {
  title: "Teste de Nivelamento de Inglês | Wind Plus",
  description:
    "Descubra seu nível de inglês com o teste diagnóstico baseado no CEFR da Wind Plus. Gratuito e orientado para sua melhor turma.",
};

export default function PlacementTestPage() {
  const enabled = process.env.NEXT_PUBLIC_PLACEMENT_TEST_ENABLED === "true";

  if (!enabled) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-[#111111] mb-2">Em breve</h1>
          <p className="text-gray-500">O teste de nivelamento estará disponível em breve.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">

      {/* ── Header premium dark ─────────────────────────────────────── */}
      <header className="relative z-50 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-wind-plus-hd.png"
              alt="Wind Plus"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
            <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.22em]">
              Escola de Inglês
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/30 border border-white/[0.08] px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] animate-pulse shrink-0" />
            Teste de Nivelamento CEFR
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <PlacementTestForm />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-5 text-center">
        <p className="text-[11px] text-white/15">
          © {new Date().getFullYear()} Wind Plus · Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
