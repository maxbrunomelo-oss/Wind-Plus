import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildCsv, resultsToCsvRows } from "@/lib/placement/csv";
import { createServerClient } from "@supabase/ssr";

async function getAdminEmailFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll() {},
        },
      }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email) return null;
    const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
    return allowed.includes(user.email.toLowerCase()) ? user.email : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const adminEmail = await getAdminEmailFromRequest(req);
  if (!adminEmail) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("placement_test_results")
    .select(
      "created_at, student_name, email, phone, age, objective, self_declared_level, raw_score, max_score, percentage, cefr_level, recommended_course, writing_answer"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar dados." }, { status: 500 });
  }

  const csv = buildCsv(resultsToCsvRows(data ?? []));

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wind-plus-placement-results.csv"',
    },
  });
}
