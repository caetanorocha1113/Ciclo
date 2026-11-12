-- =====================================================================
--  Ciclo 360° · banco de dados no Supabase
--  Como usar: Supabase → SQL Editor → New query → cole TUDO → Run.
--  Pode rodar de novo depois: os desafios são atualizados sem apagar nada.
-- =====================================================================

-- ---------- 1. Perfis (um por usuário cadastrado) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null check (char_length(nome) between 2 and 120),
  email      text,
  turma      text,
  papel      text not null default 'aluno' check (papel in ('aluno', 'professor')),
  criado_em  timestamptz not null default now()
);

-- Cria o perfil automaticamente quando alguém se cadastra no site
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, nome, email, turma, papel)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'nome'), ''), split_part(new.email, '@', 1)),
    new.email,
    nullif(trim(new.raw_user_meta_data->>'turma'), ''),
    case when new.raw_user_meta_data->>'papel' = 'professor' then 'professor' else 'aluno' end
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 2. Desafios ----------
create table if not exists public.challenges (
  id          text primary key,
  ordem       int  not null default 0,
  dificuldade text not null check (dificuldade in ('facil', 'medio', 'dificil', 'desafio360')),
  tema        text not null,
  titulo      text not null,
  no_ciclo    text not null,
  enunciado   text not null,
  tipo        text not null check (tipo in ('escolha', 'numero', 'angulo')),
  opcoes      jsonb,
  resposta    numeric not null,
  tolerancia  numeric,
  dicas       jsonb not null default '[]',
  explicacao  text not null,
  visual      jsonb,
  ativo       boolean not null default true
);

-- ---------- 3. Progresso de cada aluno em cada desafio ----------
create table if not exists public.progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  challenge_id  text not null references public.challenges(id) on delete cascade,
  concluido     boolean  not null default false,
  erros         smallint not null default 0 check (erros >= 0),
  dicas         smallint not null default 0 check (dicas >= 0),
  pontos        smallint not null default 0,
  atualizado_em timestamptz not null default now(),
  unique (user_id, challenge_id)
);
create index if not exists idx_progress_user on public.progress(user_id);

-- Os pontos são calculados AQUI, no banco, com as mesmas regras do site:
-- 20% a menos por erro, 30% a menos por dica, mínimo de 30%.
-- Depois de concluído, o desafio não muda mais (ninguém refaz para ganhar mais pontos).
create or replace function public.calc_progress()
returns trigger language plpgsql set search_path = '' as $$
declare
  base int;
  pct  int;
begin
  if tg_op = 'UPDATE' then
    if old.concluido then return old; end if;
    new.user_id := old.user_id;
    new.erros := greatest(new.erros, old.erros);
    new.dicas := greatest(new.dicas, old.dicas);
  end if;

  select case dificuldade when 'facil' then 10 when 'medio' then 20 when 'dificil' then 35 else 50 end
    into base from public.challenges where id = new.challenge_id;

  pct := greatest(30, 100 - 20 * new.erros - 30 * new.dicas);
  new.pontos := case when new.concluido then round(base * pct / 100.0) else 0 end;
  new.atualizado_em := now();
  return new;
end; $$;

drop trigger if exists progress_calc on public.progress;
create trigger progress_calc
  before insert or update on public.progress
  for each row execute function public.calc_progress();

-- ---------- 4. Segurança (cada um só mexe no que é seu) ----------
alter table public.profiles   enable row level security;
alter table public.challenges enable row level security;
alter table public.progress   enable row level security;

drop policy if exists "perfil: ver o proprio" on public.profiles;
create policy "perfil: ver o proprio" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "perfil: editar o proprio" on public.profiles;
create policy "perfil: editar o proprio" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
-- o aluno pode mudar nome e turma, mas não o papel
revoke update on public.profiles from authenticated, anon;
grant update (nome, turma) on public.profiles to authenticated;

drop policy if exists "desafios: leitura" on public.challenges;
create policy "desafios: leitura" on public.challenges
  for select to authenticated using (ativo);

