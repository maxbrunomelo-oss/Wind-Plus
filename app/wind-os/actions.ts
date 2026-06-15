'use server';
// ============================================================
// Wind OS — Server Actions (CRUD)
// Auth: exige usuário autenticado e e-mail em ADMIN_EMAILS.
// Escrita via service-role (bypassa RLS de forma controlada).
// ============================================================
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type Result = { ok: boolean; error?: string };
type Values = Record<string, string | string[]>;

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(',') : (v ?? '')).trim();
const orNull = (v: string | string[] | undefined) => { const s = str(v); return s === '' ? null : s; };
const num = (v: string | string[] | undefined) => { const s = str(v); return s === '' ? 0 : Number(s.replace(',', '.')); };
const arr = (v: string | string[] | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { admin: null, error: 'Sessão expirada. Faça login novamente.' };
  const allowed = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase());
  if (!allowed.includes(user.email?.toLowerCase() ?? '')) {
    return { admin: null, error: 'Sem permissão para esta ação.' };
  }
  return { admin: createAdminClient(), error: null as string | null };
}

function refresh() {
  for (const p of [
    '/wind-os/dashboard', '/wind-os/students', '/wind-os/teachers', '/wind-os/guardians',
    '/wind-os/classes', '/wind-os/enrollments', '/wind-os/finance', '/wind-os/alerts',
    '/wind-os/student-logs', '/wind-os/pedagogical-reports',
  ]) revalidatePath(p);
}

// ── TEACHERS ──────────────────────────────────────────────────
export async function saveTeacher(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    name: str(values.name), email: str(values.email), whatsapp: str(values.whatsapp),
    status: str(values.status) || 'ATIVO', notes: orNull(values.notes),
  };
  const q = id ? admin.from('wind_teachers').update(payload).eq('id', id) : admin.from('wind_teachers').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── STUDENTS ──────────────────────────────────────────────────
export async function saveStudent(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    full_name: str(values.fullName), email: str(values.email), whatsapp: str(values.whatsapp),
    birth_date: orNull(values.birthDate), cpf: orNull(values.cpf),
    modalidade: str(values.modalidade) || 'ONLINE', status: str(values.status) || 'EXPERIMENTAL',
    cefr_level: str(values.cefrLevel) || 'A1',
    teacher_id: orNull(values.teacherId), class_id: orNull(values.classId),
    start_date: str(values.startDate) || new Date().toISOString().slice(0, 10),
    goal: orNull(values.goal), interests: orNull(values.interests),
    pedagogical_notes: orNull(values.pedagogicalNotes),
  };
  const q = id ? admin.from('wind_students').update(payload).eq('id', id) : admin.from('wind_students').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── GUARDIANS ─────────────────────────────────────────────────
export async function saveGuardian(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    name: str(values.name), relationship: str(values.relationship), whatsapp: str(values.whatsapp),
    email: orNull(values.email), cpf: orNull(values.cpf), address: orNull(values.address), notes: orNull(values.notes),
  };
  let guardianId = id;
  if (id) {
    const { error: e } = await admin.from('wind_guardians').update(payload).eq('id', id);
    if (e) return { ok: false, error: e.message };
  } else {
    const { data, error: e } = await admin.from('wind_guardians').insert(payload).select('id').single();
    if (e) return { ok: false, error: e.message };
    guardianId = data.id;
  }
  // Re-link students
  const studentIds = arr(values.studentIds);
  await admin.from('wind_student_guardians').delete().eq('guardian_id', guardianId);
  if (studentIds.length) {
    const links = studentIds.map(sid => ({ guardian_id: guardianId, student_id: sid }));
    const { error: le } = await admin.from('wind_student_guardians').insert(links);
    if (le) return { ok: false, error: le.message };
  }
  refresh();
  return { ok: true };
}

// ── CLASSES ───────────────────────────────────────────────────
export async function saveClass(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    name: str(values.name), modalidade: str(values.modalidade) || 'ONLINE',
    teacher_id: orNull(values.teacherId), cefr_level: str(values.cefrLevel) || 'A1',
    weekdays: arr(values.weekdays), schedule: orNull(values.schedule),
    status: str(values.status) || 'ATIVO', notes: orNull(values.notes),
  };
  const q = id ? admin.from('wind_classes').update(payload).eq('id', id) : admin.from('wind_classes').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── ENROLLMENTS ───────────────────────────────────────────────
