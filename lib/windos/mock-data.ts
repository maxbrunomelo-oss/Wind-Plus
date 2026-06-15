// ============================================================
// Wind OS — Mock data (in-memory seed for the first version)
// Replace with Supabase queries when the backend is wired.
// ============================================================
import type {
  Profile, Student, Guardian, Teacher, SchoolClass, Enrollment,
  Payment, StudentLog, PedagogicalReport, Alert, PaymentStatus,
} from './types';

export const currentUser: Profile = {
  id: 'u-admin',
  name: 'Max Bruno',
  email: 'maxbrunomelo@hotmail.com',
  role: 'ADMIN',
  status: 'ATIVO',
};

// ─── Professores ──────────────────────────────────────────────
export const teachers: Teacher[] = [
  { id: 't1', name: 'Carolina Mendes', email: 'carolina@wind.com', whatsapp: '+55 81 99876-1010', status: 'ATIVO', notes: 'Especialista em conversação e exames internacionais.', createdAt: '2025-01-10', updatedAt: '2026-05-01' },
  { id: 't2', name: 'Rafael Antunes', email: 'rafael@wind.com', whatsapp: '+55 81 99876-2020', status: 'ATIVO', notes: 'Foco em Business English e turmas presenciais.', createdAt: '2025-02-15', updatedAt: '2026-05-01' },
  { id: 't3', name: 'Beatriz Lopes', email: 'beatriz@wind.com', whatsapp: '+55 81 99876-3030', status: 'ATIVO', notes: 'Kids & teens, metodologia comunicativa.', createdAt: '2025-03-20', updatedAt: '2026-05-01' },
];

// ─── Turmas ───────────────────────────────────────────────────
export const classes: SchoolClass[] = [
  { id: 'c1', name: 'Conversation B2 — Noite', modalidade: 'ONLINE', teacherId: 't1', cefrLevel: 'B2', weekdays: ['Seg', 'Qua'], schedule: '19:00 - 20:30', status: 'ATIVO', createdAt: '2025-08-01', updatedAt: '2026-05-01' },
  { id: 'c2', name: 'Business English — Manhã', modalidade: 'PRESENCIAL', teacherId: 't2', cefrLevel: 'C1', weekdays: ['Ter', 'Qui'], schedule: '08:00 - 09:30', status: 'ATIVO', createdAt: '2025-08-01', updatedAt: '2026-05-01' },
  { id: 'c3', name: 'Intermediário A2/B1', modalidade: 'ONLINE', teacherId: 't3', cefrLevel: 'A2', weekdays: ['Seg', 'Sex'], schedule: '18:00 - 19:00', status: 'ATIVO', createdAt: '2025-09-01', updatedAt: '2026-05-01' },
  { id: 'c4', name: 'Iniciantes A1 — Tarde', modalidade: 'PRESENCIAL', teacherId: 't3', cefrLevel: 'A1', weekdays: ['Qua', 'Sex'], schedule: '14:00 - 15:30', status: 'ATIVO', createdAt: '2026-01-15', updatedAt: '2026-05-01' },
];

