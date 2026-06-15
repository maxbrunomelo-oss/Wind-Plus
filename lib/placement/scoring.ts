import { CefrLevel, placementQuestions } from "./cefrQuestions";

export type BandStats = {
  correct: number;
  total: number;
  percentage: number;
};

export type PlacementResult = {
  rawScore: number;
  maxScore: number;
  percentage: number;
  cefrLevel: CefrLevel;
  bandBreakdown: Record<CefrLevel, BandStats>;
  diagnosticSummary: string;
  recommendedCourse: string;
};

const LEVEL_ORDER: CefrLevel[] = ["starter", "A1", "A2", "B1", "B2", "C1"];

const diagnosticMessages: Record<CefrLevel, string> = {
  starter:
    "Seu resultado indica um nível inicial de inglês. Você reconhece algumas palavras e estruturas, mas ainda precisa construir uma base comunicativa com segurança.",
  A1: "Seu resultado indica nível A1. Você já compreende e usa estruturas simples para se apresentar, falar sobre informações pessoais e interagir em situações muito básicas.",
  A2: "Seu resultado indica nível A2. Você consegue lidar com situações simples do cotidiano, compreender frases frequentes e se comunicar em contextos previsíveis.",
  B1: "Seu resultado indica nível B1. Você já consegue manter conversas sobre temas familiares, experiências, trabalho, estudos e situações do dia a dia com certa autonomia.",
  B2: "Seu resultado indica nível B2. Você demonstra boa autonomia para compreender textos mais complexos, explicar opiniões, argumentar e interagir em diferentes situações.",
  C1: "Seu resultado indica nível C1. Você demonstra domínio avançado da língua, com boa compreensão de ideias implícitas, repertório amplo e capacidade de comunicação mais sofisticada.",
};

function getCourseRecommendation(level: CefrLevel, objective?: string): string {
  const obj = objective?.toLowerCase() ?? "";

  const isBusinessObjective =
    obj.includes("business") || obj.includes("profissional") || obj.includes("entrevista") || obj.includes("atendimento");
  const isExamObjective =
    obj.includes("exam") || obj.includes("certificaç") || obj.includes("internacional");

  if (isBusinessObjective && ["B1", "B2", "C1"].includes(level)) {
    return "Wind Plus Business English Track";
  }
  if (isExamObjective && ["B1", "B2", "C1"].includes(level)) {
    return "Wind Plus Exam Preparation Track";
  }

  const courses: Record<CefrLevel, string> = {
    starter: "Wind Plus Starter",
    A1: "Wind Plus Basic Communication",
    A2: "Wind Plus Elementary Plus",
    B1: "Wind Plus Intermediate Conversation",
    B2: "Wind Plus Upper-Intermediate / Business English",
    C1: "Wind Plus Advanced Fluency / Exam Preparation",
  };

  return courses[level];
}

export function calculatePlacementResult(
  answers: Record<string, string>,
  objective?: string
): PlacementResult {
  const bandStats: Record<CefrLevel, BandStats> = {
    starter: { correct: 0, total: 0, percentage: 0 },
    A1: { correct: 0, total: 0, percentage: 0 },
    A2: { correct: 0, total: 0, percentage: 0 },
    B1: { correct: 0, total: 0, percentage: 0 },
    B2: { correct: 0, total: 0, percentage: 0 },
    C1: { correct: 0, total: 0, percentage: 0 },
  };

  let rawScore = 0;
  let maxScore = 0;

  for (const question of placementQuestions) {
    const band = bandStats[question.cefrLevel];
    band.total += 1;
    maxScore += question.points;

    if (answers[question.id] === question.correctOptionId) {
      band.correct += 1;
      rawScore += question.points;
    }
  }

  // Calculate percentages per band
  for (const level of LEVEL_ORDER) {
    const band = bandStats[level];
    band.percentage = band.total > 0 ? Math.round((band.correct / band.total) * 100) : 0;
  }

  const percentage = Math.round((rawScore / maxScore) * 100);

  // Initial classification by percentage
  let cefrLevel: CefrLevel = "starter";
  if (percentage >= 85) cefrLevel = "C1";
  else if (percentage >= 70) cefrLevel = "B2";
  else if (percentage >= 53) cefrLevel = "B1";
  else if (percentage >= 35) cefrLevel = "A2";
  else if (percentage >= 20) cefrLevel = "A1";
  else cefrLevel = "starter";

  // Consistency check: don't classify above a level if lower bands are weak
  if (cefrLevel === "C1" && bandStats.B2.percentage < 50) {
    cefrLevel = "B2";
  }
  if (cefrLevel === "B2" && bandStats.B1.percentage < 45) {
    cefrLevel = "B1";
  }
  if (cefrLevel === "B1" && bandStats.A2.percentage < 40) {
    cefrLevel = "A2";
  }

  // Upward check: if lower bands are very strong, consider one level up
  const finalIdx = LEVEL_ORDER.indexOf(cefrLevel);
  if (
    finalIdx < LEVEL_ORDER.length - 1 &&
    bandStats[cefrLevel].percentage >= 85 &&
    bandStats[LEVEL_ORDER[finalIdx + 1]].percentage >= 55
  ) {
    cefrLevel = LEVEL_ORDER[finalIdx + 1];
  }

  return {
    rawScore,
    maxScore,
    percentage,
    cefrLevel,
    bandBreakdown: bandStats,
    diagnosticSummary: diagnosticMessages[cefrLevel],
    recommendedCourse: getCourseRecommendation(cefrLevel, objective),
  };
}
