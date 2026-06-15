import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import WindPlusWordmark from "@/components/ui/WindPlusWordmark";

export const dynamic = "force-dynamic";

export default async function AdminHubPage() {
  // Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",").map((e) => e.trim().toLowerCase());
  if (!allowed.includes(user.email?.toLowerCase() ?? "")) redirect("/admin/login");

  // Counts (service role, best-effort)
  const admin = createAdminClient();
  const [placements, certs, students] = await Promise.all([
    admin.from("placement_test_results").select("id", { count: "exact", head: true }),
    admin.from("certificates").select("id", { count: "exact", head: true }),
    admin.from("wind_students").select("id", { count: "exact", head: true }),
  ]);

  const platforms = [
    {
      href: "/admin/placement-results",
      emoji: "📊",
      title: "Resultados do Teste",
      desc: "Respostas do teste de nivelamento",
      count: placements.count ?? 0,
      countLabel: "respostas",
      accent: "from-blue-500/10 to-blue-500/0 border-blue-100",
    },
    {
      href: "/admin/certificates",
      emoji: "🎓",
      title: "Certificados",
      desc: "Emissão e validação de certificados",
      count: certs.count ?? 0,
      countLabel: "emitidos",
      accent: "from-amber-500/10 to-amber-500/0 border-amber-100",
    },
    {
      href: "/wind-os/dashboard",
      emoji: "🅦",
      title: "Wind OS",
      desc: "Student & Finance Intelligence Platform",
      count: students.count ?? 0,
      countLabel: "alunos",
      accent: "from-[#E30613]/10 to-[#E30613]/0 border-red-100",
    },
  ];

  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Top bar */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-wind-plus.png" alt="Wind Plus" width={32} height={32}
              className="h-8 w-8 object-contain brightness-0 invert" />
            <WindPlusWordmark size="text-sm" windColor="text-white" plusColor="text-[#E30613]" />
            <span className="hidden sm:block text-gray-500 text-xs ml-2 border-l border-gray-700 pl-2">
              Central de plataformas
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{user.email}</span>
            <Link href="/admin/login"
              className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition-colors">
              Sair
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Qual plataforma deseja acessar?</h1>
          <p className="text-sm text-gray-400 mt-2">Escolha uma das interfaces abaixo para continuar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <Link key={p.href} href={p.href}
              className={`group bg-gradient-to-b ${p.accent} bg-white rounded-2xl border p-6 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
              <div className="text-3xl mb-4">{p.emoji}</div>
              <h2 className="text-lg font-bold text-[#111111]">{p.title}</h2>
              <p className="text-sm text-gray-500 mt-1 flex-1">{p.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  <strong className="text-[#111111] text-sm">{p.count}</strong> {p.countLabel}
                </span>
                <span className="text-sm font-semibold text-[#E30613] group-hover:translate-x-0.5 transition-transform">
                  Abrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