// ─── Alunos ───────────────────────────────────────────────────
export const students: Student[] = [
  // ONLINE
  { id: 's1', fullName: 'Ana Beatriz Carvalho', birthDate: '1998-04-12', cpf: '111.222.333-44', email: 'ana.carvalho@email.com', whatsapp: '+55 81 98111-0001', modalidade: 'ONLINE', status: 'ATIVO', cefrLevel: 'B2', teacherId: 't1', classId: 'c1', startDate: '2025-08-05', goal: 'Fluência para entrevistas internacionais', interests: 'Séries, viagens, tecnologia', pedagogicalNotes: 'Ótima produção oral, melhorar writing formal.', createdAt: '2025-08-05', updatedAt: '2026-06-01' },
  { id: 's2', fullName: 'Lucas Pereira Souza', birthDate: '1995-09-30', email: 'lucas.souza@email.com', whatsapp: '+55 81 98111-0002', modalidade: 'ONLINE', status: 'ATIVO', cefrLevel: 'B2', teacherId: 't1', classId: 'c1', startDate: '2025-08-10', goal: 'Promoção no trabalho', interests: 'Games, música', createdAt: '2025-08-10', updatedAt: '2026-06-01' },
  { id: 's3', fullName: 'Mariana Oliveira Lima', birthDate: '2001-01-22', email: 'mariana.lima@email.com', whatsapp: '+55 81 98111-0003', modalidade: 'ONLINE', status: 'INADIMPLENTE', cefrLevel: 'A2', teacherId: 't3', classId: 'c3', startDate: '2025-09-15', goal: 'Intercâmbio no Canadá', interests: 'Fotografia, culinária', pedagogicalNotes: 'Faltas recorrentes nas últimas semanas.', createdAt: '2025-09-15', updatedAt: '2026-06-10' },
  { id: 's4', fullName: 'Pedro Henrique Alves', birthDate: '1990-12-05', email: 'pedro.alves@email.com', whatsapp: '+55 81 98111-0004', modalidade: 'ONLINE', status: 'PAUSADO', cefrLevel: 'A2', teacherId: 't3', classId: 'c3', startDate: '2025-09-20', goal: 'Viagem a trabalho', interests: 'Futebol, investimentos', createdAt: '2025-09-20', updatedAt: '2026-05-20' },
  { id: 's5', fullName: 'Juliana Ferreira Rocha', birthDate: '1999-07-18', email: 'juliana.rocha@email.com', whatsapp: '+55 81 98111-0005', modalidade: 'ONLINE', status: 'EXPERIMENTAL', cefrLevel: 'A1', teacherId: 't3', classId: 'c3', startDate: '2026-06-01', goal: 'Começar do zero', interests: 'Yoga, leitura', createdAt: '2026-06-01', updatedAt: '2026-06-01' },
  // PRESENCIAL
  { id: 's6', fullName: 'Rodrigo Nunes Barbosa', birthDate: '1988-03-25', cpf: '222.333.444-55', email: 'rodrigo.barbosa@email.com', whatsapp: '+55 81 98111-0006', modalidade: 'PRESENCIAL', status: 'ATIVO', cefrLevel: 'C1', teacherId: 't2', classId: 'c2', startDate: '2025-08-01', goal: 'Negociações com clientes no exterior', interests: 'Golfe, vinhos', createdAt: '2025-08-01', updatedAt: '2026-06-01' },
  { id: 's7', fullName: 'Fernanda Gomes Dias', birthDate: '1993-11-11', email: 'fernanda.dias@email.com', whatsapp: '+55 81 98111-0007', modalidade: 'PRESENCIAL', status: 'ATIVO', cefrLevel: 'C1', teacherId: 't2', classId: 'c2', startDate: '2025-08-03', goal: 'Certificação TOEFL', interests: 'Teatro, dança', createdAt: '2025-08-03', updatedAt: '2026-06-01' },
  { id: 's8', fullName: 'Gabriel Martins Costa', birthDate: '2005-06-14', email: 'gabriel.costa@email.com', whatsapp: '+55 81 98111-0008', modalidade: 'PRESENCIAL', status: 'ATIVO', cefrLevel: 'A1', teacherId: 't3', classId: 'c4', startDate: '2026-02-01', goal: 'Acompanhar a escola', interests: 'Skate, desenho', createdAt: '2026-02-01', updatedAt: '2026-06-01' },
  { id: 's9', fullName: 'Camila Ribeiro Santos', birthDate: '2004-02-28', email: 'camila.santos@email.com', whatsapp: '+55 81 98111-0009', modalidade: 'PRESENCIAL', status: 'INADIMPLENTE', cefrLevel: 'A1', teacherId: 't3', classId: 'c4', startDate: '2026-02-05', goal: 'Vestibular e intercâmbio', interests: 'K-pop, idiomas', pedagogicalNotes: 'Família sem retorno sobre renegociação.', createdAt: '2026-02-05', updatedAt: '2026-06-12' },
  { id: 's10', fullName: 'Thiago Almeida Pinto', birthDate: '1996-10-08', email: 'thiago.pinto@email.com', whatsapp: '+55 81 98111-0010', modalidade: 'PRESENCIAL', status: 'CANCELADO', cefrLevel: 'A1', teacherId: 't3', classId: 'c4', startDate: '2026-01-10', goal: 'Curso básico', interests: 'Carros, trilhas', pedagogicalNotes: 'Cancelou por mudança de cidade.', createdAt: '2026-01-10', updatedAt: '2026-05-30' },
];

