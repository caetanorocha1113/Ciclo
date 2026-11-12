/**
 * Regras de pontuação, níveis e conquistas.
 * Ficam separadas do armazenamento para que o servidor possa usar exatamente as mesmas
 * regras no futuro (ou validar os pontos enviados pelo navegador).
 */
window.C360 = window.C360 || {};

C360.scoring = (function () {
  const PENALIDADE_ERRO = 0.2;   // cada tentativa errada tira 20% da pontuação
  const PENALIDADE_DICA = 0.3;   // cada dica tira 30%
  const MINIMO = 0.3;            // quem acerta sempre leva pelo menos 30%

  const LEVELS = [
    { min: 0,   nome: "Iniciante" },
    { min: 80,  nome: "Explorador do ciclo" },
    { min: 200, nome: "Medidor de réguas" },
    { min: 380, nome: "Navegador dos quadrantes" },
    { min: 600, nome: "Mestre 360" }
  ];

  /* Em porcentagem inteira para dar exatamente o mesmo resultado do banco de dados. */
  function percent(erros, dicas) {
    return Math.max(MINIMO * 100, 100 - PENALIDADE_ERRO * 100 * erros - PENALIDADE_DICA * 100 * dicas);
  }
  function multiplier(erros, dicas) { return percent(erros, dicas) / 100; }

  function pointsFor(challenge, erros = 0, dicas = 0) {
    const base = C360.DIFFICULTIES[challenge.dificuldade].pontos;
    return Math.round(base * Math.round(percent(erros, dicas)) / 100);
  }

  function levelFor(pontos) {
    let i = 0;
    LEVELS.forEach((l, idx) => { if (pontos >= l.min) i = idx; });
    const atual = LEVELS[i];
    const proximo = LEVELS[i + 1] || null;
    const progresso = proximo ? (pontos - atual.min) / (proximo.min - atual.min) : 1;
    return { numero: i + 1, atual, proximo, progresso: Math.max(0, Math.min(1, progresso)) };
  }

  /** Resumo do progresso de um usuário. progress = registros vindos do armazenamento. */
  function summarize(progress, challenges) {
    const byId = Object.fromEntries(challenges.map(c => [c.id, c]));
    const done = progress.filter(p => p.concluido && byId[p.challengeId]);
    const porDificuldade = {};
    Object.keys(C360.DIFFICULTIES).forEach(d => {
      porDificuldade[d] = { feitos: 0, total: challenges.filter(c => c.dificuldade === d).length };
    });
    const porTema = {};
    Object.keys(C360.THEMES).forEach(t => {
      porTema[t] = { feitos: 0, total: challenges.filter(c => c.tema === t).length };
    });
    let pontos = 0, dePrimeira = 0;
    done.forEach(p => {
      const c = byId[p.challengeId];
      pontos += p.pontos || 0;
      porDificuldade[c.dificuldade].feitos++;
      porTema[c.tema].feitos++;
      if (!p.erros && !p.dicas) dePrimeira++;
    });
    return {
      pontos, concluidos: done.length, total: challenges.length,
      dePrimeira, porDificuldade, porTema, nivel: levelFor(pontos)
    };
  }

  const BADGES = [
    { id: "primeiro", nome: "Primeiro giro", descricao: "Faça 1 desafio.",
      check: s => s.concluidos >= 1 },
    { id: "deprimeira", nome: "Sem rodinhas", descricao: "Acerte 5 de primeira.",
      check: s => s.dePrimeira >= 5 },
    { id: "faceis", nome: "Base firme", descricao: "Faça todos os fáceis.",
      check: s => s.porDificuldade.facil.feitos === s.porDificuldade.facil.total },
    { id: "radianos", nome: "Fala radiano", descricao: "Faça todos de radianos.",
      check: s => s.porTema.radianos.feitos === s.porTema.radianos.total },
    { id: "temas", nome: "Volta por tudo", descricao: "Faça 1 de cada tema.",
      check: s => Object.values(s.porTema).every(t => t.feitos > 0) },
    { id: "d360", nome: "Encarou o 360", descricao: "Faça 1 Desafio 360.",
      check: s => s.porDificuldade.desafio360.feitos >= 1 },
    { id: "mestre", nome: "Volta completa", descricao: "Faça todos.",
      check: s => s.concluidos === s.total && s.total > 0 }
  ];

  function badgesFor(summary) {
    return BADGES.map(b => ({ id: b.id, nome: b.nome, descricao: b.descricao, conquistada: b.check(summary) }));
  }

  /** Dias seguidos com algum desafio respondido (contando hoje ou, se ainda não jogou hoje, ontem). */
  function streak(progress) {
    const key = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const days = new Set(progress.filter(p => p.atualizadoEm).map(p => key(new Date(p.atualizadoEm))));
    const d = new Date();
    if (!days.has(key(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (days.has(key(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  return { streak, pointsFor, multiplier, levelFor, summarize, badgesFor, LEVELS, PENALIDADE_DICA, PENALIDADE_ERRO };
})();
