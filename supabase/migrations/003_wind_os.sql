-- ============================================================
-- Wind OS — Student & Finance Intelligence Platform
-- Schema: alunos, responsáveis, professores, turmas, matrículas,
--         financeiro, CRM, relatórios pedagógicos, alertas, documentos.
-- Idempotente. RLS preparado (políticas permissivas iniciais —
-- ajustar por papel antes de produção).
-- ============================================================

-- ─── ENUMS ────────────────────────────────────────────────────
do $$ begin
  create type wind_role           as enum ('ADMIN','FINANCEIRO','PROFESSOR','SECRETARIA');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_modalidade     as enum ('ONLINE','PRESENCIAL');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_student_status as enum ('ATIVO','PAUSADO','CANCELADO','EXPERIMENTAL','INADIMPLENTE');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_cefr           as enum ('A1','A2','B1','B2','C1','C2');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_entity_status  as enum ('ATIVO','INATIVO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_payment_method as enum ('PIX','BOLETO','CARTAO','DINHEIRO','TRANSFERENCIA','OUTRO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_payment_status as enum ('PAGO','PENDENTE','ATRASADO','CANCELADO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_enrollment_status as enum ('ATIVA','ENCERRADA','CANCELADA','PAUSADA');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_log_type       as enum ('PEDAGOGICO','FINANCEIRO','ATENDIMENTO','REUNIAO','ALERTA','OBSERVACAO','RENOVACAO','CANCELAMENTO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_sentiment      as enum ('POSITIVO','NEUTRO','NEGATIVO','RISCO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_report_status  as enum ('RASCUNHO','ENVIADO','ARQUIVADO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_alert_type     as enum ('PAGAMENTO_ATRASADO','RISCO_CANCELAMENTO','SEM_REGISTRO_PEDAGOGICO','RENOVACAO_PROXIMA','FAMILIA_SEM_RETORNO','OUTRO');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_alert_priority as enum ('BAIXA','MEDIA','ALTA','CRITICA');
  exception when duplicate_object then null; end $$;
do $$ begin
  create type wind_alert_status   as enum ('ABERTO','EM_ANDAMENTO','RESOLVIDO','IGNORADO');
  exception when duplicate_object then null; end $$;

-- ─── Helper: trigger updated_at ───────────────────────────────
create or replace function wind_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ─── PROFILES (vinculado a auth.users) ────────────────────────
create table if not exists public.wind_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        wind_role not null default 'SECRETARIA',
  status      wind_entity_status not null default 'ATIVO',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── TEACHERS ─────────────────────────────────────────────────
create table if not exists public.wind_teachers (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.wind_profiles(id) on delete set null,
  name        text not null,
  email       text not null,
  whatsapp    text not null,
  status      wind_entity_status not null default 'ATIVO',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── CLASSES ──────────────────────────────────────────────────
create table if not exists public.wind_classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  modalidade  wind_modalidade not null,
  teacher_id  uuid references public.wind_teachers(id) on delete set null,
  cefr_level  wind_cefr not null,
  weekdays    text[] not null default '{}',
  schedule    text,
  status      wind_entity_status not null default 'ATIVO',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── STUDENTS ─────────────────────────────────────────────────
create table if not exists public.wind_students (
  id                 uuid primary key default gen_random_uuid(),
  full_name          text not null,
  birth_date         date,
  cpf                text,
  email              text not null,
  whatsapp           text not null,
  modalidade         wind_modalidade not null,
  status             wind_student_status not null default 'EXPERIMENTAL',
  cefr_level         wind_cefr not null default 'A1',
  teacher_id         uuid references public.wind_teachers(id) on delete set null,
  class_id           uuid references public.wind_classes(id) on delete set null,
  start_date         date not null default current_date,
  goal               text,
  interests          text,
  pedagogical_notes  text,
  archived           boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─── GUARDIANS + join ─────────────────────────────────────────
create table if not exists public.wind_guardians (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  relationship text not null,
  whatsapp     text not null,
  email        text,
  cpf          text,
  address      text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.wind_student_guardians (
  student_id  uuid not null references public.wind_students(id) on delete cascade,
  guardian_id uuid not null references public.wind_guardians(id) on delete cascade,
  primary key (student_id, guardian_id)
);

-- ─── ENROLLMENTS ──────────────────────────────────────────────
create table if not exists public.wind_enrollments (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.wind_students(id) on delete cascade,
  class_id        uuid not null references public.wind_classes(id) on delete restrict,
  start_date      date not null default current_date,
  end_date        date,
  status          wind_enrollment_status not null default 'ATIVA',
  monthly_amount  numeric(10,2) not null default 0,
  due_day         smallint not null default 5 check (due_day between 1 and 28),
  payment_method  wind_payment_method not null default 'PIX',
  discount_amount numeric(10,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── PAYMENTS ─────────────────────────────────────────────────
create table if not exists public.wind_payments (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.wind_students(id) on delete cascade,
  enrollment_id   uuid references public.wind_enrollments(id) on delete set null,
  reference_month text not null,            -- 'YYYY-MM'
  description     text not null,
  amount          numeric(10,2) not null,
  discount_amount numeric(10,2) not null default 0,
  final_amount    numeric(10,2) generated always as (amount - discount_amount) stored,
  due_date        date not null,
  payment_date    date,
  payment_method  wind_payment_method,
  status          wind_payment_status not null default 'PENDENTE',
  receipt_url     text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (enrollment_id, reference_month)
);

-- ─── STUDENT LOGS (CRM) ───────────────────────────────────────
create table if not exists public.wind_student_logs (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid not null references public.wind_students(id) on delete cascade,
  author_id        uuid references public.wind_profiles(id) on delete set null,
  log_type         wind_log_type not null,
  title            text not null,
  content          text not null,
  sentiment        wind_sentiment not null default 'NEUTRO',
  next_action      text,
  next_action_date date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── PEDAGOGICAL REPORTS ──────────────────────────────────────
create table if not exists public.wind_pedagogical_reports (
  id                 uuid primary key default gen_random_uuid(),
  student_id         uuid not null references public.wind_students(id) on delete cascade,
  teacher_id         uuid references public.wind_teachers(id) on delete set null,
  reference_period   text not null,
  cefr_level         wind_cefr not null,
  speaking_progress  smallint not null default 0 check (speaking_progress between 0 and 100),
  listening_progress smallint not null default 0 check (listening_progress between 0 and 100),
  reading_progress   smallint not null default 0 check (reading_progress between 0 and 100),
  writing_progress   smallint not null default 0 check (writing_progress between 0 and 100),
  strengths          text,
  improvement_points text,
  teacher_comments   text,
  recommendations    text,
  status             wind_report_status not null default 'RASCUNHO',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─── ALERTS ───────────────────────────────────────────────────
create table if not exists public.wind_alerts (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.wind_students(id) on delete cascade,
  alert_type  wind_alert_type not null,
  title       text not null,
  description text not null,
  priority    wind_alert_priority not null default 'MEDIA',
  status      wind_alert_status not null default 'ABERTO',
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── DOCUMENTS ────────────────────────────────────────────────
create table if not exists public.wind_documents (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.wind_students(id) on delete cascade,
  name        text not null,
  category    text,
  url         text not null,
  created_at  timestamptz not null default now()
);

-- ─── ÍNDICES ──────────────────────────────────────────────────
create index if not exists idx_wind_students_status     on public.wind_students(status);
create index if not exists idx_wind_students_modalidade on public.wind_students(modalidade);
create index if not exists idx_wind_students_teacher    on public.wind_students(teacher_id);
create index if not exists idx_wind_students_class      on public.wind_students(class_id);
create index if not exists idx_wind_classes_teacher     on public.wind_classes(teacher_id);
create index if not exists idx_wind_enroll_student      on public.wind_enrollments(student_id);
create index if not exists idx_wind_payments_student    on public.wind_payments(student_id);
create index if not exists idx_wind_payments_status     on public.wind_payments(status);
create index if not exists idx_wind_payments_due        on public.wind_payments(due_date);
create index if not exists idx_wind_payments_refmonth   on public.wind_payments(reference_month);
create index if not exists idx_wind_logs_student        on public.wind_student_logs(student_id);
create index if not exists idx_wind_reports_student     on public.wind_pedagogical_reports(student_id);
create index if not exists idx_wind_alerts_student      on public.wind_alerts(student_id);
create index if not exists idx_wind_alerts_status       on public.wind_alerts(status);

-- ─── TRIGGERS updated_at ──────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'wind_profiles','wind_teachers','wind_classes','wind_students','wind_guardians',
    'wind_enrollments','wind_payments','wind_student_logs','wind_pedagogical_reports','wind_alerts'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function wind_set_updated_at();', t);
  end loop;
end $$;

-- ─── ROW LEVEL SECURITY (preparação) ──────────────────────────
-- Habilita RLS e cria política permissiva inicial para usuários
-- autenticados. NÃO É SEGURO para produção: substituir por
-- políticas por papel (wind_profiles.role) antes do go-live.
do $$
declare t text;
begin
  foreach t in array array[
    'wind_profiles','wind_teachers','wind_classes','wind_students','wind_guardians',
    'wind_student_guardians','wind_enrollments','wind_payments','wind_student_logs',
    'wind_pedagogical_reports','wind_alerts','wind_documents'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists wind_auth_all on public.%I;', t);
    execute format(
      'create policy wind_auth_all on public.%I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Função utilitária para checagem de papel (uso futuro nas políticas):
create or replace function wind_current_role()
returns wind_role language sql stable as $$
  select role from public.wind_profiles where id = auth.uid();
$$;