// ─── Responsáveis ─────────────────────────────────────────────
export const guardians: Guardian[] = [
  { id: 'g1', name: 'Marcos Carvalho', relationship: 'Pai', whatsapp: '+55 81 98222-0001', email: 'marcos.carvalho@email.com', cpf: '333.444.555-66', studentIds: ['s1'], createdAt: '2025-08-05', updatedAt: '2026-06-01' },
  { id: 'g2', name: 'Sandra Souza', relationship: 'Mãe', whatsapp: '+55 81 98222-0002', email: 'sandra.souza@email.com', studentIds: ['s2'], createdAt: '2025-08-10', updatedAt: '2026-06-01' },
  { id: 'g3', name: 'Roberto Lima', relationship: 'Pai', whatsapp: '+55 81 98222-0003', email: 'roberto.lima@email.com', notes: 'Responsável financeiro.', studentIds: ['s3'], createdAt: '2025-09-15', updatedAt: '2026-06-10' },
  { id: 'g4', name: 'Patrícia Alves', relationship: 'Esposa', whatsapp: '+55 81 98222-0004', studentIds: ['s4'], createdAt: '2025-09-20', updatedAt: '2026-05-20' },
  { id: 'g5', name: 'Helena Rocha', relationship: 'Mãe', whatsapp: '+55 81 98222-0005', email: 'helena.rocha@email.com', studentIds: ['s5'], createdAt: '2026-06-01', updatedAt: '2026-06-01' },
  { id: 'g6', name: 'Cláudia Barbosa', relationship: 'Esposa', whatsapp: '+55 81 98222-0006', studentIds: ['s6'], createdAt: '2025-08-01', updatedAt: '2026-06-01' },
  { id: 'g7', name: 'Antônio Dias', relationship: 'Pai', whatsapp: '+55 81 98222-0007', email: 'antonio.dias@email.com', studentIds: ['s7'], createdAt: '2025-08-03', updatedAt: '2026-06-01' },
  { id: 'g8', name: 'Vera Costa', relationship: 'Mãe', whatsapp: '+55 81 98222-0008', email: 'vera.costa@email.com', cpf: '444.555.666-77', studentIds: ['s8'], createdAt: '2026-02-01', updatedAt: '2026-06-01' },
  { id: 'g9', name: 'Luciano Santos', relationship: 'Pai', whatsapp: '+55 81 98222-0009', notes: 'Sem retorno desde maio/2026.', studentIds: ['s9'], createdAt: '2026-02-05', updatedAt: '2026-06-12' },
  { id: 'g10', name: 'Regina Pinto', relationship: 'Mãe', whatsapp: '+55 81 98222-0010', email: 'regina.pinto@email.com', studentIds: ['s10'], createdAt: '2026-01-10', updatedAt: '2026-05-30' },
];

// ─── Matrículas ───────────────────────────────────────────────
export const enrollments: Enrollment[] = students
  .filter(s => s.classId)
  .map((s, i) => {
    const amounts: Record<string, number> = { ONLINE: 320, PRESENCIAL: 420 };
    const dueDays = [5, 5, 15, 15, 25, 5, 15, 25, 25, 5];
    return {
      id: `e${i + 1}`,
      studentId: s.id,
      classId: s.classId!,
      startDate: s.startDate,
      status: s.status === 'CANCELADO' ? 'CANCELADA' : s.status === 'PAUSADO' ? 'PAUSADA' : 'ATIVA',
      monthlyAmount: amounts[s.modalidade],
      dueDay: dueDays[i],
      paymentMethod: i % 2 === 0 ? 'PIX' : 'BOLETO',
      discountAmount: s.status === 'EXPERIMENTAL' ? amounts[s.modalidade] : 0,
      createdAt: s.startDate,
      updatedAt: '2026-06-01',
    } as Enrollment;
  });

// ─── Pagamentos (junho/2026) ─────────────────────────────────
function buildPayment(
  id: string, studentId: string, enrollmentId: string, amount: number,
  dueDay: number, status: PaymentStatus, discount = 0,
): Payment {
  const final = amount - discount;
  const due = `2026-06-${String(dueDay).padStart(2, '0')}`;
  return {
    id, studentId, enrollmentId,
    referenceMonth: '2026-06',
    description: 'Mensalidade Junho/2026',
    amount, discountAmount: discount, finalAmount: final,
    dueDate: due,
    paymentDate: status === 'PAGO' ? due : undefined,
    paymentMethod: status === 'PAGO' ? 'PIX' : undefined,
    status,
    createdAt: '2026-06-01', updatedAt: '2026-06-12',
  };
}