drop policy if exists "progresso: ver o proprio" on public.progress;
create policy "progresso: ver o proprio" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "progresso: criar o proprio" on public.progress;
create policy "progresso: criar o proprio" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "progresso: alterar o proprio" on public.progress;
create policy "progresso: alterar o proprio" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "progresso: apagar o proprio" on public.progress;
create policy "progresso: apagar o proprio" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------- 5. Ranking e lista de turmas ----------
-- Mostram só nome, turma e pontos de todos, sem expor e-mails nem respostas.
create or replace function public.get_ranking(p_turma text default null)
returns table (user_id uuid, nome text, turma text, pontos bigint, concluidos bigint, ultimo timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nome, p.turma,
         coalesce(sum(g.pontos) filter (where g.concluido), 0)::bigint,
         count(g.id) filter (where g.concluido)::bigint,
         max(g.atualizado_em) filter (where g.concluido)
  from public.profiles p
  left join public.progress g on g.user_id = p.id
  where p.papel = 'aluno' and (p_turma is null or p.turma = p_turma)
  group by p.id, p.nome, p.turma
  order by 4 desc, 5 desc, 6 asc nulls last;
$$;
revoke execute on function public.get_ranking(text) from public, anon;
grant  execute on function public.get_ranking(text) to authenticated;

create or replace function public.list_turmas()
returns setof text language sql stable security definer set search_path = '' as $$
  select distinct turma from public.profiles where coalesce(turma, '') <> '' order by 1;
$$;
grant execute on function public.list_turmas() to anon, authenticated;

-- ---------- 6. Carga dos 25 desafios ----------
insert into public.challenges
  (id, ordem, dificuldade, tema, titulo, no_ciclo, enunciado, tipo, opcoes, resposta, tolerancia, dicas, explicacao, visual)
values
  ('f01', 1, 'facil', 'angulos', 'Para onde aponta o 90°?', 'Comece com o ponteiro em 0° e gire no sentido anti-horário até a marca de 90°.', 'Com o ponteiro em 90°, para onde ele aponta?', 'escolha', '["Para a direita","Para cima","Para a esquerda","Para baixo"]'::jsonb, 1, NULL, '["O 0° fica à direita, sobre o eixo x.","Um quarto de volta no sentido anti-horário leva ao eixo y positivo."]'::jsonb, 'No ciclo, o 0° fica à direita e os ângulos crescem no sentido anti-horário. 90° é um quarto de volta: o ponteiro fica para cima, sobre o eixo y.', '{"angulo":90}'::jsonb),
  ('f02', 2, 'facil', 'angulos', 'Que quadrante é esse?', 'Gire o ponteiro até 135° e observe a cor do quadrante.', 'Em qual quadrante fica o ângulo de 135°?', 'escolha', '["1º quadrante","2º quadrante","3º quadrante","4º quadrante"]'::jsonb, 1, NULL, '["O 1º quadrante vai de 0° a 90°.","135° está entre 90° e 180°."]'::jsonb, 'O 2º quadrante vai de 90° a 180°. Como 135° está nesse intervalo, o ponto fica acima do eixo x e à esquerda do eixo y.', '{"angulo":135}'::jsonb),
  ('f03', 3, 'facil', 'senocos', 'Primeira leitura do seno', 'Leve o ponteiro a 30° e deslize a régua vermelha (seno) até encostar na ponta.', 'Quanto vale sen 30°? Responda em número decimal ou fração.', 'numero', NULL, 0.5, 0.02, '["Com raio de 10 cm, a régua do seno para a 5 cm do centro.","5 cm de 10 cm é metade."]'::jsonb, 'A régua do seno para na metade do raio. Como o raio vale 1, sen 30° = 1/2 = 0,5.', '{"angulo":30}'::jsonb),
  ('f04', 4, 'facil', 'senocos', 'Cosseno no começo da volta', 'Deixe o ponteiro em 0° e deslize a régua azul (cosseno) até a ponta.', 'Quanto vale cos 0°?', 'numero', NULL, 1, 0.02, '["Em 0°, a ponta do ponteiro está sobre o eixo x.","A régua azul vai até o final do raio."]'::jsonb, 'Em 0° o ponto está na extremidade direita do eixo x, a uma unidade do centro. Por isso cos 0° = 1.', '{"angulo":0}'::jsonb),
  ('f05', 5, 'facil', 'radianos', 'Meia volta', 'Procure o π no anel interno do disco e veja qual grau está ao lado.', 'π rad corresponde a quantos graus?', 'angulo', NULL, 180, NULL, '["π é meia volta.","Uma volta completa tem 360°."]'::jsonb, 'Uma volta completa vale 2π rad = 360°. Então π rad, que é meia volta, vale 180°.', NULL),
  ('f06', 6, 'facil', 'senocos', 'Lá embaixo', 'Gire até 270° e deslize a régua do seno até a ponta.', 'Quanto vale sen 270°?', 'numero', NULL, -1, 0.02, '["Em 270° o ponteiro aponta para baixo.","Abaixo do eixo x o seno é negativo."]'::jsonb, 'Em 270° o ponto está na extremidade inferior do eixo y, uma unidade abaixo do centro. Logo sen 270° = −1.', '{"angulo":270}'::jsonb),
  ('m01', 7, 'medio', 'senocos', 'O cosseno de 60°', 'Leve o ponteiro a 60° e use a régua azul.', 'Quanto vale cos 60°?', 'numero', NULL, 0.5, 0.02, '["Compare com o seno de 30°.","A régua azul para na metade do raio."]'::jsonb, 'Em 60° a régua do cosseno para a 5 cm do centro: cos 60° = 1/2. Repare que cos 60° = sen 30°.', '{"angulo":60}'::jsonb),
  ('m02', 8, 'medio', 'senocos', 'A diagonal', 'Gire até 45° e deslize as duas réguas até a ponta. Compare as duas.', 'Quanto vale sen 45°? (pode responder √2/2 ou com duas casas decimais)', 'numero', NULL, 0.7071067811865476, 0.02, '["Em 45° as duas réguas param na mesma distância.","A régua para em aproximadamente 7,1 cm."]'::jsonb, 'Em 45° o ponto fica exatamente na diagonal, então seno e cosseno são iguais: √2/2 ≈ 0,71.', '{"angulo":45}'::jsonb),
  ('m03', 9, 'medio', 'radianos', 'De radianos para graus', 'Encontre 5π/6 no anel interno e leia o grau correspondente.', 'Quantos graus vale 5π/6 rad?', 'angulo', NULL, 150, NULL, '["π/6 corresponde a 30°.","5 vezes 30°."]'::jsonb, 'Como π/6 = 30°, temos 5π/6 = 5 × 30° = 150°.', NULL),
  ('m04', 10, 'medio', 'sinais', 'Cosseno do 2º quadrante', 'Gire por todo o 2º quadrante (de 90° a 180°) e veja para que lado vai a régua azul.', 'No 2º quadrante, o cosseno é:', 'escolha', '["Positivo","Negativo","Sempre zero","Depende do ângulo"]'::jsonb, 1, NULL, '["O cosseno é a posição horizontal do ponto.","No 2º quadrante o ponto está à esquerda do eixo y."]'::jsonb, 'No 2º quadrante o ponto fica à esquerda do eixo y, então a régua do cosseno marca valores negativos.', '{"quadrante":2}'::jsonb),
  ('m05', 11, 'medio', 'simetria', 'Mesma altura, outro lado', 'Deixe a régua do seno na altura de 30° e procure outro ângulo em que a ponta encosta nela.', 'Qual ângulo do 2º quadrante tem seno igual a 1/2?', 'angulo', NULL, 150, NULL, '["O ponto precisa ficar na mesma altura de 30°, só que à esquerda.","Quanto falta para 180°?"]'::jsonb, '150° é o simétrico de 30° em relação ao eixo y: mesma altura, outro lado. Por isso sen 150° = sen 30° = 1/2.', '{"angulo":30}'::jsonb),
  ('m06', 12, 'medio', 'tangente', 'Tangente da diagonal', 'Gire até 45°, estique o barbante ao longo do ponteiro até a reta da tangente e leia a escala.', 'Quanto vale tg 45°?', 'numero', NULL, 1, 0.03, '["Em 45°, seno e cosseno são iguais.","tg = sen ÷ cos."]'::jsonb, 'O barbante cruza a reta x = 1 na marca 1. Faz sentido: tg 45° = sen 45° ÷ cos 45° = 1.', '{"angulo":45}'::jsonb),
  ('m07', 13, 'medio', 'radianos', 'Três quartos de volta', 'Encontre 3π/2 no anel interno.', 'Quantos graus vale 3π/2 rad?', 'angulo', NULL, 270, NULL, '["π vale 180°.","3π/2 = 3 × 90°."]'::jsonb, 'π/2 vale 90°, então 3π/2 = 3 × 90° = 270°, três quartos de volta.', NULL),
  ('d01', 14, 'dificil', 'simetria', 'Seno no 3º quadrante', 'Gire até 210° e compare a régua do seno com a de 30°.', 'Quanto vale sen 210°?', 'numero', NULL, -0.5, 0.02, '["210° = 180° + 30°.","A distância é a mesma de 30°, mas o ponto está abaixo do eixo x."]'::jsonb, '210° fica meia volta depois de 30°. A régua para à mesma distância (0,5), mas abaixo do eixo x: sen 210° = −1/2.', '{"angulo":210}'::jsonb),
  ('d02', 15, 'dificil', 'simetria', 'Cosseno no 4º quadrante', 'Gire até 300° e leia a régua azul.', 'Quanto vale cos 300°?', 'numero', NULL, 0.5, 0.02, '["300° = 360° − 60°.","No 4º quadrante o ponto está à direita do eixo y."]'::jsonb, '300° é o simétrico de 60° em relação ao eixo x. A régua do cosseno fica no mesmo lugar: cos 300° = cos 60° = 1/2.', '{"angulo":300}'::jsonb),
  ('d03', 16, 'dificil', 'simetria', 'Espelho do 45°', 'Deixe a régua azul na posição de 45° e procure o ângulo do 4º quadrante que encosta nela.', 'Qual ângulo do 4º quadrante tem o mesmo cosseno de 45°?', 'angulo', NULL, 315, NULL, '["O ponto desce para baixo do eixo x, sem mudar a posição horizontal.","Quanto falta de 45° para 360°?"]'::jsonb, '315° = 360° − 45°. É o espelho de 45° em relação ao eixo x, com o mesmo cosseno: √2/2.', '{"angulo":45}'::jsonb),
  ('d04', 17, 'dificil', 'sinais', 'Dois negativos', 'Monte as placas de sinais dos quatro quadrantes e procure onde seno e tangente são ambos −.', 'Em qual quadrante o seno e a tangente são negativos ao mesmo tempo?', 'escolha', '["1º quadrante","2º quadrante","3º quadrante","4º quadrante"]'::jsonb, 3, NULL, '["Seno negativo: 3º e 4º quadrantes.","Tangente negativa: quando seno e cosseno têm sinais diferentes."]'::jsonb, 'Seno negativo acontece no 3º e no 4º quadrantes. No 3º, o cosseno também é negativo e a tangente fica positiva. Só no 4º os dois são negativos.', NULL),
  ('d05', 18, 'dificil', 'tangente', 'Barbante para o outro lado', 'Gire até 120°. Estique o barbante do ponteiro, passando pelo centro, até a reta da tangente.', 'Quanto vale tg 120°? (responda −√3 ou com duas casas decimais)', 'numero', NULL, -1.7320508075688772, 0.03, '["O barbante cruza a reta abaixo do eixo x.","Compare com tg 60° ≈ 1,73."]'::jsonb, 'Em 120° o barbante passa pelo centro e cruza a reta x = 1 em −1,73. tg 120° = −√3.', '{"angulo":120}'::jsonb),
  ('d06', 19, 'dificil', 'tangente', 'Tangente igual a 1, de novo', 'Gire pelo 3º quadrante observando onde o barbante cruza a reta da tangente.', 'Qual ângulo do 3º quadrante tem tangente igual a 1?', 'angulo', NULL, 225, NULL, '["No 3º quadrante, seno e cosseno são negativos: a divisão fica positiva.","Meia volta depois de 45°."]'::jsonb, '225° = 180° + 45°. Seno e cosseno valem −√2/2, então tg 225° = 1, igual a tg 45°.', '{"quadrante":3}'::jsonb),
  ('d07', 20, 'dificil', 'radianos', 'Cosseno em radianos', 'Encontre 4π/3 no anel interno, gire até lá e leia a régua azul.', 'Quanto vale cos(4π/3)?', 'numero', NULL, -0.5, 0.02, '["4π/3 rad = 240°.","240° = 180° + 60°."]'::jsonb, '4π/3 = 240°, no 3º quadrante. A régua azul fica à mesma distância de 60°, mas à esquerda: cos(4π/3) = −1/2.', NULL),
  ('x01', 21, 'desafio360', 'simetria', 'Dois ângulos, um seno', 'Posicione a régua do seno em −0,87 e encontre os dois ângulos em que a ponta encosta nela.', 'Entre 0° e 360°, dois ângulos têm seno igual a −√3/2. Digite o menor deles.', 'angulo', NULL, 240, NULL, '["sen 60° = √3/2. Procure ângulos com a mesma distância, abaixo do eixo x.","As respostas estão no 3º e no 4º quadrantes."]'::jsonb, 'Os ângulos são 240° (180° + 60°) e 300° (360° − 60°). O menor é 240°.', NULL),
  ('x02', 22, 'desafio360', 'simetria', 'Réguas opostas', 'Procure um ângulo em que as duas réguas fiquem à mesma distância do centro, mas em lados opostos.', 'Qual ângulo do 2º quadrante tem sen = −cos?', 'angulo', NULL, 135, NULL, '["Distâncias iguais acontecem nas diagonais (45°, 135°, 225°, 315°).","No 2º quadrante o seno é + e o cosseno é −."]'::jsonb, 'Em 135°, sen = √2/2 e cos = −√2/2. Mesma distância, sinais opostos: sen = −cos.', '{"quadrante":2}'::jsonb),
  ('x03', 23, 'desafio360', 'senocos', 'A conta que sempre dá igual', 'Gire até 150°, leia as duas réguas, eleve cada valor ao quadrado e some. Teste em outros ângulos.', 'Quanto vale sen²150° + cos²150°?', 'numero', NULL, 1, 0.02, '["sen 150° = 1/2 e cos 150° = −√3/2.","1/4 + 3/4."]'::jsonb, '1/4 + 3/4 = 1. É a relação fundamental: o ponteiro tem sempre comprimento 1, e as réguas formam um triângulo retângulo com ele (Pitágoras).', '{"angulo":150}'::jsonb),
  ('x04', 24, 'desafio360', 'sinais', 'Contando no disco', 'Gire por todas as 16 marcas do disco e conte em quantas a régua azul fica à esquerda do eixo y.', 'Quantos dos 16 ângulos notáveis do ciclo têm cosseno negativo?', 'numero', NULL, 7, 0, '["Cosseno negativo: 2º e 3º quadrantes, e também 180°.","90° e 270° têm cosseno zero, não negativo."]'::jsonb, 'São 120°, 135°, 150°, 180°, 210°, 225° e 240°: sete ângulos. Em 90° e 270° o cosseno é zero.', NULL),
  ('x05', 25, 'desafio360', 'tangente', 'O barbante que nunca chega', 'Gire devagar pelo 1º quadrante e observe o barbante se aproximar do topo da reta da tangente.', 'Qual é o menor ângulo positivo em que a tangente não existe?', 'angulo', NULL, 90, NULL, '["Procure onde o barbante fica paralelo à reta x = 1.","Isso acontece quando o cosseno é zero."]'::jsonb, 'Em 90° o barbante fica paralelo à reta da tangente e nunca a cruza. Como cos 90° = 0, a divisão sen ÷ cos não existe.', '{"quadrante":1}'::jsonb)
on conflict (id) do update set
  ordem = excluded.ordem, dificuldade = excluded.dificuldade, tema = excluded.tema,
  titulo = excluded.titulo, no_ciclo = excluded.no_ciclo, enunciado = excluded.enunciado,
  tipo = excluded.tipo, opcoes = excluded.opcoes, resposta = excluded.resposta,
  tolerancia = excluded.tolerancia, dicas = excluded.dicas, explicacao = excluded.explicacao,
  visual = excluded.visual;
