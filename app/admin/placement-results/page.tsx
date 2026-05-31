import { createAdminClient } from "@/lib/supabase/admin";
import PlacementResultsTable from "@/components/admin/PlacementResultsTable";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function AdminPlacementResultsPage() {
  // Get current user from session (middleware already validated access)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Load results via service role (bypasses RLS)
  const adminSupabase = createAdminClient();
  const { data: results, error } = await adminSupabase
    .from("placement_test_results")
    .select(
      "id, student_name, email, phone, age, objective, raw_score, max_score, percentage, cefr_level, writing_answer, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          Erro ao carregar resultados: {error.message}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-[#111111] border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-wind-plus.png" alt="Wind Plus" width={32} height={32}
              className="h-8 w-8 object-contain brightness-0 invert" />
            <span className="text-white font-bold tracking-tight">Wind Plus</span>
            <span className="hidden sm:block text-gray-500 text-xs ml-2 border-l border-gray-700 pl-2">
              Painel Administrativo
            </span>
          </div>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111111]">Resultados do Teste de Nivelamento</h1>
          <p className="text-sm text-gray-400 mt-1">{results?.length ?? 0} respostas recebidas</p>
        </div>
        <PlacementResultsTable results={results ?? []} />
      </div>
    </main>
  );
}
