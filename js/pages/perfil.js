/* Página de perfil: nível, progresso por dificuldade e tema, conquistas e histórico. */
(async function () {
  const $ = id => document.getElementById(id);
  const { esc, fmtDate, toast, difficultyTag } = C360.ui;
  const S = C360.scoring;

  let ctx;
  try { ctx = await C360.ui.bootPage("perfil"); } catch (e) { return; }
  const { user, challenges, progress, summary } = ctx;

  $("p-nome").textContent = user.nome;
  const parts = user.nome.trim().split(/\s+/);
  $("p-avatar").textContent = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  $("p-info").textContent = `${user.papel === "professor" ? "Professor(a)" : "Aluno(a)"} · ${user.turma || "sem turma"}`;

  const n = summary.nivel;
  $("p-lvl-label").textContent = `Nível ${n.numero} · ${summary.pontos} pts`;
  $("p-lvl").textContent = n.atual.nome;
  $("p-lvl-bar").style.width = Math.round(n.progresso * 100) + "%";
  $("p-lvl-next").textContent = n.proximo ? `Próximo: ${n.proximo.nome}` : "Nível máximo!";

  const bar = (label, { feitos, total }) => `
    <div class="bar-row"><span>${label}</span>
      <div class="meter" role="img" aria-label="${feitos} de ${total}"><span style="width:${total ? feitos / total * 100 : 0}%"></span></div>
      <span class="num">${feitos}/${total}</span></div>`;

  $("p-diff").innerHTML = Object.values(C360.DIFFICULTIES)
    .map(d => bar(d.label, summary.porDificuldade[d.id])).join("");
  $("p-tema").innerHTML = Object.entries(C360.THEMES)
    .map(([id, l]) => bar(l, summary.porTema[id])).join("");

  $("p-badges").innerHTML = S.badgesFor(summary).map(b => `
    <div class="badge-card ${b.conquistada ? "badge-card--on" : "badge-card--off"}">
      <div class="badge-card__icon" aria-hidden="true">${b.conquistada ? "★" : "?"}</div>
      <div><b>${b.nome}</b><small>${b.descricao}</small>
        <span class="sr-only">${b.conquistada ? "Conquistada" : "Ainda não conquistada"}</span></div>
    </div>`).join("");

  const byId = Object.fromEntries(challenges.map(c => [c.id, c]));
  const hist = progress.filter(p => p.concluido && byId[p.challengeId])
    .sort((a, b) => String(b.atualizadoEm).localeCompare(String(a.atualizadoEm))).slice(0, 10);
  $("p-hist").innerHTML = hist.length
    ? hist.map(p => {
        const c = byId[p.challengeId];
        return `<li><span>${difficultyTag(c.dificuldade)} <a href="desafios.html#${c.id}">${esc(c.titulo)}</a></span>
          <span class="muted">${p.pontos} pts · ${fmtDate(p.atualizadoEm)}</span></li>`;
      }).join("")
    : `<li class="muted">Nada ainda. <a href="desafios.html">Começar</a></li>`;

  $("btn-reset").addEventListener("click", async () => {
    if (!confirm("Apagar tudo? Não dá para desfazer.")) return;
    try {
      await C360.db.resetProgress(user.id);
      toast("Apagado.", "ok");
      setTimeout(() => location.reload(), 700);
    } catch (ex) {
      toast("Não foi possível apagar: " + ex.message, "bad");
    }
  });
})();
