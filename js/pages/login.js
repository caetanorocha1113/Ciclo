/* Página de entrada: login e cadastro. */
(async function () {
  const $ = id => document.getElementById(id);
  C360.ui.storageNote();

  /* Volta para a página que a pessoa tentou abrir (ex.: QR code de um nível) */
  const voltaURL = new URLSearchParams(location.search).get("volta") || "";
  /* Aceita "desafios.html?nivel=facil" e também "desafios?nivel=facil" (Netlify tira o .html) */
  const m = voltaURL.match(/^([a-z]+)(?:\.html)?([?#][\w=&%#.-]*)?$/i);
  const destino = m && m[1] !== "index" ? m[1] + ".html" + (m[2] || "") : "desafios.html";
  if (await C360.auth.currentUser()) { location.replace(destino); return; }

  C360.db.listTurmas().then(ts => {
    $("turmas").innerHTML = ts.map(t => `<option value="${C360.ui.esc(t)}">`).join("");
  }).catch(() => {});

  /* Radi, o mascote */
  function radi(mood, fala) {
    $("radi-hello").innerHTML = `${C360.mascot.svg({ char: "radi", mood, size: 80 })}
      <div class="speech" style="--who:#7C4DCC"><p class="speech__text">${fala}</p></div>`;
  }
  radi("idle", "Oi! Eu sou o <b>Radi</b>. Vamos girar?");

  /* Abas */
  function showTab(which, focus = true) {
    const login = which === "login";
    $("tab-login").checked = login;
    $("tab-signup").checked = !login;
    $("form-login").hidden = !login;
    $("form-signup").hidden = login;
    radi(login ? "idle" : "happy", login ? "Oi! Vamos girar?" : "Oba! Qual é o seu nome?");
    if (focus) (login ? $("login-email") : $("su-nome")).focus({ preventScroll: true });
  }
  $("tab-login").addEventListener("change", () => showTab("login"));
  $("tab-signup").addEventListener("change", () => showTab("signup"));

  /* Mostrar/ocultar senha */
  document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", () => {
    const inp = $(b.dataset.toggle);
    const show = inp.type === "password";
    inp.type = show ? "text" : "password";
    b.textContent = show ? "Ocultar" : "Mostrar";
    b.setAttribute("aria-pressed", show);
  }));

  /* Ciclo animado da tela inicial */
  (function heroCycle() {
    const C = 120, R = 90;
    const P = (deg, r) => [C + r * Math.cos(deg * Math.PI / 180), C - r * Math.sin(deg * Math.PI / 180)];
    const ticks = $("heroTicks");
    [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].forEach(d => {
      const [x1, y1] = P(d, R - 6), [x2, y2] = P(d, R + 6);
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      ticks.appendChild(l);
    });
    function draw(a) {
      const [x, y] = P(a, R);
      const set = (id, o) => Object.entries(o).forEach(([k, v]) => $(id).setAttribute(k, v));
      set("heroPtr", { x2: x, y2: y });
      set("heroTip", { cx: x, cy: y });
      set("heroSen", { x1: x, y1: y, x2: C, y2: y });
      set("heroCos", { x1: x, y1: y, x2: x, y2: C });
      const r = 24, [ax, ay] = P(a, r);
      set("heroArc", { d: a < .5 ? "" : `M${C + r} ${C} A${r} ${r} 0 ${a > 180 ? 1 : 0} 0 ${ax} ${ay}` });
      $("heroDeg").textContent = Math.round(a) + "°";
    }
    const alvo = 150;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { draw(alvo); return; }
    const t0 = performance.now(), dur = 1800;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      draw(alvo * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  })();

  const emailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  function busy(form, on) {
    const b = form.querySelector("button[type=submit]");
    b.disabled = on;
    b.dataset.label = b.dataset.label || b.textContent;
    b.textContent = on ? "Aguarde…" : b.dataset.label;
  }

  /* Entrar */
  $("form-login").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("login-email").value.trim();
    const senha = $("login-senha").value;
    const err = $("login-erro");
    err.textContent = "";
    if (!emailOk(email)) { err.textContent = "E-mail inválido."; $("login-email").focus(); return; }
    if (!senha) { err.textContent = "Digite sua senha."; $("login-senha").focus(); return; }
    busy(e.target, true);
    try {
      await C360.auth.login(email, senha, $("login-lembrar").checked);
      location.href = destino;
    } catch (ex) {
      err.textContent = ex.message;
      radi("sad", "Ops! Confira o e-mail e a senha.");
      busy(e.target, false);
    }
  });
  ["login-email", "login-senha"].forEach(id => $(id).addEventListener("input", () => { $("login-erro").textContent = ""; $("login-erro").style.color = ""; }));

  /* Criar conta */
  $("form-signup").addEventListener("submit", async e => {
    e.preventDefault();
    const dados = {
      nome: $("su-nome").value.trim(),
      turma: $("su-turma").value.trim(),
      email: $("su-email").value.trim(),
      senha: $("su-senha").value,
      papel: document.querySelector("input[name=papel]:checked").value
    };
    const err = $("su-erro");
    err.textContent = "";
    if (dados.nome.split(/\s+/).length < 2) { err.textContent = "Escreva nome e sobrenome."; $("su-nome").focus(); return; }
    if (!dados.turma) { err.textContent = "Informe a turma."; $("su-turma").focus(); return; }
    if (!emailOk(dados.email)) { err.textContent = "E-mail inválido."; $("su-email").focus(); return; }
    if (dados.senha.length < 6) { err.textContent = "Senha: mínimo 6 letras ou números."; $("su-senha").focus(); return; }
    busy(e.target, true);
    try {
      await C360.auth.register(dados, true);
      location.href = destino;
    } catch (ex) {
      busy(e.target, false);
      if (/^Conta criada/.test(ex.message)) {
        showTab("login", false);
        $("login-email").value = dados.email;
        $("login-erro").style.color = "var(--ok)";
        $("login-erro").textContent = ex.message;
        return;
      }
      err.textContent = ex.message;
    }
  });
  ["su-nome", "su-turma", "su-email", "su-senha"].forEach(id => $(id).addEventListener("input", () => { $("su-erro").textContent = ""; }));
})();
