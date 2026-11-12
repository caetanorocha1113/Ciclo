/* Página Aprenda: temas com explicação, figura e vídeos. */
(async function () {
  const $ = id => document.getElementById(id);
  const { esc, toast } = C360.ui;

  let ctx;
  try { ctx = await C360.ui.bootPage("aprenda"); } catch (e) { return; }
  const { user, challenges, progress } = ctx;

  /* "Entendi" fica salvo neste aparelho */
  const KEY = "c360:entendi:" + user.id;
  const lidos = new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  const salvarLidos = () => localStorage.setItem(KEY, JSON.stringify([...lidos]));

  const feitos = new Set(progress.filter(p => p.concluido).map(p => p.challengeId));
  const temaStats = tema => {
    const all = challenges.filter(c => c.tema === tema);
    return { total: all.length, feitos: all.filter(c => feitos.has(c.id)).length };
  };

  function renderIndex() {
    $("lr-index").innerHTML = C360.LEARN.map((t, i) => {
      const s = temaStats(t.tema);
      return `<a class="lr-card ${lidos.has(t.id) ? "is-read" : ""}" href="#${t.id}">
        <span class="lr-card__num">${lidos.has(t.id) ? "✓" : i + 1}</span>
        <span class="lr-card__body"><b>${t.titulo}</b><small>${s.feitos}/${s.total} feitos</small></span>
      </a>`;
    }).join("");
  }

  function renderTopics() {
    $("lr-topics").innerHTML = C360.LEARN.map((t, i) => {
      const s = temaStats(t.tema);
      return `
        <article class="lr-topic" id="${t.id}" aria-labelledby="h-${t.id}">
          <header class="lr-topic__head">
            <span class="lr-topic__num" aria-hidden="true">${i + 1}</span>
            <div>
              <h2 id="h-${t.id}">${t.titulo}</h2>
              <p class="lead">${t.resumo}</p>
            </div>
          </header>
          ${C360.learn.topicHTML(t)}
          <footer class="lr-topic__foot">
            <a class="btn btn--primary" href="desafios.html?tema=${t.tema}">▶ Praticar</a>
            <button class="btn ${lidos.has(t.id) ? "btn--soft" : ""}" data-read="${t.id}" aria-pressed="${lidos.has(t.id)}">
              ${lidos.has(t.id) ? "✓ Entendi" : "Entendi"}</button>
          </footer>
        </article>`;
    }).join("");
  }

  $("lr-topics").addEventListener("click", e => {
    const b = e.target.closest("[data-read]");
    if (!b) return;
    const id = b.dataset.read;
    if (lidos.has(id)) lidos.delete(id); else { lidos.add(id); toast("Boa! 👍", "ok"); }
    salvarLidos();
    b.outerHTML = `<button class="btn ${lidos.has(id) ? "btn--soft" : ""}" data-read="${id}" aria-pressed="${lidos.has(id)}">${lidos.has(id) ? "✓ Entendi" : "Entendi"}</button>`;
    renderIndex();
  });

  renderIndex();
  renderTopics();
  C360.learn.bindVideos($("lr-topics"));

  /* Link direto para uma parte: aprenda.html#tangente ou #tangente-outro-lado */
  const alvo = location.hash.slice(1);
  if (alvo) {
    const el = document.getElementById(alvo);
    if (el) {
      el.classList.add("is-focus");
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }
})();
