/**
 * Lição em tela cheia, no estilo dos aplicativos de idiomas:
 * um personagem faz a pergunta, o aluno responde tocando em peças ou girando o ponteiro,
 * recebe a reação na hora e, no fim, vê o resumo com pontos, precisão e sequência.
 *
 * Uso: C360.lesson.start({ queue, getEntry, save, onClose })
 *   queue     → lista de desafios
 *   getEntry  → (desafio) => registro de progresso atual
 *   save      → async (registro) => registro salvo (com pontos calculados)
 *   onClose   → chamado ao sair
 */
window.C360 = window.C360 || {};

C360.lesson = (function () {
  const M = C360.mascot, S = C360.scoring;
  const esc = s => C360.ui.esc(s);
  const MAX_TENTATIVAS = 3;
  const NOTAVEIS = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

  let root, st, opts;

  /* ---------- Matemática bonita ---------- */
  function mathHTML(t) {
    let s = String(t).replace(/-/g, "−");
    const neg = s.startsWith("−");
    if (neg) s = s.slice(1);
    const rad = x => x.replace(/√(\d+)/g, '√<span class="ov">$1</span>');
    let body;
    if (s.includes("/")) {
      const [n, d] = s.split("/");
      body = `<span class="frac"><span>${rad(n)}</span><span>${rad(d)}</span></span>`;
    } else body = rad(s);
    return `<span class="math">${neg ? '<span class="sign">−</span>' : ""}${body}</span>`;
  }

  /* ---------- Peças de resposta para valores numéricos ---------- */
  const TRIG = [["0", 0], ["1/2", .5], ["√2/2", Math.SQRT2 / 2], ["√3/2", Math.sqrt(3) / 2], ["1", 1]];
  const TANG = [["0", 0], ["√3/3", Math.sqrt(3) / 3], ["1", 1], ["√3", Math.sqrt(3)]];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function numberOptions(ch) {
    const v = ch.resposta, mag = Math.abs(v), sg = v < 0 ? "-" : "";
    const inTang = TANG.find(([, x]) => Math.abs(x - mag) < .01) && (ch.tema === "tangente" || !TRIG.find(([, x]) => Math.abs(x - mag) < .01));
    const table = inTang ? TANG : TRIG;
    const hit = table.find(([, x]) => Math.abs(x - mag) < .01);
    if (!hit || (Number.isInteger(v) && Math.abs(v) > 1)) {
      const base = Math.max(0, Math.round(v) - 2);
      return shuffle([0, 1, 2, 3].map(i => String(base + i)));
    }
    const correct = mag === 0 ? "0" : sg + hit[0];
    const pool = [];
    if (mag !== 0) pool.push((sg ? "" : "-") + hit[0]);
    table.filter(([t]) => t !== hit[0])
      .sort((a, b) => Math.abs(a[1] - mag) - Math.abs(b[1] - mag))
      .forEach(([t, x]) => pool.push(x === 0 ? "0" : sg + t));
    const opts = [correct, ...pool.filter((t, i, arr) => arr.indexOf(t) === i && t !== correct).slice(0, 3)];
    return shuffle(opts);
  }

  /* ---------- Estrutura ---------- */
  function ensureRoot() {
    if (root) return;
    root = document.createElement("div");
    root.className = "lesson";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Lição de desafios");
    root.hidden = true;
    document.body.appendChild(root);
    root.addEventListener("keydown", onKey);
  }

  function start(o) {
    ensureRoot();
    opts = o;
    st = {
      queue: [...o.queue], total: o.queue.length, resolvidas: 0,
      tentativas: {}, respostas: 0, dePrimeira: 0, combo: 0, maxCombo: 0, pontos: 0,
      inicio: Date.now(), atual: null, sel: null, fase: "resposta", dicasTreino: 0
    };
    root.hidden = false;
    document.body.classList.add("lesson-open");
    next();
  }

  function close(confirmar = true) {
    if (confirmar && st.fase !== "fim" && st.resolvidas > 0 &&
      !confirm("Sair da lição? O que você já acertou continua salvo.")) return;
    root.hidden = true;
    root.innerHTML = "";
    document.body.classList.remove("lesson-open");
    opts.onClose && opts.onClose();
  }

  function next() {
    if (!st.queue.length) return renderEnd();
    st.atual = st.queue.shift();
    st.sel = null;
    st.fase = "resposta";
    st.dicasTreino = 0;
    renderQuestion();
  }

  /* ---------- Topo ---------- */
  function topBar() {
    const pct = Math.round(st.resolvidas / st.total * 100);
    return `
      <header class="ls-top">
        <button class="ls-icon" data-act="close" aria-label="Sair da lição">✕</button>
        <div class="ls-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${st.total}" aria-valuenow="${st.resolvidas}" aria-label="Progresso da lição"><span style="width:${pct}%"></span></div>
        <span class="ls-combo ${st.combo >= 2 ? "is-on" : ""}" aria-label="Sequência de acertos: ${st.combo}">🔥 ${st.combo}</span>
        <button class="ls-icon" data-act="sound" aria-label="${C360.sfx.on ? "Desligar som" : "Ligar som"}" aria-pressed="${C360.sfx.on}">${C360.sfx.on ? "🔊" : "🔇"}</button>
      </header>`;
  }

  const cycleIco = `<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M17 17 L6 11" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="17" cy="17" r="2.5" fill="currentColor"/></svg>`;

  /* Com peças para tocar, instruções de digitação não fazem sentido */
  function cleanQuestion(c) {
    if (c.tipo === "escolha") return c.enunciado;
    return c.enunciado
      .replace(/\s*\((pode responder|responda)[^)]*\)/i, "")
      .replace(/\s*Responda em[^.?]*[.?]?/i, "")
      .trim();
  }

  /* ---------- Pergunta ---------- */
  function renderQuestion() {
    const c = st.atual, entry = opts.getEntry(c);
    const who = M.forChallenge(c), char = M.CHARS[who];
    const pratica = !!entry.concluido;
    const kicker = { escolha: "Escolha a resposta certa", numero: "Toque no valor certo", angulo: "Gire o ponteiro até a resposta" }[c.tipo];
    const repetida = (st.tentativas[c.id] || 0) > 0;
    const vale = S.pointsFor(c, entry.erros, entry.dicas);

    root.innerHTML = `
      ${topBar()}
      <main class="ls-body">
        <div class="ls-inner">
          <p class="ls-kicker">${repetida ? "↻ Revisão · " : ""}${kicker}${pratica ? ' <span class="ls-badge">treino</span>' : ` <span class="ls-badge">até ${vale} pts</span>`}</p>
          <details class="ls-task" ${c.tipo === "angulo" ? "" : "open"}>
            <summary>${cycleIco}<span>Com o Ciclo 360° em mãos</span></summary>
            <p>${esc(c.noCiclo)}</p>
          </details>
          <div class="ls-scene">
            <div class="ls-char" id="ls-char">${M.svg({ char: who, mood: "idle", size: 110 })}</div>
            <div class="speech" style="--who:${char.cor}">
              <span class="speech__who">${char.nome}</span>
              <p class="speech__text">${esc(cleanQuestion(c))}</p>
              <p class="speech__hint" id="ls-hint" ${!pratica && entry.dicas ? "" : "hidden"}>${!pratica && entry.dicas ? hintsHTML(c, entry.dicas) : ""}</p>
            </div>
          </div>
          <div class="ls-answer" id="ls-answer">${answerUI(c)}</div>
        </div>
      </main>
      <footer class="ls-foot">
        <div class="ls-foot__inner">
          ${hintButton(c, entry)}
          <button class="btn btn--primary btn--lg ls-check" data-act="check" disabled>Verificar</button>
        </div>
      </footer>`;
    bindAnswer(c);
    root.querySelector(".ls-body").scrollTop = 0;
    const first = root.querySelector(".tile, .ls-dial");
    if (first && matchMedia("(hover: hover)").matches) first.focus({ preventScroll: true });
  }

  function hintButton(c, entry) {
    if (entry.concluido) return `<button class="btn ls-hintbtn" data-act="hint">💡 Ver dica</button>`;
    if (entry.dicas >= c.dicas.length) return `<button class="btn ls-hintbtn" disabled>💡 Sem mais dicas</button>`;
    const custo = S.pointsFor(c, entry.erros, entry.dicas) - S.pointsFor(c, entry.erros, entry.dicas + 1);
    return `<button class="btn ls-hintbtn" data-act="hint">💡 ${entry.dicas ? "Outra dica" : "Dica"} <small>−${custo} pts</small></button>`;
  }

  function hintsHTML(c, n) {
    return c.dicas.slice(0, n).map(d => `💡 ${esc(d)}`).join("<br>");
  }

  function answerUI(c) {
    if (c.tipo === "escolha") {
      return `<div class="tiles tiles--list" role="radiogroup" aria-label="Opções">${c.opcoes.map((o, i) =>
        `<button class="tile" role="radio" aria-checked="false" data-val="${i}"><span class="tile__key">${i + 1}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
    }
    if (c.tipo === "numero") {
      return `<div class="tiles tiles--grid" role="radiogroup" aria-label="Valores">${numberOptions(c).map((t, i) =>
        `<button class="tile tile--math" role="radio" aria-checked="false" data-val="${esc(t)}" aria-label="${esc(t)}"><span class="tile__key">${i + 1}</span>${mathHTML(t)}</button>`).join("")}</div>`;
    }
    return dialUI();
  }

  /* ---------- Ciclo interativo (respostas em ângulo) ---------- */
  function dialUI() {
    const C = 150, R = 104;
    const P = (d, r) => [C + r * Math.cos(d * Math.PI / 180), C - r * Math.sin(d * Math.PI / 180)];
    const quads = ["#F6D55C", "#9ED39A", "#9EC6EE", "#F2A7C0"].map((col, q) => {
      const [x1, y1] = P(q * 90, R), [x2, y2] = P(q * 90 + 90, R);
      return `<path d="M${C} ${C} L${x1} ${y1} A${R} ${R} 0 0 0 ${x2} ${y2} Z" fill="${col}" opacity=".35"/>`;
    }).join("");
    const marks = NOTAVEIS.map(d => {
      const [a, b] = P(d, R - 6), [x, y] = P(d, R + 6), [lx, ly] = P(d, R + 24);
      return `<line x1="${a}" y1="${b}" x2="${x}" y2="${y}" class="dl-tick"/>
              <text x="${lx}" y="${ly + 4}" text-anchor="middle" class="dl-lbl" data-deg="${d}">${d}°</text>`;
    }).join("");
    return `
      <div class="ls-dialwrap">
        <svg class="ls-dial" viewBox="0 0 300 300" tabindex="0" role="slider" aria-label="Ponteiro do ciclo. Use as setas para girar."
             aria-valuemin="0" aria-valuemax="330" aria-valuenow="0" aria-valuetext="0 graus">
          <circle cx="${C}" cy="${C}" r="146" class="dl-bg"/>
          ${quads}
          <line x1="20" y1="${C}" x2="280" y2="${C}" class="dl-axis dl-axis--x"/>
          <line x1="${C}" y1="20" x2="${C}" y2="280" class="dl-axis dl-axis--y"/>
          <circle cx="${C}" cy="${C}" r="${R}" class="dl-ring"/>
          ${marks}
          <path id="dl-arc" class="dl-arc" d=""/>
          <g id="dl-ptr"><line x1="${C}" y1="${C}" x2="${C + R}" y2="${C}" class="dl-ptr"/><circle cx="${C + R}" cy="${C}" r="11" class="dl-tip"/></g>
          <circle cx="${C}" cy="${C}" r="8" class="dl-pivot"/>
        </svg>
        <div class="ls-dialctrl">
          <button class="btn btn--soft" data-act="dial-prev" aria-label="Ângulo anterior">↻</button>
          <output class="ls-dialread" id="dl-read">0°</output>
          <button class="btn btn--soft" data-act="dial-next" aria-label="Próximo ângulo">↺</button>
        </div>
        <p class="ls-dialhint">Arraste a bolinha ou use os botões.</p>
      </div>`;
  }

  function setDial(deg, user = true) {
    const C = 150, R = 104;
    deg = ((deg % 360) + 360) % 360;
    const svg = root.querySelector(".ls-dial");
    root.querySelector("#dl-ptr").setAttribute("transform", `rotate(${-deg} ${C} ${C})`);
    const r = 30, a = deg * Math.PI / 180, ax = C + r * Math.cos(a), ay = C - r * Math.sin(a);
    root.querySelector("#dl-arc").setAttribute("d", deg ? `M${C + r} ${C} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 0 ${ax} ${ay}` : "");
    root.querySelector("#dl-read").textContent = deg + "°";
    root.querySelectorAll(".dl-lbl").forEach(t => t.classList.toggle("is-on", +t.dataset.deg === deg));
    svg.setAttribute("aria-valuenow", deg);
    svg.setAttribute("aria-valuetext", deg + " graus");
    if (user) { st.sel = String(deg); enableCheck(); }
  }
  const nearest = d => NOTAVEIS.concat(360).reduce((b, n) => Math.abs(n - d) < Math.abs(b - d) ? n : b, 0) % 360;
  function stepDial(dir) {
    const cur = st.sel === null ? 0 : +st.sel;
    const i = NOTAVEIS.indexOf(cur);
    setDial(NOTAVEIS[(i + dir + NOTAVEIS.length) % NOTAVEIS.length]);
    C360.sfx.play("tap");
  }

  function bindAnswer(c) {
    if (c.tipo === "angulo") {
      const svg = root.querySelector(".ls-dial");
      setDial(0, false);
      let drag = false, last = null;
      const angFrom = e => {
        const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(svg.getScreenCTM().inverse());
        if (Math.hypot(q.x - 150, q.y - 150) < 14) return null;
        return nearest((Math.atan2(150 - q.y, q.x - 150) * 180 / Math.PI + 360) % 360);
      };
      const move = e => { const d = angFrom(e); if (d !== null && d !== last) { last = d; setDial(d); C360.sfx.play("tap"); } };
      svg.addEventListener("pointerdown", e => { drag = true; svg.setPointerCapture(e.pointerId); move(e); });
      svg.addEventListener("pointermove", e => { if (drag) move(e); });
      svg.addEventListener("pointerup", () => { drag = false; });
      svg.addEventListener("pointercancel", () => { drag = false; });
      svg.addEventListener("keydown", e => {
        if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); stepDial(-1); }
        if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); stepDial(1); }
      });
      return;
    }
    root.querySelectorAll(".tile").forEach(t => t.addEventListener("click", () => selectTile(t)));
  }

  function selectTile(t) {
    if (st.fase !== "resposta") return;
    root.querySelectorAll(".tile").forEach(x => { x.classList.remove("is-sel"); x.setAttribute("aria-checked", "false"); });
    t.classList.add("is-sel");
    t.setAttribute("aria-checked", "true");
    st.sel = t.dataset.val;
    C360.sfx.play("tap");
    enableCheck();
  }

  function enableCheck() {
    const b = root.querySelector(".ls-check");
    if (b) b.disabled = st.sel === null;
  }

  function setMood(mood, char) {
    const box = root.querySelector("#ls-char");
    if (box) box.innerHTML = M.svg({ char: char || M.forChallenge(st.atual), mood, size: 110 });
  }

  /* ---------- Dica ---------- */
  async function showHint() {
    const c = st.atual, entry = opts.getEntry(c);
    let n;
    if (entry.concluido) {
      st.dicasTreino = Math.min(c.dicas.length, (st.dicasTreino || 0) + 1);
      n = st.dicasTreino;
    } else {
      if (entry.dicas >= c.dicas.length) return;
      try { await opts.save({ ...entry, dicas: entry.dicas + 1 }); }
      catch (e) { C360.ui.toast("Não foi possível salvar: " + e.message, "bad"); return; }
      n = entry.dicas + 1;
    }
    const box = root.querySelector("#ls-hint");
    box.hidden = false;
    box.innerHTML = hintsHTML(c, n);
    setMood("think");
    C360.sfx.play("dica");

    const fresh = opts.getEntry(c);
    const b = root.querySelector(".ls-hintbtn");
    if (fresh.concluido) {
      if (n >= c.dicas.length) { b.disabled = true; b.textContent = "💡 Sem mais dicas"; }
    } else {
      b.outerHTML = hintButton(c, fresh);
      const kb = root.querySelector(".ls-kicker .ls-badge");
      if (kb) kb.textContent = `até ${S.pointsFor(c, fresh.erros, fresh.dicas)} pts`;
    }
  }

  /* ---------- Verificar ---------- */
  async function check() {
    if (st.fase !== "resposta" || st.sel === null) return;
    const c = st.atual, entry = opts.getEntry(c);
    const r = C360.answers.check(c, st.sel);
    if (!r.valida) return;
    st.fase = "salvando";
    root.querySelector(".ls-check").disabled = true;
    st.respostas++;
    st.tentativas[c.id] = (st.tentativas[c.id] || 0) + 1;
    const pratica = !!entry.concluido;
    let ganhos = 0, revelar = false;

    try {
      if (r.ok) {
        if (st.tentativas[c.id] === 1) st.dePrimeira++;
        st.combo++;
        st.maxCombo = Math.max(st.maxCombo, st.combo);
        if (!pratica) {
          const saved = await opts.save({ ...entry, concluido: true, pontos: S.pointsFor(c, entry.erros, entry.dicas) });
          ganhos = saved.pontos;
          st.pontos += ganhos;
        }
        st.resolvidas++;
      } else {
        st.combo = 0;
        if (!pratica) await opts.save({ ...entry, erros: entry.erros + 1 });
        if (st.tentativas[c.id] < MAX_TENTATIVAS) st.queue.push(c);
        else { revelar = true; st.resolvidas++; }
      }
    } catch (e) {
      st.fase = "resposta";
      root.querySelector(".ls-check").disabled = false;
      C360.ui.toast("Não foi possível salvar: " + e.message, "bad");
      return;
    }
    st.fase = "feedback";
    renderFeedback(r.ok, { ganhos, pratica, revelar });
  }

  function markAnswer(ok) {
    const c = st.atual;
    if (c.tipo === "angulo") {
      root.querySelector(".ls-dial").classList.add(ok ? "is-ok" : "is-bad");
      return;
    }
    const sel = root.querySelector(".tile.is-sel");
    if (sel) sel.classList.add(ok ? "is-ok" : "is-bad");
    root.querySelectorAll(".tile").forEach(t => { t.disabled = true; });
  }

  function renderFeedback(ok, { ganhos, pratica, revelar }) {
    const c = st.atual;
    markAnswer(ok);
    const who = M.forChallenge(c);
    setMood(ok ? (st.combo >= 3 ? "wow" : "happy") : "sad");
    // atualiza a barra e a chama de sequência
    root.querySelector(".ls-top").outerHTML = topBar();

    let titulo, texto;
    if (ok) {
      titulo = st.combo >= 3 ? M.FRASES.combo(st.combo) : M.pick(M.FRASES.certo);
      texto = pratica ? "Treino concluído." : `+${ganhos} pts`;
      C360.sfx.play(st.combo >= 3 && st.combo % 3 === 0 ? "combo" : "certo");
      if (st.combo >= 3 && st.combo % 3 === 0) confetti(root.querySelector(".ls-scene"));
    } else if (revelar) {
      titulo = "Vamos ver juntos";
      texto = `Resposta: <b>${esc(C360.answers.correctText(c))}</b>`;
      C360.sfx.play("errado");
    } else {
      titulo = M.pick(M.FRASES.errado);
      texto = "Confira as réguas no ciclo. Essa pergunta volta no fim da lição.";
      C360.sfx.play("errado");
    }
    const explica = ok || revelar
      ? `<details class="ls-why" ${revelar ? "open" : ""}><summary>Por quê?</summary><p>${esc(c.explicacao)}</p></details>` : "";

    root.querySelector(".ls-foot").outerHTML = `
      <footer class="ls-foot ls-foot--${ok ? "ok" : "bad"}" role="status">
        <div class="ls-foot__inner ls-foot__inner--fb">
          <div class="ls-fb">
            <span class="ls-fb__face" aria-hidden="true">${M.svg({ char: who, mood: ok ? "happy" : "sad", size: 54, anim: "none" })}</span>
            <div><strong class="ls-fb__title">${titulo}</strong><p class="ls-fb__text">${texto}</p>${explica}</div>
          </div>
          <button class="btn btn--lg ls-continue" data-act="continue">Continuar</button>
        </div>
      </footer>`;
    root.querySelector(".ls-continue").focus({ preventScroll: true });
  }

  /* ---------- Fim ---------- */
  function renderEnd() {
    st.fase = "fim";
    const precisao = st.respostas ? Math.round(st.dePrimeira / st.respostas * 100) : 100;
    const seg = Math.round((Date.now() - st.inicio) / 1000);
    const tempo = seg >= 60 ? `${Math.floor(seg / 60)}min ${String(seg % 60).padStart(2, "0")}s` : `${seg}s`;
    const titulo = precisao === 100 ? "Lição perfeita!" : precisao >= 70 ? "Lição concluída!" : "Lição concluída!";
    const fala = precisao === 100 ? "Nenhum erro! Você girou o ciclo como ninguém."
      : precisao >= 70 ? "Mandou muito bem. Bora para a próxima?"
      : "Cada erro foi um treino. Revise as explicações e tente de novo!";
    root.innerHTML = `
      <main class="ls-body ls-end">
        <div class="ls-inner">
          <div class="ls-end__hero" id="ls-end-hero">
            ${M.svg({ char: "radi", mood: precisao >= 70 ? "happy" : "idle", size: 150 })}
            <div class="ls-end__friends" aria-hidden="true">
              ${M.svg({ char: "sena", mood: "happy", size: 62, anim: "bounce" })}
              ${M.svg({ char: "cosi", mood: "happy", size: 62, anim: "bounce" })}
              ${M.svg({ char: "tang", mood: "happy", size: 62, anim: "bounce" })}
            </div>
          </div>
          <h2 class="ls-end__title">${titulo}</h2>
          <p class="ls-end__text">${fala}</p>
          <div class="ls-stats">
            <div class="ls-stat ls-stat--pts"><span>Pontos</span><b>${st.pontos ? "+" + st.pontos : "treino"}</b></div>
            <div class="ls-stat ls-stat--acc"><span>Precisão</span><b>${precisao}%</b></div>
            <div class="ls-stat ls-stat--fire"><span>Sequência</span><b>🔥 ${st.maxCombo}</b></div>
          </div>
          <p class="ls-end__time">Tempo: ${tempo}</p>
        </div>
      </main>
      <footer class="ls-foot"><div class="ls-foot__inner"><span></span>
        <button class="btn btn--primary btn--lg ls-continue" data-act="finish">Continuar</button></div></footer>`;
    C360.sfx.play("fim");
    confetti(root.querySelector("#ls-end-hero"), 40);
    root.querySelector(".ls-continue").focus({ preventScroll: true });
  }

  /* ---------- Confete ---------- */
  function confetti(el, n = 24) {
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cores = ["#7C4DCC", "#E2574C", "#2F74D0", "#D98A1F", "#F7B5DC", "#5FD08F", "#F6D55C"];
    const box = document.createElement("div");
    box.className = "confetti";
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.style.setProperty("--x", (Math.random() * 2 - 1) * 180 + "px");
      p.style.setProperty("--y", -(80 + Math.random() * 160) + "px");
      p.style.setProperty("--r", Math.random() * 720 + "deg");
      p.style.background = cores[i % cores.length];
      p.style.animationDelay = Math.random() * .15 + "s";
      box.appendChild(p);
    }
    el.appendChild(box);
    setTimeout(() => box.remove(), 1600);
  }

  /* ---------- Eventos ---------- */
  function onAct(act) {
    if (act === "close") return close(true);
    if (act === "sound") { C360.sfx.toggle(); root.querySelector(".ls-top").outerHTML = topBar(); return; }
    if (act === "check") return check();
    if (act === "hint") return showHint();
    if (act === "continue") return next();
    if (act === "finish") return close(false);
    if (act === "dial-prev") return stepDial(-1);
    if (act === "dial-next") return stepDial(1);
  }
  document.addEventListener("click", e => {
    if (!root || root.hidden) return;
    const b = e.target.closest("[data-act]");
    if (b && root.contains(b) && !b.disabled) onAct(b.dataset.act);
  });

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); return close(true); }
    if (e.key === "Enter" && !e.target.closest("summary")) {
      if (st.fase === "resposta" && st.sel !== null) { e.preventDefault(); check(); }
      else if (st.fase === "feedback") { e.preventDefault(); next(); }
      else if (st.fase === "fim") { e.preventDefault(); close(false); }
      return;
    }
    if (st.fase === "resposta" && /^[1-4]$/.test(e.key)) {
      const t = root.querySelectorAll(".tile")[+e.key - 1];
      if (t) selectTile(t);
    }
  }

  return { start, mathHTML };
})();
