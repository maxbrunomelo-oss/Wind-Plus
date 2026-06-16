// ============================================================
// Wind OS — Student & Finance Intelligence Platform
// TypeScript domain types
// ============================================================

export type UserRole = 'ADMIN' | 'FINANCEIRO' | 'PROFESSOR' | 'SECRETARIA';

export type Modalidade = 'ONLINE' | 'PRESENCIAL';

export type StudentStatus =
  | 'ATIVO'
  | 'PAUSADO'
  | 'CANCELADO'
  | 'EXPERIMENTAL'
  | 'INADIMPLENTE';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type EntityStatus = 'ATIVO' | 'INATIVO';

export type PaymentMethod =
  | 'PIX'
  | 'BOLETO'
  | 'CARTAO'
  | 'DINHEIRO'
  | 'TRANSFERENCIA'
  | 'OUTRO';

export type PaymentStatus = 'PAGO' | 'PENDENTE' | 'ATRASADO' | 'CANCELADO';

export type EnrollmentStatus = 'ATIVA' | 'ENCERRADA' | 'CANCELADA' | 'PAUSADA';

export type LogType =
  | 'PEDAGOGICO'
  | 'FINANCEIRO'
  | 'ATENDIMENTO'
  | 'REUNIAO'
  | 'ALERTA'
  | 'OBSERVACAO'
  | 'RENOVACAO'
  | 'CANCELAMENTO';

export type Sentiment = 'POSITIVO' | 'NEUTRO' | 'NEGATIVO' | 'RISCO';

export type ReportStatus = 'RASCUNHO' | 'ENVIADO' | 'ARQUIVADO';

export type AlertType =
  | 'PAGAMENTO_ATRASADO'
  | 'RISCO_CANCELAMENTO'
  | 'SEM_REGISTRO_PEDAGOGICO'
  | 'RENOVACAO_PROXIMA'
  | 'FAMILIA_SEM_RETORNO'
  | 'OUTRO';

export type AlertPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type AlertStatus = 'ABERTO' | 'EM_ANDAMENTO' | 'RESOLVIDO' | 'IGNORADO';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: EntityStatus;
}

export interface Student {
  id: string;
  fullName: string;
  birthDate?: string;
  cpf?: string;
  email: string;
  whatsapp: string;
  modalidade: Modalidade;
  status: StudentStatus;
  cefrLevel: CefrLevel;
  teacherId?: string;
  classId?: string;
  startDate: string;
  monthlyAmount: number;
  dueDay: number;
  paymentMethod: PaymentMethod;
  goal?: string;
  interests?: string;
  pedagogicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  whatsapp: string;
  email?: string;
  cpf?: string;
  address?: string;
  notes?: string;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: EntityStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  modalidade: Modalidade;
  teacherId: string;
  cefrLevel: CefrLevel;
  weekdays: string[];
  schedule: string;
  status: EntityStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  startDate: string;
  endDate?: string;
  status: EnrollmentStatus;
  monthlyAmount: number;
  dueDay: number;
  paymentMethod: PaymentMethod;
  discountAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  enrollmentId: string;
  referenceMonth: string; // YYYY-MM
  description: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentLog {
  id: string;
  studentId: string;
  authorId: string;
  logType: LogType;
  title: string;
  content: string;
  sentiment: Sentiment;
  nextAction?: string;
  nextActionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PedagogicalReport {
  id: string;
  studentId: string;
  teacherId: string;
  referencePeriod: string;
  cefrLevel: CefrLevel;
  speakingProgress: number;
  listeningProgress: number;
  readingProgress: number;
  writingProgress: number;
  strengths?: string;
  improvementPoints?: string;
  teacherComments?: string;
  recommendations?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  studentId: string;
  alertType: AlertType;
  title: string;
  description: string;
  priority: AlertPriority;
  status: AlertStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WindDocument {
  id: string;
  studentId: string;
  name: string;
  category: string;
  url: string;
  createdAt: string;
}
