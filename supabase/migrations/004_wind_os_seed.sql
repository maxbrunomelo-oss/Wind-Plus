-- ============================================================
-- Wind OS — Seed de dados de exemplo (demonstração)
-- Espelha lib/windos/mock-data.ts. Idempotente (on conflict do nothing).
-- Rode DEPOIS de 003_wind_os.sql e de criar o usuário admin.
-- ============================================================

-- ─── PROFESSORES ──────────────────────────────────────────────
insert into public.wind_teachers (id, name, email, whatsapp, status, notes) values
  ('11111111-1111-1111-1111-111111111101', 'Carolina Mendes', 'carolina@wind.com', '+55 81 99876-1010', 'ATIVO', 'Especialista em conversação e exames internacionais.'),
  ('11111111-1111-1111-1111-111111111102', 'Rafael Antunes', 'rafael@wind.com', '+55 81 99876-2020', 'ATIVO', 'Foco em Business English e turmas presenciais.'),
  ('11111111-1111-1111-1111-111111111103', 'Beatriz Lopes', 'beatriz@wind.com', '+55 81 99876-3030', 'ATIVO', 'Kids & teens, metodologia comunicativa.')
on conflict (id) do nothing;

-- ─── TURMAS ───────────────────────────────────────────────────
insert into public.wind_classes (id, name, modalidade, teacher_id, cefr_level, weekdays, schedule, status) values
  ('22222222-2222-2222-2222-222222222201', 'Conversation B2 — Noite', 'ONLINE', '11111111-1111-1111-1111-111111111101', 'B2', array['Seg','Qua'], '19:00 - 20:30', 'ATIVO'),
  ('22222222-2222-2222-2222-222222222202', 'Business English — Manhã', 'PRESENCIAL', '11111111-1111-1111-1111-111111111102', 'C1', array['Ter','Qui'], '08:00 - 09:30', 'ATIVO'),
  ('22222222-2222-2222-2222-222222222203', 'Intermediário A2/B1', 'ONLINE', '11111111-1111-1111-1111-111111111103', 'A2', array['Seg','Sex'], '18:00 - 19:00', 'ATIVO'),
  ('22222222-2222-2222-2222-222222222204', 'Iniciantes A1 — Tarde', 'PRESENCIAL', '11111111-1111-1111-1111-111111111103', 'A1', array['Qua','Sex'], '14:00 - 15:30', 'ATIVO')
on conflict (id) do nothing;

