import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { CertificateStatus } from "@/lib/certificates/types";
import { z } from "zod";

async function getAdminUser(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => req.cookies.getAll(), setAll: () => {} } }
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return null;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(user.email.toLowerCase()) ? user : null;
}

const patchSchema = z.object({
  status: z.enum(["active", "revoked", "expired"]),
  notes: z.string().max(1000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const updatePayload: { status: CertificateStatus; notes?: string } = {
    status: parsed.data.status,
  };
  if (parsed.data.notes !== undefined) updatePayload.notes = parsed.data.notes;

  const { data, error } = await supabase
    .from("certificates")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Erro ao atualizar certificado." }, { status: 500 });
  }

  return NextResponse.json({ certificate: data });
}
