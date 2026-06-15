// ============================================================
// Wind OS — Camada de dados (Supabase, server-side)
// Substitui lib/windos/mock-data.ts. Mapeia colunas snake_case
// do banco para os tipos camelCase da aplicação.
// ============================================================
import { createClient } from '@/utils/supabase/server';
import type {
  Student, Guardian, Teacher, SchoolClass, Enrollment,
  Payment, StudentLog, PedagogicalReport, Alert,
} from './types';

const und = <T>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

// ─── Mappers ──────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
const mapTeacher = (r: any): Teacher => ({
  id: r.id, name: r.name, email: r.email, whatsapp: r.whatsapp,
  status: r.status, notes: und(r.notes),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapClass = (r: any): SchoolClass => ({
  id: r.id, name: r.name, modalidade: r.modalidade, teacherId: r.teacher_id,
  cefrLevel: r.cefr_level, weekdays: r.weekdays ?? [], schedule: r.schedule ?? '',
  status: r.status, notes: und(r.notes),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapStudent = (r: any): Student => ({
  id: r.id, fullName: r.full_name, birthDate: und(r.birth_date), cpf: und(r.cpf),
  email: r.email, whatsapp: r.whatsapp, modalidade: r.modalidade, status: r.status,
  cefrLevel: r.cefr_level, teacherId: und(r.teacher_id), classId: und(r.class_id),
  startDate: r.start_date, goal: und(r.goal), interests: und(r.interests),
  pedagogicalNotes: und(r.pedagogical_notes),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapEnrollment = (r: any): Enrollment => ({
  id: r.id, studentId: r.student_id, classId: r.class_id, startDate: r.start_date,
  endDate: und(r.end_date), status: r.status, monthlyAmount: Number(r.monthly_amount),
  dueDay: r.due_day, paymentMethod: r.payment_method,
  discountAmount: Number(r.discount_amount), notes: und(r.notes),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapPayment = (r: any): Payment => ({
  id: r.id, studentId: r.student_id, enrollmentId: r.enrollment_id ?? '',
  referenceMonth: r.reference_month, description: r.description,
  amount: Number(r.amount), discountAmount: Number(r.discount_amount),
  finalAmount: Number(r.final_amount), dueDate: r.due_date,
  paymentDate: und(r.payment_date), paymentMethod: und(r.payment_method),
  status: r.status, receiptUrl: und(r.receipt_url), notes: und(r.notes),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapLog = (r: any): StudentLog => ({
  id: r.id, studentId: r.student_id, authorId: r.author_id ?? '',
  logType: r.log_type, title: r.title, content: r.content, sentiment: r.sentiment,
  nextAction: und(r.next_action), nextActionDate: und(r.next_action_date),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapReport = (r: any): PedagogicalReport => ({
  id: r.id, studentId: r.student_id, teacherId: r.teacher_id ?? '',
  referencePeriod: r.reference_period, cefrLevel: r.cefr_level,
  speakingProgress: r.speaking_progress, listeningProgress: r.listening_progress,
  readingProgress: r.reading_progress, writingProgress: r.writing_progress,
  strengths: und(r.strengths), improvementPoints: und(r.improvement_points),
  teacherComments: und(r.teacher_comments), recommendations: und(r.recommendations),
  status: r.status, createdAt: r.created_at, updatedAt: r.updated_at,
});

const mapAlert = (r: any): Alert => ({
  id: r.id, studentId: r.student_id, alertType: r.alert_type, title: r.title,
  description: r.description, priority: r.priority, status: r.status,
  dueDate: und(r.due_date), createdAt: r.created_at, updatedAt: r.updated_at,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Fetchers (coleções) ──────────────────────────────────────
export async function getTeachers(): Promise<Teacher[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_teachers').select('*').order('name');
  return (data ?? []).map(mapTeacher);
}

export async function getClasses(): Promise<SchoolClass[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_classes').select('*').order('name');
  return (data ?? []).map(mapClass);
}

export async function getStudents(): Promise<Student[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_students').select('*').order('full_name');
  return (data ?? []).map(mapStudent);
}

export async function getGuardians(): Promise<Guardian[]> {
  const sb = await createClient();
  const [{ data: gs }, { data: links }] = await Promise.all([
    sb.from('wind_guardians').select('*').order('name'),
    sb.from('wind_student_guardians').select('student_id, guardian_id'),
  ]);
  const byGuardian = new Map<string, string[]>();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  (links ?? []).forEach((l: any) => {
    const arr = byGuardian.get(l.guardian_id) ?? [];
    arr.push(l.student_id);
    byGuardian.set(l.guardian_id, arr);
  });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (gs ?? []).map((r: any): Guardian => ({
    id: r.id, name: r.name, relationship: r.relationship, whatsapp: r.whatsapp,
    email: und(r.email), cpf: und(r.cpf), address: und(r.address), notes: und(r.notes),
    studentIds: byGuardian.get(r.id) ?? [],
    createdAt: r.created_at, updatedAt: r.updated_at,
  }));
}

export async function getEnrollments(): Promise<Enrollment[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_enrollments').select('*');
  return (data ?? []).map(mapEnrollment);
}

export async function getPayments(): Promise<Payment[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_payments').select('*').order('due_date');
  return (data ?? []).map(mapPayment);
}

export async function getStudentLogs(): Promise<StudentLog[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_student_logs').select('*').order('created_at', { ascending: false });
  return (data ?? []).map(mapLog);
}

export async function getPedagogicalReports(): Promise<PedagogicalReport[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_pedagogical_reports').select('*').order('created_at', { ascending: false });
  return (data ?? []).map(mapReport);
}

export async function getAlerts(): Promise<Alert[]> {
  const sb = await createClient();
  const { data } = await sb.from('wind_alerts').select('*');
  return (data ?? []).map(mapAlert);
}

export async function getStudent(id: string): Promise<Student | null> {
  const sb = await createClient();
  const { data } = await sb.from('wind_students').select('*').eq('id', id).maybeSingle();
  return data ? mapStudent(data) : null;
}

// ─── Helpers de nomes (mapas) ─────────────────────────────────
export const nameMap = <T extends { id: string }>(arr: T[], field: (t: T) => string): Record<string, string> =>
  Object.fromEntries(arr.map(t => [t.id, field(t)]));

// ─── Dashboard ────────────────────────────────────────────────
export interface DashboardStats {
  totalAtivos: number; online: number; presencial: number;
  previsto: number; recebido: number; pendente: number; atrasado: number;
  inadimplencia: number; novos: number; cancelamentos: number; emRisco: number;
}

export function computeDashboardStats(
  students: Student[], payments: Payment[], alerts: Alert[],
): DashboardStats {
  const active = students.filter(s => ['ATIVO', 'INADIMPLENTE', 'EXPERIMENTAL'].includes(s.status));
  const online = active.filter(s => s.modalidade === 'ONLINE').length;
  const presencial = active.filter(s => s.modalidade === 'PRESENCIAL').length;

  const billable = payments.filter(p => p.status !== 'CANCELADO');
  const previsto = billable.reduce((s, p) => s + p.finalAmount, 0);
  const recebido = payments.filter(p => p.status === 'PAGO').reduce((s, p) => s + p.finalAmount, 0);
  const pendente = payments.filter(p => p.status === 'PENDENTE').reduce((s, p) => s + p.finalAmount, 0);
  const atrasado = payments.filter(p => p.status === 'ATRASADO').reduce((s, p) => s + p.finalAmount, 0);

  const overdueStudents = new Set(payments.filter(p => p.status === 'ATRASADO').map(p => p.studentId));
  const inadimplencia = active.length ? (overdueStudents.size / active.length) * 100 : 0;

  const novos = students.filter(s => s.startDate >= '2026-06-01').length;
  const cancelamentos = students.filter(s => s.status === 'CANCELADO' && s.updatedAt >= '2026-05-01').length;
  const emRisco = new Set(alerts.filter(a => (a.priority === 'ALTA' || a.priority === 'CRITICA') && a.status !== 'RESOLVIDO').map(a => a.studentId)).size;

  return {
    totalAtivos: active.length, online, presencial,
    previsto, recebido, pendente, atrasado,
    inadimplencia: Math.round(inadimplencia), novos, cancelamentos, emRisco,
  };
}

// Evolução de receita / inadimplência (ilustrativos — séries históricas)
export const revenueEvolution = [
  { label: 'Jan', previsto: 3200, recebido: 3050 },
  { label: 'Fev', previsto: 3400, recebido: 3300 },
  { label: 'Mar', previsto: 3600, recebido: 3450 },
  { label: 'Abr', previsto: 3700, recebido: 3600 },
  { label: 'Mai', previsto: 3700, recebido: 3550 },
  { label: 'Jun', previsto: 3700, recebido: 1480 },
];

export const inadimplenciaEvolution = [
  { label: 'Jan', value: 5 }, { label: 'Fev', value: 4 }, { label: 'Mar', value: 6 },
  { label: 'Abr', value: 5 }, { label: 'Mai', value: 8 }, { label: 'Jun', value: 22 },
];
