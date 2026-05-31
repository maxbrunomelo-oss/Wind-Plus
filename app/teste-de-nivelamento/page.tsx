import type { Metadata } from "next";
import PlacementTestForm from "@/components/placement/PlacementTestForm";

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Em breve</h1>
          <p className="text-gray-500">O teste de nivelamento estará disponível em breve.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo / brand header */}
        <div className="text-center mb-10">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight">Wind Plus</span>
          <p className="text-gray-500 text-xs mt-1">Escola de Inglês</p>
        </div>

        <PlacementTestForm />
      </div>
    </main>
  );
}
