create extension if not exists "uuid-ossp";

create table if not exists public.placement_test_results (
  id uuid primary key default uuid_generate_v4(),

  student_name text not null,
  email text not null,
  phone text not null,
  age integer,
  objective text,
  self_declared_level text,

  consent_accepted boolean not null default false,
  responsible_consent boolean default false,

  objective_answers jsonb not null,
  writing_answer text,

  raw_score integer not null,
  max_score integer not null,
  percentage numeric not null,

  cefr_level text not null,
  cefr_band_breakdown jsonb not null,
  diagnostic_summary text not null,
  recommended_course text,

  source text default 'website',
  user_agent text,
  ip_hash text,

  created_at timestamptz not null default now()
);

alter table public.placement_test_results enable row level security;

drop policy if exists "No public select placement results" on public.placement_test_results;
create policy "No public select placement results"
on public.placement_test_results
for select
using (false);

drop policy if exists "No public update placement results" on public.placement_test_results;
create policy "No public update placement results"
on public.placement_test_results
for update
using (false);

drop policy if exists "No public delete placement results" on public.placement_test_results;
create policy "No public delete placement results"
on public.placement_test_results
for delete
using (false);

create index if not exists idx_placement_test_results_created_at
on public.placement_test_results(created_at desc);

create index if not exists idx_placement_test_results_email
on public.placement_test_results(email);

create index if not exists idx_placement_test_results_cefr_level
on public.placement_test_results(cefr_level);
