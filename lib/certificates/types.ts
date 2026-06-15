export type CertificateStatus = "active" | "revoked" | "expired";

export interface Certificate {
  id: string;
  student_name: string;
  student_email: string;
  course_name: string;
  course_level: string;
  workload: string;
  teacher_name: string;
  issue_date: string;          // ISO date string YYYY-MM-DD
  certificate_code: string;
  validation_url: string;
  status: CertificateStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface CreateCertificateInput {
  student_name: string;
  student_email: string;
  course_name: string;
  course_level: string;
  workload: string;
  teacher_name: string;
  issue_date: string;
  notes?: string;
}

export const WIND_PLUS_COURSES = [
  "Wind Plus Starter",
  "Wind Plus Basic Communication",
  "Wind Plus Elementary Plus",
  "Wind Plus Intermediate Conversation",
  "Wind Plus Upper-Intermediate",
  "Wind Plus Advanced Fluency",
  "Wind Plus Business English Track",
  "Wind Plus Exam Preparation Track",
] as const;

export const CEFR_LEVELS = [
  "Starter / Pre-A1",
  "A1 — Elementary",
  "A2 — Pre-Intermediate",
  "B1 — Intermediate",
  "B2 — Upper-Intermediate",
  "C1 — Advanced",
  "C2 — Proficiency",
] as const;

export const STATUS_LABELS: Record<CertificateStatus, string> = {
  active: "Válido",
  revoked: "Revogado",
  expired: "Expirado",
};

export const STATUS_COLORS: Record<CertificateStatus, string> = {
  active:  "bg-green-100 text-green-800 border-green-300",
  revoked: "bg-red-100 text-red-800 border-red-300",
  expired: "bg-gray-100 text-gray-600 border-gray-300",
};