export const payments: Payment[] = [
  buildPayment('p1', 's1', 'e1', 320, 5, 'PAGO'),
  buildPayment('p2', 's2', 'e2', 320, 5, 'PAGO'),
  buildPayment('p3', 's3', 'e3', 320, 15, 'ATRASADO'),
  buildPayment('p4', 's4', 'e4', 320, 15, 'CANCELADO'),
  buildPayment('p5', 's5', 'e5', 320, 25, 'PENDENTE', 320),
  buildPayment('p6', 's6', 'e6', 420, 5, 'PAGO'),
  buildPayment('p7', 's7', 'e7', 420, 15, 'PENDENTE'),
  buildPayment('p8', 's8', 'e8', 420, 25, 'PAGO'),
  buildPayment('p9', 's9', 'e9', 420, 25, 'ATRASADO'),
  buildPayment('p10', 's10', 'e10', 420, 5, 'CANCELADO'),
];

// ─── Logs / CRM ───────────────────────────────────────────────
export const studentLogs: StudentLog[] = [
  { id: 'l1', studentId: 's1', authorId: 't1', logType: 'PEDAGOGICO', title: 'Avanço em conversação', content: 'Ana apresentou ótima evolução em fluência durante o role-play de entrevista.', sentiment: 'POSITIVO', createdAt: '2026-06-08', updatedAt: '2026-06-08' },
  { id: 'l2', studentId: 's3', authorId: 'u-admin', logType: 'FINANCEIRO', title: 'Mensalidade em atraso', content: 'Contato via WhatsApp sobre a mensalidade de junho. Aguardando retorno.', sentiment: 'NEGATIVO', nextAction: 'Reenviar boleto', nextActionDate: '2026-06-18', createdAt: '2026-06-10', updatedAt: '2026-06-10' },
  { id: 'l3', studentId: 's3', authorId: 't3', logType: 'ALERTA', title: 'Faltas recorrentes', content: 'Aluna faltou às 3 últimas aulas. Risco de evasão.', sentiment: 'RISCO', nextAction: 'Ligar para responsável', nextActionDate: '2026-06-16', createdAt: '2026-06-11', updatedAt: '2026-06-11' },
  { id: 'l4', studentId: 's6', authorId: 't2', logType: 'REUNIAO', title: 'Reunião de acompanhamento', content: 'Rodrigo solicitou foco em vocabulário de negociação. Plano ajustado.', sentiment: 'POSITIVO', createdAt: '2026-06-05', updatedAt: '2026-06-05' },
  { id: 'l5', studentId: 's9', authorId: 'u-admin', logType: 'ATENDIMENTO', title: 'Família sem retorno', content: 'Tentativas de contato com o responsável sem sucesso desde maio.', sentiment: 'RISCO', nextAction: 'Nova tentativa de contato', nextActionDate: '2026-06-17', createdAt: '2026-06-12', updatedAt: '2026-06-12' },
  { id: 'l6', studentId: 's10', authorId: 'u-admin', logType: 'CANCELAMENTO', title: 'Cancelamento por mudança', content: 'Aluno cancelou matrícula devido a mudança de cidade.', sentiment: 'NEUTRO', createdAt: '2026-05-30', updatedAt: '2026-05-30' },
];

// ─── Relatórios pedagógicos ───────────────────────────────────
export const pedagogicalReports: PedagogicalReport[] = [
  { id: 'r1', studentId: 's1', teacherId: 't1', referencePeriod: 'Maio/2026', cefrLevel: 'B2', speakingProgress: 85, listeningProgress: 80, readingProgress: 75, writingProgress: 65, strengths: 'Excelente fluência e pronúncia.', improvementPoints: 'Escrita formal e uso de conectivos.', teacherComments: 'Evolução consistente no semestre.', recommendations: 'Praticar essays semanais.', status: 'ENVIADO', createdAt: '2026-06-01', updatedAt: '2026-06-01' },
  { id: 'r2', studentId: 's6', teacherId: 't2', referencePeriod: 'Maio/2026', cefrLevel: 'C1', speakingProgress: 90, listeningProgress: 88, readingProgress: 85, writingProgress: 82, strengths: 'Vocabulário de negócios sólido.', improvementPoints: 'Idioms e expressões informais.', teacherComments: 'Pronto para certificação avançada.', status: 'RASCUNHO', createdAt: '2026-06-03', updatedAt: '2026-06-03' },
];

