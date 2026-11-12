/**
 * Partes de interface usadas em todas as páginas internas:
 * cabeçalho, avisos (toast) e pequenos utilitários.
 */
window.C360 = window.C360 || {};

C360.ui = (function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    desafios: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    ranking: '<path d="M8 21V11H4v10M14 21V5h-4v16M20 21v-7h-4v7M3 21h18"/>',
    perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    ciclo: '<circle cx="12" cy="12" r="9"/><path d="M12 12 19 8"/><path d="M3 12h18M12 3v18" opacity=".45"/>',
    sair: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>'
  };
  const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  const NAV = [
    { id: "desafios", href: "desafios.html", label: "Desafios" },
    { id: "ranking", href: "ranking.html", label: "Ranking" },
    { id: "perfil", href: "perfil.html", label: "Perfil" }
  ];

  function renderHeader(active, user, summary) {
    const el = document.getElementById("app-header");
    if (!el) return;
    const nivel = summary ? summary.nivel : null;
    el.className = "site-header";
    el.innerHTML = `
      <div class="site-header__inner">
        <a class="brand" href="desafios.html" aria-label="Ciclo 360°, início">
          <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
            <path d="M20 20 L31 11" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/>
            <circle cx="20" cy="20" r="3.2" fill="currentColor"/>
          </svg>
          <span>Ciclo 360°</span>
        </a>
        <nav class="nav" aria-label="Principal">
          ${NAV.map(n => `<a href="${n.href}" ${n.id === active ? 'aria-current="page"' : ""}>${icon(n.id)}<span>${n.label}</span></a>`).join("")}
          <a href="${C360.config.prototypeUrl}" target="_blank" rel="noopener">${icon("ciclo")}<span>Ciclo digital</span></a>
        </nav>
        <div class="userbox">
          <div class="userbox__who">
            <span class="userbox__name">${esc(user.nome.split(" ")[0])}${user.papel === "professor" ? " (prof.)" : ""}</span>
            ${nivel ? `<span class="userbox__level">Nível ${nivel.numero} · ${esc(nivel.atual.nome)}</span>` : ""}
          </div>
          ${summary ? `<span class="pill pill--points" title="Pontuação total">${summary.pontos} pts</span>` : ""}
          <button class="btn-exit" id="btnSair" aria-label="Sair">${icon("sair")}<span>Sair</span></button>
        </div>
      </div>`;
    document.getElementById("btnSair").addEventListener("click", () => C360.auth.logout());
  }

  function toast(msg, tipo = "info") {
    let box = document.getElementById("toasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "toasts";
      box.className = "toasts";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      document.body.appendChild(box);
    }
    const t = document.createElement("div");
    t.className = `toast toast--${tipo}`;
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3800);
  }

  function difficultyTag(id) {
    const d = C360.DIFFICULTIES[id];
    return `<span class="tag tag--${id}">${d.label}</span>`;
  }

  function fmtDate(iso) {
    if (!iso) return "–";
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  function storageNote() {
    const el = document.getElementById("storage-note");
    if (!el) return;
    el.textContent = {
      local: "Modo de demonstração: os dados ficam salvos só neste navegador. Para a turma toda competir, ligue o banco de dados (veja database/README.md).",
      supabase: "Conectado ao banco de dados: pontos e ranking ficam salvos online e aparecem em qualquer aparelho.",
      api: "Conectado ao banco de dados."
    }[C360.db.mode] || "";
  }

  /** Carrega usuário, desafios e progresso: base comum das páginas internas. */
  async function bootPage(active) {
    const user = await C360.auth.requireUser();
    const [challenges, progress] = await Promise.all([
      C360.db.listChallenges(), C360.db.getProgress(user.id)
    ]);
    const summary = C360.scoring.summarize(progress, challenges);
    renderHeader(active, user, summary);
    storageNote();
    return { user, challenges, progress, summary };
  }

  return { esc, icon, renderHeader, toast, difficultyTag, fmtDate, bootPage, storageNote };
})();
