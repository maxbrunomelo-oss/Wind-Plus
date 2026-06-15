import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Certificate } from "@/lib/certificates/types";
import AdminHeader from "@/components/admin/AdminHeader";
import CertificateForm from "@/components/admin/CertificateForm";
import CertificateTableWrapper from "@/components/admin/CertificateTableWrapper";

export default async function AdminCertificatesPage() {
  // Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",").map((e) => e.trim().toLowerCase());
  if (!allowed.includes(user.email?.toLowerCase() ?? "")) redirect("/admin/login");

  // Load certificates
  const adminSupabase = createAdminClient();
  const { data: certificates, error } = await adminSupabase
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <AdminHeader userEmail={user.email} activeTab="certificates" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            Erro ao carregar certificados: {error.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminHeader userEmail={user.email} activeTab="certificates" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111111]">Certificados</h1>
          <p className="text-sm text-gray-400 mt-1">
            {certificates?.length ?? 0} certificado(s) emitido(s)
          </p>
        </div>

        <CertificateTableWrapper
          initialCertificates={(certificates ?? []) as Certificate[]}
        />
      </div>
    </main>
  );
}