export async function saveEnrollment(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    student_id: str(values.studentId), class_id: str(values.classId),
    start_date: str(values.startDate) || new Date().toISOString().slice(0, 10),
    end_date: orNull(values.endDate), status: str(values.status) || 'ATIVA',
    monthly_amount: num(values.monthlyAmount), due_day: Number(str(values.dueDay) || '5'),
    payment_method: str(values.paymentMethod) || 'PIX', discount_amount: num(values.discountAmount),
    notes: orNull(values.notes),
  };
  if (!payload.student_id || !payload.class_id) return { ok: false, error: 'Selecione o aluno e a turma.' };
  const q = id ? admin.from('wind_enrollments').update(payload).eq('id', id) : admin.from('wind_enrollments').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  // Espelha turma/professor no aluno
  if (!id) {
    const { data: cls } = await admin.from('wind_classes').select('teacher_id').eq('id', payload.class_id).maybeSingle();
    await admin.from('wind_students').update({
      class_id: payload.class_id, teacher_id: cls?.teacher_id ?? null,
      status: 'ATIVO',
    }).eq('id', payload.student_id);
  }
  refresh();
  return { ok: true };
}

// ── PAYMENTS ──────────────────────────────────────────────────
export async function savePayment(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    student_id: str(values.studentId), enrollment_id: orNull(values.enrollmentId),
    reference_month: str(values.referenceMonth), description: str(values.description) || 'Mensalidade',
    amount: num(values.amount), discount_amount: num(values.discountAmount),
    due_date: str(values.dueDate), payment_method: orNull(values.paymentMethod),
    status: str(values.status) || 'PENDENTE', notes: orNull(values.notes),
  };
  if (!payload.student_id || !payload.due_date) return { ok: false, error: 'Aluno e data de vencimento são obrigatórios.' };
  const q = id ? admin.from('wind_payments').update(payload).eq('id', id) : admin.from('wind_payments').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

export async function markPaymentPaid(id: string, method = 'PIX'): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const { error: e } = await admin.from('wind_payments').update({
    status: 'PAGO', payment_date: new Date().toISOString().slice(0, 10), payment_method: method,
  }).eq('id', id);
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// Gera mensalidades do mês para todas as matrículas ativas (idempotente por enrollment+mês)
export async function generateMonthlyPayments(referenceMonth: string): Promise<Result & { created?: number }> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  if (!/^\d{4}-\d{2}$/.test(referenceMonth)) return { ok: false, error: 'Mês de referência inválido (use AAAA-MM).' };

  const { data: enrolls, error: ee } = await admin.from('wind_enrollments').select('*').eq('status', 'ATIVA');
  if (ee) return { ok: false, error: ee.message };

  const { data: existing } = await admin.from('wind_payments').select('enrollment_id').eq('reference_month', referenceMonth);
  const done = new Set((existing ?? []).map((p: { enrollment_id: string | null }) => p.enrollment_id));

  const rows = (enrolls ?? [])
    .filter(en => !done.has(en.id))
    .map(en => {
      const day = String(Math.min(Math.max(en.due_day ?? 5, 1), 28)).padStart(2, '0');
      return {
        student_id: en.student_id, enrollment_id: en.id, reference_month: referenceMonth,
        description: `Mensalidade ${referenceMonth}`, amount: en.monthly_amount,
        discount_amount: en.discount_amount ?? 0, due_date: `${referenceMonth}-${day}`,
        payment_method: en.payment_method, status: 'PENDENTE',
      };
    });

  if (rows.length === 0) { refresh(); return { ok: true, created: 0 }; }
  const { error: ie } = await admin.from('wind_payments').insert(rows);
  if (ie) return { ok: false, error: ie.message };
  refresh();
  return { ok: true, created: rows.length };
}

