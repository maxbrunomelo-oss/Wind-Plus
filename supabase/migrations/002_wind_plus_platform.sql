-- Wind Plus Platform — Core Schema
-- Módulos: Auth, Trilha, Exercícios, Listening, Ranking, Relatório

-- ─── CURSOS ──────────────────────────────────────────────────────────────────
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,  -- fluency | business | medicine | grammar | exams
  title       text not null,
  description text,
  icon        text,
  color       text,                 -- hex accent color for the course
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── UNIDADES (grupos de lições por nível CEFR) ───────────────────────────────
create table if not exists public.units (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  cefr_level  text not null check (cefr_level in ('A1','A2','B1','B2','C1','C2')),
  title       text not null,
  description text,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── LIÇÕES ──────────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id            uuid primary key default gen_random_uuid(),
  unit_id       uuid not null references public.units(id) on delete cascade,
  title         text not null,
  skill         text not null check (skill in ('reading','listening','grammar','vocabulary','speaking','writing')),
  duration_min  integer not null default 15,
  xp_reward     integer not null default 20,
  order_index   integer not null default 0,
  is_free       boolean not null default false,  -- freemium: primeiras lições liberadas
  created_at    timestamptz not null default now()
);

-- ─── PERFIL DO ALUNO ─────────────────────────────────────────────────────────
create table if not exists public.student_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  avatar_initials text,
  cefr_level      text not null default 'A1' check (cefr_level in ('A1','A2','B1','B2','C1','C2')),
  current_course  uuid references public.courses(id),
  xp_total        integer not null default 0,
  streak_days     integer not null default 0,
  streak_last_date date,
  daily_goal      integer not null default 5,    -- lições por dia
  accuracy_pct    numeric not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── PROGRESSO DO ALUNO NAS LIÇÕES ───────────────────────────────────────────
create table if not exists public.user_lessons (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  status       text not null default 'locked' check (status in ('locked','available','in_progress','done')),
  score        integer,
  xp_earned    integer not null default 0,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  unique(user_id, lesson_id)
);

-- ─── EXERCÍCIOS ──────────────────────────────────────────────────────────────
create table if not exists public.exercises (
  id             uuid primary key default gen_random_uuid(),
  lesson_id      uuid not null references public.lessons(id) on delete cascade,
  type           text not null check (type in ('mcq','gap_fill')),
  question       text not null,
  options_json   jsonb,              -- MCQ: ["a","b","c"]
  correct_answer text not null,
  hint           text,
  order_index    integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ─── EPISÓDIOS DE ÁUDIO (Listening) ──────────────────────────────────────────
create table if not exists public.audio_episodes (
  id              uuid primary key default gen_random_uuid(),
  lesson_id       uuid not null references public.lessons(id) on delete cascade,
  mp3_url         text not null,
  transcript      text,
  timestamps_json jsonb,    -- [{start_ms, text}, ...]
  waveform_json   jsonb,    -- [int, ...] normalized heights
  duration_sec    integer,
  vocabulary_json jsonb,    -- [{word, definition, example}, ...]
  created_at      timestamptz not null default now()
);

-- ─── LIGAS / RANKING ─────────────────────────────────────────────────────────
create table if not exists public.leagues (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (name in ('bronze','silver','gold')),
  week_start date not null,
  week_end   date not null
);

create table if not exists public.user_leagues (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  league_id    uuid not null references public.leagues(id) on delete cascade,
  xp_this_week integer not null default 0,
  rank         integer,
  unique(user_id, league_id)
);

-- ─── LOG DE XP ───────────────────────────────────────────────────────────────
create table if not exists public.user_xp_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  source     text not null check (source in ('lesson','listening','streak','bonus')),
  xp         integer not null,
  created_at timestamptz not null default now()
);

-- ─── TEMPO DE ESTUDO ─────────────────────────────────────────────────────────
create table if not exists public.study_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   uuid references public.lessons(id),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  duration_sec integer
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table public.student_profiles enable row level security;
alter table public.user_lessons      enable row level security;
alter table public.user_leagues      enable row level security;
alter table public.user_xp_log       enable row level security;
alter table public.study_sessions    enable row level security;

-- Aluno só vê/edita seus próprios dados
create policy "student own profile"    on public.student_profiles for all using (auth.uid() = id);
create policy "student own lessons"    on public.user_lessons      for all using (auth.uid() = user_id);
create policy "student own leagues"    on public.user_leagues      for all using (auth.uid() = user_id);
create policy "student own xp_log"     on public.user_xp_log       for all using (auth.uid() = user_id);
create policy "student own sessions"   on public.study_sessions     for all using (auth.uid() = user_id);

-- Dados públicos (leitura)
alter table public.courses  enable row level security;
alter table public.units    enable row level security;
alter table public.lessons  enable row level security;
alter table public.exercises enable row level security;
alter table public.audio_episodes enable row level security;
alter table public.leagues  enable row level security;

create policy "courses public read"  on public.courses  for select using (true);
create policy "units public read"    on public.units    for select using (true);
create policy "lessons public read"  on public.lessons  for select using (true);
create policy "exercises auth read"  on public.exercises for select using (auth.uid() is not null);
create policy "audio auth read"      on public.audio_episodes for select using (auth.uid() is not null);
create policy "leagues public read"  on public.leagues  for select using (true);

-- ─── SEED: 5 CURSOS ──────────────────────────────────────────────────────────
insert into public.courses (slug, title, description, icon, color, order_index) values
  ('fluency',  'Fluency Course',        'Do iniciante ao avançado com foco em comunicação real', '🗣️', '#E31E24', 1),
  ('business', 'Business English',      'Inglês para o mundo corporativo e negócios internacionais', '💼', '#2563EB', 2),
  ('medicine', 'English for Medicine',  'Vocabulário clínico, prontuários e comunicação médica', '🩺', '#16A34A', 3),
  ('grammar',  'Use of Grammar',        'Estruturas gramaticais do A1 ao C2 com prática intensa', '📖', '#7C3AED', 4),
  ('exams',    'International Exams',   'Preparação para IELTS, TOEFL, Cambridge e PTE', '🎓', '#D97706', 5)
on conflict (slug) do nothing;

-- ─── ÍNDICES ─────────────────────────────────────────────────────────────────
create index if not exists idx_units_course     on public.units(course_id, order_index);
create index if not exists idx_lessons_unit     on public.lessons(unit_id, order_index);
create index if not exists idx_user_lessons_uid on public.user_lessons(user_id, status);
create index if not exists idx_xp_log_uid       on public.user_xp_log(user_id, created_at desc);
create index if not exists idx_study_uid_date   on public.study_sessions(user_id, started_at desc);
