import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import PlacementResultsTable from "@/components/admin/PlacementResultsTable";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

async function getAuthenticatedAdminEmail(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) return null;

    const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
    return allowed.includes(user.email.toLowerCase()) ? user.email : null;
  } catch {
    return null;
  }
}

export default async function AdminPlacementResultsPage() {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: results, error } = await supabase
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resultados do Teste de Nivelamento</h1>
            <p className="text-sm text-gray-500 mt-1">Wind Plus — Painel Administrativo</p>
          </div>
          <span className="text-xs text-gray-400">{adminEmail}</span>
        </div>

        <PlacementResultsTable results={results ?? []} />
      </div>
    </main>
  );
}
