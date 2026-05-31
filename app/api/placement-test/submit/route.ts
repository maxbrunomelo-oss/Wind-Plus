import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { placementSubmitSchema } from "@/lib/placement/validation";
import { calculatePlacementResult } from "@/lib/placement/scoring";
import { createAdminClient } from "@/lib/supabase/admin";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.NEXT_PUBLIC_SITE_URL ?? "")).digest("hex").slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = placementSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Validate minor consent
    if (data.age && data.age < 18 && !data.responsibleConsent) {
      return NextResponse.json(
        { error: "Para menores de idade, é necessário autorização do responsável legal." },
        { status: 400 }
      );
    }

    // Server-side scoring (never trust client calculation)
    const result = calculatePlacementResult(data.objectiveAnswers, data.objective);

    // Collect metadata
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash = hashIp(ip);

    // Persist to Supabase using service role (server-side only)
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from("placement_test_results").insert({
      student_name: data.studentName,
      email: data.email,
      phone: data.phone,
      age: data.age ?? null,
      objective: data.objective ?? null,
      self_declared_level: data.selfDeclaredLevel ?? null,
      consent_accepted: data.consentAccepted,
      responsible_consent: data.responsibleConsent ?? false,
      objective_answers: data.objectiveAnswers,
      writing_answer: data.writingAnswer ?? null,
      raw_score: result.rawScore,
      max_score: result.maxScore,
      percentage: result.percentage,
      cefr_level: result.cefrLevel,
      cefr_band_breakdown: result.bandBreakdown,
      diagnostic_summary: result.diagnosticSummary,
      recommended_course: result.recommendedCourse,
      source: "website",
      user_agent: userAgent,
      ip_hash: ipHash,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
      return NextResponse.json({ error: "Erro ao salvar resultado. Tente novamente." }, { status: 500 });
    }

    // Return result without exposing the answer key
    return NextResponse.json({
      result: {
        cefrLevel: result.cefrLevel,
        percentage: result.percentage,
        rawScore: result.rawScore,
        maxScore: result.maxScore,
        diagnosticSummary: result.diagnosticSummary,
        recommendedCourse: result.recommendedCourse,
        bandBreakdown: result.bandBreakdown,
      },
    });
  } catch (err) {
    console.error("Placement test submit error:", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
