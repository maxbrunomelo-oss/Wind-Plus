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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-wind-plus-hd.png"
              alt="Wind Plus"
              width={56}
              height={56}
              priority
              className="h-14 w-14 object-contain"
            />
            <span className="text-[11px] text-gray-400 uppercase tracking-widest">Escola de Inglês</span>
          </div>
          <span className="hidden sm:inline-block text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Teste de Nivelamento CEFR
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-10 px-4">
        <PlacementTestForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-5 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Wind Plus. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
