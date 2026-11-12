# Ciclo 360° · site de desafios

Site complementar ao material concreto do ciclo trigonométrico (Desafio 360° – Matemática que Transforma).
O aluno resolve desafios usando o ciclo de papelão ou o ciclo digital, ganha pontos e aparece no ranking.

## Como abrir
Abra `index.html` no navegador (dois cliques). Não precisa de servidor.
Sem banco de dados, o site funciona em modo de demonstração (dados só neste navegador, com alunos de exemplo no ranking).
Para ligar ao banco de dados online, siga `database/README.md`.

## Estrutura
```
index.html            entrada: login e cadastro
desafios.html         cartas-desafio, filtros e resolução
ranking.html          pódio, classificação, CSV (professor)
perfil.html           nível, progresso, conquistas, histórico
prototipo/            ciclo digital interativo
css/  base.css        cores, tipografia, modo escuro
      components.css  botões, formulários, modal, avisos
      pages.css       estilos de cada página
js/   config.js       modo de armazenamento e URL da API
      data/           banco de desafios, dificuldades e temas
      core/           correção de respostas e regras de pontuação
      services/       Supabase, armazenamento local, API REST e sessão
      vendor/         biblioteca do Supabase (incluída, funciona sem internet extra)
      ui/             cabeçalho e componentes compartilhados
      pages/          lógica de cada página
database/             supabase.sql (tabelas, segurança, desafios) e guia passo a passo
```

## Personagens e lições
Radi (o mascote, um ciclo com um ponteiro no lugar do braço), Sena (seno), Cosi (cosseno) e Tang (tangente)
apresentam as perguntas. As lições funcionam como um jogo: peças para tocar, ciclo para girar,
reação na hora, sequência de acertos, perguntas erradas voltando no fim e resumo com confete.
Arquivos: `js/ui/mascot.js`, `js/ui/lesson.js`, `js/ui/sfx.js` e `css/lesson.css`.

## Regras de pontuação
Fácil 10 · Médio 20 · Difícil 35 · Desafio 360 50 pontos.
Cada erro tira 20% e cada dica tira 30%; quem acerta leva no mínimo 30%.

## Banco de dados
Supabase (PostgreSQL). Passo a passo em `database/README.md`.
