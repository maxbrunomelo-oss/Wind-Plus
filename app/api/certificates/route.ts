import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCertificateCode, buildValidationUrl } from "@/lib/certificates/generateCode";
import { CreateCertificateInput } from "@/lib/certificates/types";
import { z } from "zod";

// ── Auth helper ───────────────────────────────────────────────────────────

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

// ── Validation schema ─────────────────────────────────────────────────────

const createSchema = z.object({
  student_name:   z.string().min(2).max(200),
  student_email:  z.string().email(),
  course_name:    z.string().min(2).max(200),
  course_level:   z.string().min(1).max(100),
  workload:       z.string().min(1).max(100),
  teacher_name:   z.string().min(2).max(200),
  issue_date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  notes:          z.string().max(1000).optional(),
});

// ── POST /api/certificates — create ──────────────────────────────────────

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data as CreateCertificateInput;

  // Generate unique code — retry up to 5 times on collision
  const supabase = createAdminClient();
  let code = "";
  let validationUrl = "";

  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateCertificateCode();
    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("certificate_code", code)
      .maybeSingle();
    if (!existing) break;
    if (attempt === 4) {
      return NextResponse.json({ error: "Não foi possível gerar código único. Tente novamente." }, { status: 500 });
    }
  }

  validationUrl = buildValidationUrl(code);

  const { data: cert, error } = await supabase
    .from("certificates")
    .insert({
      student_name:     data.student_name,
      student_email:    data.student_email,
      course_name:      data.course_name,
      course_level:     data.course_level,
      workload:         data.workload,
      teacher_name:     data.teacher_name,
      issue_date:       data.issue_date,
      certificate_code: code,
      validation_url:   validationUrl,
      status:           "active",
      notes:            data.notes?.trim() || null,
      created_by:       admin.email,
    })
    .select()
    .single();

  if (error) {
    console.error("Certificate insert error:", error.message);
    return NextResponse.json({ error: "Erro ao criar certificado." }, { status: 500 });
  }

  return NextResponse.json({ certificate: cert }, { status: 201 });
}

// ── GET /api/certificates — list (admin only) ────────────────────────────

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar certificados." }, { status: 500 });
  }

  return NextResponse.json({ certificates: data });
}