-- ─── ALUNOS ───────────────────────────────────────────────────
insert into public.wind_students (id, full_name, birth_date, cpf, email, whatsapp, modalidade, status, cefr_level, teacher_id, class_id, start_date, goal, interests, pedagogical_notes) values
  ('33333333-3333-3333-3333-333333333301', 'Ana Beatriz Carvalho', '1998-04-12', '111.222.333-44', 'ana.carvalho@email.com', '+55 81 98111-0001', 'ONLINE', 'ATIVO', 'B2', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', '2025-08-05', 'Fluência para entrevistas internacionais', 'Séries, viagens, tecnologia', 'Ótima produção oral, melhorar writing formal.'),
  ('33333333-3333-3333-3333-333333333302', 'Lucas Pereira Souza', '1995-09-30', null, 'lucas.souza@email.com', '+55 81 98111-0002', 'ONLINE', 'ATIVO', 'B2', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', '2025-08-10', 'Promoção no trabalho', 'Games, música', null),
  ('33333333-3333-3333-3333-333333333303', 'Mariana Oliveira Lima', '2001-01-22', null, 'mariana.lima@email.com', '+55 81 98111-0003', 'ONLINE', 'INADIMPLENTE', 'A2', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222203', '2025-09-15', 'Intercâmbio no Canadá', 'Fotografia, culinária', 'Faltas recorrentes nas últimas semanas.'),
  ('33333333-3333-3333-3333-333333333304', 'Pedro Henrique Alves', '1990-12-05', null, 'pedro.alves@email.com', '+55 81 98111-0004', 'ONLINE', 'PAUSADO', 'A2', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222203', '2025-09-20', 'Viagem a trabalho', 'Futebol, investimentos', null),
  ('33333333-3333-3333-3333-333333333305', 'Juliana Ferreira Rocha', '1999-07-18', null, 'juliana.rocha@email.com', '+55 81 98111-0005', 'ONLINE', 'EXPERIMENTAL', 'A1', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222203', '2026-06-01', 'Começar do zero', 'Yoga, leitura', null),
  ('33333333-3333-3333-3333-333333333306', 'Rodrigo Nunes Barbosa', '1988-03-25', '222.333.444-55', 'rodrigo.barbosa@email.com', '+55 81 98111-0006', 'PRESENCIAL', 'ATIVO', 'C1', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', '2025-08-01', 'Negociações com clientes no exterior', 'Golfe, vinhos', null),
  ('33333333-3333-3333-3333-333333333307', 'Fernanda Gomes Dias', '1993-11-11', null, 'fernanda.dias@email.com', '+55 81 98111-0007', 'PRESENCIAL', 'ATIVO', 'C1', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', '2025-08-03', 'Certificação TOEFL', 'Teatro, dança', null),
  ('33333333-3333-3333-3333-333333333308', 'Gabriel Martins Costa', '2005-06-14', null, 'gabriel.costa@email.com', '+55 81 98111-0008', 'PRESENCIAL', 'ATIVO', 'A1', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222204', '2026-02-01', 'Acompanhar a escola', 'Skate, desenho', null),
  ('33333333-3333-3333-3333-333333333309', 'Camila Ribeiro Santos', '2004-02-28', null, 'camila.santos@email.com', '+55 81 98111-0009', 'PRESENCIAL', 'INADIMPLENTE', 'A1', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222204', '2026-02-05', 'Vestibular e intercâmbio', 'K-pop, idiomas', 'Família sem retorno sobre renegociação.'),
  ('33333333-3333-3333-3333-333333333310', 'Thiago Almeida Pinto', '1996-10-08', null, 'thiago.pinto@email.com', '+55 81 98111-0010', 'PRESENCIAL', 'CANCELADO', 'A1', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222204', '2026-01-10', 'Curso básico', 'Carros, trilhas', 'Cancelou por mudança de cidade.')
on conflict (id) do nothing;

-- ─── RESPONSÁVEIS ─────────────────────────────────────────────
insert into public.wind_guardians (id, name, relationship, whatsapp, email, cpf, notes) values
  ('44444444-4444-4444-4444-444444444401', 'Marcos Carvalho', 'Pai', '+55 81 98222-0001', 'marcos.carvalho@email.com', '333.444.555-66', null),
  ('44444444-4444-4444-4444-444444444402', 'Sandra Souza', 'Mãe', '+55 81 98222-0002', 'sandra.souza@email.com', null, null),
  ('44444444-4444-4444-4444-444444444403', 'Roberto Lima', 'Pai', '+55 81 98222-0003', 'roberto.lima@email.com', null, 'Responsável financeiro.'),
  ('44444444-4444-4444-4444-444444444404', 'Patrícia Alves', 'Esposa', '+55 81 98222-0004', null, null, null),
  ('44444444-4444-4444-4444-444444444405', 'Helena Rocha', 'Mãe', '+55 81 98222-0005', 'helena.rocha@email.com', null, null),
  ('44444444-4444-4444-4444-444444444406', 'Cláudia Barbosa', 'Esposa', '+55 81 98222-0006', null, null, null),
  ('44444444-4444-4444-4444-444444444407', 'Antônio Dias', 'Pai', '+55 81 98222-0007', 'antonio.dias@email.com', null, null),
  ('44444444-4444-4444-4444-444444444408', 'Vera Costa', 'Mãe', '+55 81 98222-0008', 'vera.costa@email.com', '444.555.666-77', null),
  ('44444444-4444-4444-4444-444444444409', 'Luciano Santos', 'Pai', '+55 81 98222-0009', null, null, 'Sem retorno desde maio/2026.'),
  ('44444444-4444-4444-4444-444444444410', 'Regina Pinto', 'Mãe', '+55 81 98222-0010', 'regina.pinto@email.com', null, null)
on conflict (id) do nothing;

-- ─── VÍNCULO ALUNO ↔ RESPONSÁVEL ──────────────────────────────
insert into public.wind_student_guardians (student_id, guardian_id) values
  ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444401'),
  ('33333333-3333-3333-3333-333333333302', '44444444-4444-4444-4444-444444444402'),
  ('33333333-3333-3333-3333-333333333303', '44444444-4444-4444-4444-444444444403'),
  ('33333333-3333-3333-3333-333333333304', '44444444-4444-4444-4444-444444444404'),
  ('33333333-3333-3333-3333-333333333305', '44444444-4444-4444-4444-444444444405'),
  ('33333333-3333-3333-3333-333333333306', '44444444-4444-4444-4444-444444444406'),
  ('33333333-3333-3333-3333-333333333307', '44444444-4444-4444-4444-444444444407'),
  ('33333333-3333-3333-3333-333333333308', '44444444-4444-4444-4444-444444444408'),
  ('33333333-3333-3333-3333-333333333309', '44444444-4444-4444-4444-444444444409'),
  ('33333333-3333-3333-3333-333333333310', '44444444-4444-4444-4444-444444444410')
on conflict do nothing;

-- ─── MATRÍCULAS ───────────────────────────────────────────────
insert into public.wind_enrollments (id, student_id, class_id, start_date, status, monthly_amount, due_day, payment_method, discount_amount) values
  ('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '2025-08-05', 'ATIVA', 320, 5, 'PIX', 0),
  ('55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', '2025-08-10', 'ATIVA', 320, 5, 'BOLETO', 0),
  ('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222203', '2025-09-15', 'ATIVA', 320, 15, 'PIX', 0),
  ('55555555-5555-5555-5555-555555555504', '33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', '2025-09-20', 'PAUSADA', 320, 15, 'BOLETO', 0),
  ('55555555-5555-5555-5555-555555555505', '33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222203', '2026-06-01', 'ATIVA', 320, 25, 'PIX', 320),
  ('55555555-5555-5555-5555-555555555506', '33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222202', '2025-08-01', 'ATIVA', 420, 5, 'BOLETO', 0),
  ('55555555-5555-5555-5555-555555555507', '33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222202', '2025-08-03', 'ATIVA', 420, 15, 'PIX', 0),
  ('55555555-5555-5555-5555-555555555508', '33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222204', '2026-02-01', 'ATIVA', 420, 25, 'BOLETO', 0),
  ('55555555-5555-5555-5555-555555555509', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222204', '2026-02-05', 'ATIVA', 420, 25, 'PIX', 0),
  ('55555555-5555-5555-5555-555555555510', '33333333-3333-3333-3333-333333333310', '22222222-2222-2222-2222-222222222204', '2026-01-10', 'CANCELADA', 420, 5, 'BOLETO', 0)
on conflict (id) do nothing;

-- ─── PAGAMENTOS (Junho/2026) ──────────────────────────────────
-- final_amount é coluna gerada (amount - discount_amount) — não inserir.
insert into public.wind_payments (id, student_id, enrollment_id, reference_month, description, amount, discount_amount, due_date, payment_date, payment_method, status) values
  ('66666666-6666-6666-6666-666666666601', '33333333-3333-3333-3333-333333333301', '55555555-5555-5555-5555-555555555501', '2026-06', 'Mensalidade Junho/2026', 320, 0, '2026-06-05', '2026-06-05', 'PIX', 'PAGO'),
  ('66666666-6666-6666-6666-666666666602', '33333333-3333-3333-3333-333333333302', '55555555-5555-5555-5555-555555555502', '2026-06', 'Mensalidade Junho/2026', 320, 0, '2026-06-05', '2026-06-05', 'PIX', 'PAGO'),
  ('66666666-6666-6666-6666-666666666603', '33333333-3333-3333-3333-333333333303', '55555555-5555-5555-5555-555555555503', '2026-06', 'Mensalidade Junho/2026', 320, 0, '2026-06-15', null, null, 'ATRASADO'),
  ('66666666-6666-6666-6666-666666666604', '33333333-3333-3333-3333-333333333304', '55555555-5555-5555-5555-555555555504', '2026-06', 'Mensalidade Junho/2026', 320, 0, '2026-06-15', null, null, 'CANCELADO'),
  ('66666666-6666-6666-6666-666666666605', '33333333-3333-3333-3333-333333333305', '55555555-5555-5555-5555-555555555505', '2026-06', 'Mensalidade Junho/2026', 320, 320, '2026-06-25', null, null, 'PENDENTE'),
  ('66666666-6666-6666-6666-666666666606', '33333333-3333-3333-3333-333333333306', '55555555-5555-5555-5555-555555555506', '2026-06', 'Mensalidade Junho/2026', 420, 0, '2026-06-05', '2026-06-05', 'PIX', 'PAGO'),
  ('66666666-6666-6666-6666-666666666607', '33333333-3333-3333-3333-333333333307', '55555555-5555-5555-5555-555555555507', '2026-06', 'Mensalidade Junho/2026', 420, 0, '2026-06-15', null, null, 'PENDENTE'),
  ('66666666-6666-6666-6666-666666666608', '33333333-3333-3333-3333-333333333308', '55555555-5555-5555-5555-555555555508', '2026-06', 'Mensalidade Junho/2026', 420, 0, '2026-06-25', '2026-06-25', 'PIX', 'PAGO'),
  ('66666666-6666-6666-6666-666666666609', '33333333-3333-3333-3333-333333333309', '55555555-5555-5555-5555-555555555509', '2026-06', 'Mensalidade Junho/2026', 420, 0, '2026-06-25', null, null, 'ATRASADO'),
  ('66666666-6666-6666-6666-666666666610', '33333333-3333-3333-3333-333333333310', '55555555-5555-5555-5555-555555555510', '2026-06', 'Mensalidade Junho/2026', 420, 0, '2026-06-05', null, null, 'CANCELADO')
on conflict (enrollment_id, reference_month) do nothing;

-- ─── LOGS / CRM ───────────────────────────────────────────────
-- author_id = perfil admin (logs de professores atribuídos ao admin por ora).
insert into public.wind_student_logs (id, student_id, author_id, log_type, title, content, sentiment, next_action, next_action_date) values
  ('77777777-7777-7777-7777-777777777701', '33333333-3333-3333-3333-333333333301', (select id from public.wind_profiles where email='maxbrunomelo@hotmail.com'), 'PEDAGOGICO', 'Avanço em conversação', 'Ana apresentou ótima evolução em fluência durante o role-play de entrevista.', 'POSITIVO', null, null),
  ('77777777-7777-7777-7777-777777777702', '33333333-3333-3333-3333-333333333303', (select id from public.wind_profiles where email='maxbrunomelo@hotmail.com'), 'FINANCEIRO', 'Mensalidade em atraso', 'Contato via WhatsApp sobre a mensalidade de junho. Aguardando retorno.', 'NEGATIVO', 'Reenviar boleto', '2026-06-18'),
  ('77777777-7777-7777-7777-777777777703', '33333333-3333-3333-3333-333333333303', (select id from public.wind_profiles where email='maxbrunomelo@hotmail.com'), 'ALERTA', 'Faltas recorrentes', 'Aluna faltou às 3 últimas aulas. Risco de evasão.', 'RISCO', 'Ligar para responsável', '2026-06-16'),
  ('77777777-7777-7777-7777-777777777704', '33333333-3333-3333-3333-333333333306', (select id from public.wind_profiles where email='maxbrunomelo@hotmail.com'), 'REUNIAO', 'Reunião de acompanhamento', 'Rodrigo solicitou foco em vocabulário de negociação. Plano ajustado.', 'POSITIVO', null, null),
  ('77777777-7777-7777-7777-777777777705', '33333333-3333-3333-3333-333333333309', (select id from public.wind_profiles where email='maxbrunomelo@hotmail.com'), 'ATENDIMENTO', 'Família sem retorno', 'Tentativas de contato com o responsável sem sucesso desde maio.', 'RISCO', 'Nova tentativa de contato', '2026-06-17'),
  ('77777777-7777-7777-7777-777777777706', '33333333-3333-3333-3333-333333333310', (select id from public.wind_profiles where email='maxbrunomelo@hotmail.com'), 'CANCELAMENTO', 'Cancelamento por mudança', 'Aluno cancelou matrícula devido a mudança de cidade.', 'NEUTRO', null, null)
on conflict (id) do nothing;

-- ─── RELATÓRIOS PEDAGÓGICOS ───────────────────────────────────
insert into public.wind_pedagogical_reports (id, student_id, teacher_id, reference_period, cefr_level, speaking_progress, listening_progress, reading_progress, writing_progress, strengths, improvement_points, teacher_comments, recommendations, status) values
  ('88888888-8888-8888-8888-888888888801', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'Maio/2026', 'B2', 85, 80, 75, 65, 'Excelente fluência e pronúncia.', 'Escrita formal e uso de conectivos.', 'Evolução consistente no semestre.', 'Praticar essays semanais.', 'ENVIADO'),
  ('88888888-8888-8888-8888-888888888802', '33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111102', 'Maio/2026', 'C1', 90, 88, 85, 82, 'Vocabulário de negócios sólido.', 'Idioms e expressões informais.', 'Pronto para certificação avançada.', null, 'RASCUNHO')
on conflict (id) do nothing;

-- ─── ALERTAS ──────────────────────────────────────────────────
insert into public.wind_alerts (id, student_id, alert_type, title, description, priority, status, due_date) values
  ('99999999-9999-9999-9999-999999999901', '33333333-3333-3333-3333-333333333303', 'PAGAMENTO_ATRASADO', 'Mensalidade de junho atrasada', 'Pagamento vencido em 15/06 sem retorno.', 'ALTA', 'ABERTO', '2026-06-18'),
  ('99999999-9999-9999-9999-999999999902', '33333333-3333-3333-3333-333333333303', 'RISCO_CANCELAMENTO', 'Risco de evasão', 'Faltas recorrentes + inadimplência.', 'CRITICA', 'EM_ANDAMENTO', '2026-06-16'),
  ('99999999-9999-9999-9999-999999999903', '33333333-3333-3333-3333-333333333309', 'FAMILIA_SEM_RETORNO', 'Família sem retorno', 'Responsável não responde desde maio.', 'ALTA', 'ABERTO', '2026-06-17'),
  ('99999999-9999-9999-9999-999999999904', '33333333-3333-3333-3333-333333333302', 'RENOVACAO_PROXIMA', 'Renovação de matrícula', 'Ciclo encerra em julho. Iniciar conversa de renovação.', 'MEDIA', 'ABERTO', '2026-06-30'),
  ('99999999-9999-9999-9999-999999999905', '33333333-3333-3333-3333-333333333305', 'SEM_REGISTRO_PEDAGOGICO', 'Sem registro pedagógico', 'Aluna experimental sem nenhum registro nos últimos 10 dias.', 'BAIXA', 'ABERTO', null)
on conflict (id) do nothing;