// ─── Alertas ──────────────────────────────────────────────────
export const alerts: Alert[] = [
  { id: 'a1', studentId: 's3', alertType: 'PAGAMENTO_ATRASADO', title: 'Mensalidade de junho atrasada', description: 'Pagamento vencido em 15/06 sem retorno.', priority: 'ALTA', status: 'ABERTO', dueDate: '2026-06-18', createdAt: '2026-06-16', updatedAt: '2026-06-16' },
  { id: 'a2', studentId: 's3', alertType: 'RISCO_CANCELAMENTO', title: 'Risco de evasão', description: 'Faltas recorrentes + inadimplência.', priority: 'CRITICA', status: 'EM_ANDAMENTO', dueDate: '2026-06-16', createdAt: '2026-06-12', updatedAt: '2026-06-13' },
  { id: 'a3', studentId: 's9', alertType: 'FAMILIA_SEM_RETORNO', title: 'Família sem retorno', description: 'Responsável não responde desde maio.', priority: 'ALTA', status: 'ABERTO', dueDate: '2026-06-17', createdAt: '2026-06-12', updatedAt: '2026-06-12' },
  { id: 'a4', studentId: 's2', alertType: 'RENOVACAO_PROXIMA', title: 'Renovação de matrícula', description: 'Ciclo encerra em julho. Iniciar conversa de renovação.', priority: 'MEDIA', status: 'ABERTO', dueDate: '2026-06-30', createdAt: '2026-06-10', updatedAt: '2026-06-10' },
  { id: 'a5', studentId: 's5', alertType: 'SEM_REGISTRO_PEDAGOGICO', title: 'Sem registro pedagógico', description: 'Aluna experimental sem nenhum registro nos últimos 10 dias.', priority: 'BAIXA', status: 'ABERTO', createdAt: '2026-06-11', updatedAt: '2026-06-11' },
];

// ============================================================
// Lookups
// ============================================================
export const getStudent = (id: string) => students.find(s => s.id === id);
export const getTeacher = (id: string) => teachers.find(t => t.id === id);
export const getClass = (id: string) => classes.find(c => c.id === id);
export const teacherName = (id?: string) => teachers.find(t => t.id === id)?.name ?? '—';
export const className = (id?: string) => classes.find(c => c.id === id)?.name ?? '—';
export const studentName = (id: string) => students.find(s => s.id === id)?.fullName ?? '—';
export const classStudentCount = (classId: string) =>
  students.filter(s => s.classId === classId && s.status !== 'CANCELADO').length;
export const studentGuardians = (studentId: string) =>
  guardians.filter(g => g.studentIds.includes(studentId));
export const studentPayments = (studentId: string) =>
  payments.filter(p => p.studentId === studentId);
export const studentLogsFor = (studentId: string) =>
  studentLogs.filter(l => l.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const studentAlerts = (studentId: string) =>
  alerts.filter(a => a.studentId === studentId && a.status !== 'RESOLVIDO');
export const studentReports = (studentId: string) =>
  pedagogicalReports.filter(r => r.studentId === studentId);
export const studentRevenue = (studentId: string) =>
  payments.filter(p => p.studentId === studentId && p.status === 'PAGO')
    .reduce((sum, p) => sum + p.finalAmount, 0);
export const studentOpenAmount = (studentId: string) =>
  payments.filter(p => p.studentId === studentId && (p.status === 'PENDENTE' || p.status === 'ATRASADO'))
    .reduce((sum, p) => sum + p.finalAmount, 0);

// ============================================================
// Dashboard aggregates
// ============================================================
export function getDashboardStats() {
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
    totalAtivos: active.length,
    online, presencial,
    previsto, recebido, pendente, atrasado,
    inadimplencia: Math.round(inadimplencia),
    novos, cancelamentos, emRisco,
  };
}

export function proximosVencimentos() {
  return payments
    .filter(p => p.status === 'PENDENTE' || p.status === 'ATRASADO')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// Evolução de receita (últimos 6 meses) — valores ilustrativos
export const revenueEvolution = [
  { label: 'Jan', previsto: 3200, recebido: 3050 },
  { label: 'Fev', previsto: 3400, recebido: 3300 },
  { label: 'Mar', previsto: 3600, recebido: 3450 },
  { label: 'Abr', previsto: 3700, recebido: 3600 },
  { label: 'Mai', previsto: 3700, recebido: 3550 },
  { label: 'Jun', previsto: 3700, recebido: 1480 },
];

export const inadimplenciaEvolution = [
  { label: 'Jan', value: 5 },
  { label: 'Fev', value: 4 },
  { label: 'Mar', value: 6 },
  { label: 'Abr', value: 5 },
  { label: 'Mai', value: 8 },
  { label: 'Jun', value: 22 },
];