// ── STUDENT LOGS ──────────────────────────────────────────────
export async function saveStudentLog(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    student_id: str(values.studentId), log_type: str(values.logType) || 'OBSERVACAO',
    title: str(values.title), content: str(values.content), sentiment: str(values.sentiment) || 'NEUTRO',
    next_action: orNull(values.nextAction), next_action_date: orNull(values.nextActionDate),
  };
  if (!payload.student_id || !payload.title) return { ok: false, error: 'Aluno e título são obrigatórios.' };
  const q = id ? admin.from('wind_student_logs').update(payload).eq('id', id) : admin.from('wind_student_logs').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── ALERTS ────────────────────────────────────────────────────
export async function saveAlert(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    student_id: str(values.studentId), alert_type: str(values.alertType) || 'OUTRO',
    title: str(values.title), description: str(values.description),
    priority: str(values.priority) || 'MEDIA', status: str(values.status) || 'ABERTO',
    due_date: orNull(values.dueDate),
  };
  if (!payload.student_id || !payload.title) return { ok: false, error: 'Aluno e título são obrigatórios.' };
  const q = id ? admin.from('wind_alerts').update(payload).eq('id', id) : admin.from('wind_alerts').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

export async function setAlertStatus(id: string, status: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const { error: e } = await admin.from('wind_alerts').update({ status }).eq('id', id);
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── PEDAGOGICAL REPORTS ───────────────────────────────────────
export async function saveReport(values: Values, id?: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const payload = {
    student_id: str(values.studentId), teacher_id: orNull(values.teacherId),
    reference_period: str(values.referencePeriod), cefr_level: str(values.cefrLevel) || 'A1',
    speaking_progress: Number(str(values.speakingProgress) || '0'),
    listening_progress: Number(str(values.listeningProgress) || '0'),
    reading_progress: Number(str(values.readingProgress) || '0'),
    writing_progress: Number(str(values.writingProgress) || '0'),
    strengths: orNull(values.strengths), improvement_points: orNull(values.improvementPoints),
    teacher_comments: orNull(values.teacherComments), recommendations: orNull(values.recommendations),
    status: str(values.status) || 'RASCUNHO',
  };
  if (!payload.student_id) return { ok: false, error: 'Selecione o aluno.' };
  const q = id ? admin.from('wind_pedagogical_reports').update(payload).eq('id', id) : admin.from('wind_pedagogical_reports').insert(payload);
  const { error: e } = await q;
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── DELETE (genérico) ─────────────────────────────────────────
const DELETABLE: Record<string, string> = {
  teacher: 'wind_teachers', student: 'wind_students', guardian: 'wind_guardians',
  class: 'wind_classes', enrollment: 'wind_enrollments', payment: 'wind_payments',
  log: 'wind_student_logs', alert: 'wind_alerts', report: 'wind_pedagogical_reports',
};
export async function deleteRecord(entity: keyof typeof DELETABLE, id: string): Promise<Result> {
  const { admin, error } = await assertAdmin();
  if (!admin) return { ok: false, error: error! };
  const table = DELETABLE[entity];
  if (!table) return { ok: false, error: 'Entidade inválida.' };
  const { error: e } = await admin.from(table).delete().eq('id', id);
  if (e) return { ok: false, error: e.message };
  refresh();
  return { ok: true };
}

// ── AUTO-CADASTRO (público, sem auth) ─────────────────────────
export async function submitSelfEnrollment(values: Values): Promise<Result> {
  const admin = createAdminClient();
  const payload = {
    full_name: str(values.fullName), email: str(values.email), whatsapp: str(values.whatsapp),
    birth_date: orNull(values.birthDate), cpf: orNull(values.cpf),
    modalidade: str(values.modalidade) || 'ONLINE', status: 'EXPERIMENTAL', cefr_level: 'A1',
    start_date: new Date().toISOString().slice(0, 10),
    goal: orNull(values.goal), interests: orNull(values.interests),
    pedagogical_notes: 'Auto-cadastro via link de matrícula.',
  };
  if (!payload.full_name || !payload.email || !payload.whatsapp) {
    return { ok: false, error: 'Preencha nome, e-mail e WhatsApp.' };
  }
  const { error: e } = await admin.from('wind_students').insert(payload);
  if (e) return { ok: false, error: e.message };
  revalidatePath('/wind-os/students');
  return { ok: true };
}
