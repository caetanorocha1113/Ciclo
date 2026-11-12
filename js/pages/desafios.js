/* Página de desafios: filtros, cartas e resolução. */
(async function () {
  const $ = id => document.getElementById(id);
  const { esc, toast, difficultyTag } = C360.ui;
  const S = C360.scoring;
  const M = C360.mascot;

  let ctx;
  try { ctx = await C360.ui.bootPage("desafios"); } catch (e) { return; }
  const { user, challenges } = ctx;
  let progress = ctx.progress;
  let summary = ctx.summary;
  const pmap = () => Object.fromEntries(progress.map(p => [p.challengeId, p]));

  const filters = { diff: "todas", tema: "todos", status: "todos" };

  /* ---------- Resumo ---------- */
  function renderSummary() {
    const n = summary.nivel;
    $("lvl-label").textContent = `Nível ${n.numero}`;
    $("lvl-name").textContent = n.atual.nome;
    $("lvl-bar").style.width = Math.round(n.progresso * 100) + "%";
    $("lvl-next").textContent = n.proximo
      ? `Faltam ${n.proximo.min - summary.pontos} pts para ${n.proximo.nome}`
      : "Nível máximo alcançado!";
    $("st-points").textContent = summary.pontos;
    $("st-done").textContent = `${summary.concluidos}/${summary.total}`;
    const dias = S.streak(progress);
    $("st-streak").textContent = dias;
    $("st-streak-label").textContent = dias === 1 ? "dia seguido" : "dias seguidos";
    $("st-streak-box").classList.toggle("is-on", dias > 0);
  }

  /* ---------- Filtros ---------- */
  const diffs = [["todas", "Todas"], ...Object.values(C360.DIFFICULTIES).map(d => [d.id, d.label])];
  $("f-diff").innerHTML = diffs.map(([id, l]) =>
    `<button class="chip" data-diff="${id}" aria-pressed="${id === filters.diff}">${l}</button>`).join("");
  $("f-diff").addEventListener("click", e => {
    const b = e.target.closest("[data-diff]");
    if (!b) return;
    filters.diff = b.dataset.diff;
    $("f-diff").querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    renderCards();
  });
  $("f-tema").innerHTML = `<option value="todos">Todos os temas</option>` +
    Object.entries(C360.THEMES).map(([id, l]) => `<option value="${id}">${l}</option>`).join("");
  $("f-tema").addEventListener("change", e => { filters.tema = e.target.value; renderCards(); });
  $("f-status").addEventListener("change", e => { filters.status = e.target.value; renderCards(); });

  function filtered() {
    const pm = pmap();
    return challenges
      .filter(c => filters.diff === "todas" || c.dificuldade === filters.diff)
      .filter(c => filters.tema === "todos" || c.tema === filters.tema)
      .filter(c => {
        const done = pm[c.id] && pm[c.id].concluido;
        return filters.status === "todos" || (filters.status === "concluidos" ? done : !done);
      })
      .sort((a, b) => C360.DIFFICULTIES[a.dificuldade].ordem - C360.DIFFICULTIES[b.dificuldade].ordem || (a.ordem || 0) - (b.ordem || 0));
  }

  /* ---------- Desenhos ---------- */
  const SVGNS = 'xmlns="http://www.w3.org/2000/svg"';
  function dial(visual) {
    const C = 32, R = 24;
    const P = (d, r) => [(C + r * Math.cos(d * Math.PI / 180)).toFixed(1), (C - r * Math.sin(d * Math.PI / 180)).toFixed(1)];
    let inner = "";
    if (visual && visual.quadrante) {
      const q = visual.quadrante - 1, [x1, y1] = P(q * 90, R), [x2, y2] = P(q * 90 + 90, R);
      inner += `<path class="d-quad" d="M${C} ${C} L${x1} ${y1} A${R} ${R} 0 0 0 ${x2} ${y2} Z"/>`;
    }
    const ticks = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
      .map(d => { const [a1, b1] = P(d, R - 3), [a2, b2] = P(d, R + 3); return `<line class="d-tick" x1="${a1}" y1="${b1}" x2="${a2}" y2="${b2}"/>`; }).join("");
    if (visual && visual.angulo !== undefined) {
      const [x, y] = P(visual.angulo, R);
      inner += `<line class="d-ptr" x1="${C}" y1="${C}" x2="${x}" y2="${y}"/><circle class="d-tip" cx="${x}" cy="${y}" r="3"/>`;
    } else if (!visual) {
      inner += `<text class="d-q" x="${C}" y="${C + 9}" text-anchor="middle">?</text>`;
    }
    const label = visual && visual.angulo !== undefined ? `Ponteiro em ${visual.angulo}°`
      : visual && visual.quadrante ? `${visual.quadrante}º quadrante em destaque` : "Desafio sem ângulo inicial";
    return `<svg class="dial" ${SVGNS} viewBox="0 0 64 64" role="img" aria-label="${label}">
      <circle class="d-bg" cx="${C}" cy="${C}" r="31"/>
      <line class="d-axis" x1="4" y1="${C}" x2="60" y2="${C}"/><line class="d-axis" x1="${C}" y1="4" x2="${C}" y2="60"/>
      ${inner}<circle class="d-ring" cx="${C}" cy="${C}" r="${R}"/>${ticks}
      ${visual && visual.angulo !== undefined ? `<circle cx="${C}" cy="${C}" r="3" fill="currentColor" class="d-tip"/>` : ""}
    </svg>`;
  }

  const TYPES = {
    escolha: { label: "Escolha", icon: '<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M11 7h9M11 17h9"/>' },
    numero: { label: "Número", icon: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>' },
    angulo: { label: "Ângulo", icon: '<path d="M4 20h16M4 20 16 6"/><path d="M10 20a7 7 0 0 0-2.5-5.3"/>' }
  };
  const typeChip = t => `<span class="type-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${TYPES[t].icon}</svg>${TYPES[t].label}</span>`;
  const chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  const isDone = (pm, c) => pm[c.id] && pm[c.id].concluido;
  const collapsed = new Set();

  /* ---------- Próximo desafio sugerido ---------- */
  function renderNextUp() {
    const pm = pmap();
    const ordered = [...challenges].sort((a, b) =>
      C360.DIFFICULTIES[a.dificuldade].ordem - C360.DIFFICULTIES[b.dificuldade].ordem || (a.ordem || 0) - (b.ordem || 0));
    const started = ordered.find(c => pm[c.id] && !pm[c.id].concluido);
    const next = started || ordered.find(c => !isDone(pm, c));
    const box = $("next-up");
    if (!next) {
      box.innerHTML = `<div class="next-up next-up--done">${M.svg({ char: "radi", mood: "happy", size: 92 })}
        <div><span class="next-up__kicker">Volta completa!</span><h2>Você concluiu todos os ${challenges.length} desafios.</h2>
        <p>Agora vale treinar de novo os que valeram menos pontos ou ajudar um colega.</p></div></div>`;
      return;
    }
    const d = C360.DIFFICULTIES[next.dificuldade];
    const fala = started ? "Ei, você parou no meio! Bora terminar?"
      : summary.concluidos ? M.pick(["Bora girar mais um?", "Tenho um desafio novo pra você!", "Pronto para o próximo?"])
      : "Oi! Eu sou o Radi. Pega o ciclo e vamos começar!";
    box.innerHTML = `
      <div class="next-up">
        ${M.svg({ char: "radi", mood: started ? "think" : "idle", size: 92 })}
        <div>
          <span class="next-up__kicker">${esc(fala)}</span>
          <h2>${esc(next.titulo)}</h2>
          <p>${d.etapa} · ${difficultyTag(next.dificuldade)} · vale até ${S.pointsFor(next, (pm[next.id] || {}).erros || 0, (pm[next.id] || {}).dicas || 0)} pts</p>
        </div>
        <button class="btn btn--primary btn--lg" data-open="${next.id}">${started ? "Continuar" : "Começar"}</button>
      </div>`;
  }
  $("next-up").addEventListener("click", e => {
    const b = e.target.closest("[data-open]");
    if (b) openChallenge(b.dataset.open);
  });

  /* ---------- Etapas e cartas ---------- */
  function cardHtml(c, n, pm) {
    const p = pm[c.id];
    const done = p && p.concluido;
    let status;
    if (done) status = `<span class="status-done">Concluído · ${p.pontos} pts</span>`;
    else if (p && (p.erros || p.dicas)) status = `<span class="status-progress">Em andamento · vale ${S.pointsFor(c, p.erros, p.dicas)} pts</span>`;
    else status = `<span class="ch-card__pts">${C360.DIFFICULTIES[c.dificuldade].pontos} pts</span>`;
    return `
      <article class="ch-card ${done ? "ch-card--done" : ""}">
        ${dial(c.visual)}
        <div class="ch-card__top"><span><span class="ch-card__num">Carta ${n}</span> · ${C360.THEMES[c.tema]}</span>${typeChip(c.tipo)}</div>
        <h3>${esc(c.titulo)}</h3>
        <p class="ch-card__task">${esc(c.noCiclo)}</p>
        <div class="ch-card__foot">
          <div class="ch-card__info">${status}</div>
          <button class="btn ${done ? "btn--soft" : "btn--primary"} btn--sm" data-open="${c.id}" aria-label="${done ? "Rever" : "Resolver"}: ${esc(c.titulo)}">${done ? "Rever" : "Resolver"}</button>
        </div>
      </article>`;
  }

  function renderCards() {
    const list = filtered();
    const pm = pmap();
    if (!list.length) {
      $("cards").innerHTML = `<div class="empty">${M.svg({ char: "radi", mood: "sad", size: 90 })}<p style="margin:8px 0 0">Não achei nenhum desafio com esses filtros. Troque a etapa, o tema ou a situação.</p></div>`;
      return;
    }
    const stages = Object.values(C360.DIFFICULTIES).sort((a, b) => a.ordem - b.ordem);
    $("cards").innerHTML = stages.map(d => {
      const cards = list.filter(c => c.dificuldade === d.id);
      if (!cards.length) return "";
      const all = challenges.filter(c => c.dificuldade === d.id);
      const feitos = all.filter(c => isDone(pm, c)).length;
      const pts = all.reduce((s, c) => s + (isDone(pm, c) ? pm[c.id].pontos : 0), 0);
      const max = all.length * d.pontos;
      const open = !collapsed.has(d.id);
      const complete = feitos === all.length;
      return `
        <section class="stage stage--${d.id}" aria-labelledby="st-${d.id}">
          <div class="stage__head">
            <div>
              <div class="stage__title">
                <span class="stage__node ${complete ? "stage__node--done" : ""}" aria-hidden="true">${complete ? "✓" : d.ordem}</span>
                <h2 id="st-${d.id}">${d.etapa}</h2>${difficultyTag(d.id)}
              </div>
              <p class="stage__desc">${d.descricao}</p>
              <button class="btn btn--primary btn--sm stage__play" data-play="${d.id}">▶ ${feitos === all.length ? "Treinar etapa" : feitos ? "Continuar etapa" : "Jogar etapa"}</button>
              <button class="stage__toggle" data-toggle="${d.id}" aria-expanded="${open}" aria-controls="grid-${d.id}">${chevron}${open ? "Esconder cartas" : `Mostrar ${cards.length} cartas`}</button>
            </div>
            <div class="stage__meta">
              <div class="row"><span><b>${feitos}</b> de ${all.length} concluídos</span><span>${pts}/${max} pts</span></div>
              <div class="meter"><span style="width:${all.length ? feitos / all.length * 100 : 0}%"></span></div>
              <span>${d.pontos} pts por carta</span>
            </div>
          </div>
          <div class="grid-cards" id="grid-${d.id}" ${open ? "" : "hidden"}>
            ${cards.map(c => cardHtml(c, all.indexOf(c) + 1, pm)).join("")}
          </div>
        </section>`;
    }).join("");
  }

  $("cards").addEventListener("click", e => {
    const pl = e.target.closest("[data-play]");
    if (pl) return playStage(pl.dataset.play);
    const t = e.target.closest("[data-toggle]");
    if (t) {
      const id = t.dataset.toggle;
      collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id);
      renderCards();
      return;
    }
    const b = e.target.closest("[data-open]");
    if (b) openChallenge(b.dataset.open);
  });

  /* ---------- Lição (perguntas no estilo jogo) ---------- */
  const entryFor = c => pmap()[c.id] || { userId: user.id, challengeId: c.id, concluido: false, erros: 0, dicas: 0, pontos: 0 };

  async function save(entry) {
    const saved = await C360.db.saveProgress(entry);
    const i = progress.findIndex(p => p.challengeId === saved.challengeId);
    if (i >= 0) progress[i] = saved; else progress.push(saved);
    const before = S.badgesFor(summary).filter(b => b.conquistada).map(b => b.id);
    summary = S.summarize(progress, challenges);
    S.badgesFor(summary).filter(b => b.conquistada && !before.includes(b.id))
      .forEach(b => setTimeout(() => toast(`🏅 Nova conquista: ${b.nome}!`, "ok"), 400));
    return saved;
  }

  function refresh() {
    C360.ui.renderHeader("desafios", user, summary);
    renderSummary();
    renderNextUp();
    renderCards();
  }

  const byOrder = (a, b) => (a.ordem || 0) - (b.ordem || 0);

  /** Abre a lição começando pelo desafio escolhido e seguindo pelos pendentes da mesma etapa. */
  function openChallenge(id) {
    const c = challenges.find(x => x.id === id);
    if (!c) return;
    const pm = pmap();
    let queue = [c];
    if (!isDone(pm, c)) {
      const resto = challenges.filter(x => x.dificuldade === c.dificuldade && x.id !== c.id && !isDone(pm, x)).sort(byOrder);
      const depois = resto.filter(x => (x.ordem || 0) > (c.ordem || 0));
      const antes = resto.filter(x => (x.ordem || 0) < (c.ordem || 0));
      queue = queue.concat(depois, antes).slice(0, 6);
    }
    startLesson(queue);
  }

  function playStage(stageId) {
    const pm = pmap();
    const all = challenges.filter(c => c.dificuldade === stageId).sort(byOrder);
    const pend = all.filter(c => !isDone(pm, c));
    startLesson((pend.length ? pend : all).slice(0, 6));
  }

  function startLesson(queue) {
    C360.lesson.start({
      queue,
      getEntry: entryFor,
      save,
      onClose: () => { refresh(); history.replaceState(null, "", location.pathname); }
    });
  }

  renderSummary();
  renderNextUp();
  renderCards();

  /* Abre direto um desafio: desafios.html#f03 */
  const hash = location.hash.slice(1);
  if (hash && challenges.some(c => c.id === hash)) openChallenge(hash);
})();
