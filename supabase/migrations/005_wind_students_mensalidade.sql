-- ============================================================
-- Wind OS — Valor de mensalidade no cadastro do aluno
-- Adiciona o plano financeiro diretamente em wind_students para
-- que a geração de mensalidades (e, por consequência, o módulo
-- Financeiro e os relatórios) seja preenchida a partir do aluno.
-- ============================================================

alter table public.wind_students
  add column if not exists monthly_amount numeric(10,2) not null default 0,
  add column if not exists due_day smallint not null default 5,
  add column if not exists payment_method wind_payment_method not null default 'PIX';

-- Garante faixa válida do dia de vencimento (1..28)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'wind_students_due_day_check'
  ) then
    alter table public.wind_students
      add constraint wind_students_due_day_check check (due_day between 1 and 28);
  end if;
end $$;
