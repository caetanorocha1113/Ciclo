/* Página de ranking: pódio, tabela, filtro por turma e ferramentas do professor. */
(async function () {
  const $ = id => document.getElementById(id);
  const { esc, fmtDate, toast } = C360.ui;

  let ctx;
  try { ctx = await C360.ui.bootPage("ranking"); } catch (e) { return; }
  const { user } = ctx;
  let linhas = [];

  const turmas = await C360.db.listTurmas();
  $("f-turma").innerHTML += turmas.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join("");
  if (user.papel === "aluno" && user.turma && turmas.includes(user.turma)) $("f-turma").value = user.turma;
  $("f-turma").addEventListener("change", load);

  if (user.papel === "professor") $("prof-tools").hidden = false;

  async function load() {
    try {
      linhas = await C360.db.getRanking({ turma: $("f-turma").value });
    } catch (ex) {
      $("rank-body").innerHTML = `<tr><td colspan="6">Erro: ${esc(ex.message)}</td></tr>`;
      return;
    }
    render();
  }

  const nomeHtml = l => `${esc(l.nome)}${l.demo ? ' <span class="demo-flag">(exemplo)</span>' : ""}`;

  function render() {
    if (!linhas.length) {
      $("podium").innerHTML = "";
      $("rank-body").innerHTML = `<tr><td colspan="6" class="muted">Ninguém ainda.</td></tr>`;
      return;
    }
    const top = linhas.slice(0, 3);
    const order = [1, 0, 2].filter(i => top[i]);
    $("podium").innerHTML = order.map(i => `
      <div class="podium__place podium__place--${i + 1}">
        <div class="medal" aria-label="${i + 1}º lugar">${i + 1}</div>
        <div class="podium__name">${nomeHtml(top[i])}</div>
        <div class="podium__pts">${top[i].pontos} pts · ${esc(top[i].turma)}</div>
      </div>`).join("");

    $("rank-body").innerHTML = linhas.map((l, i) => `
      <tr class="${l.userId === user.id ? "me" : ""}">
        <td class="pos">${i + 1}º</td>
        <td class="name">${nomeHtml(l)}${l.userId === user.id ? " (você)" : ""}<span class="sub">${esc(l.turma)}</span></td>
        <td class="hide-sm">${esc(l.turma)}</td>
        <td class="num">${l.concluidos}</td>
        <td class="num"><b>${l.pontos}</b></td>
        <td class="hide-sm">${fmtDate(l.ultimo)}</td>
      </tr>`).join("");
  }

  /* Exportar CSV (abre no Excel) */
  $("btn-csv").addEventListener("click", () => {
    const sep = ";";
    const cell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["Posição", "Aluno", "Turma", "Desafios concluídos", "Pontos", "Último desafio"]]
      .concat(linhas.map((l, i) => [i + 1, l.nome, l.turma, l.concluidos, l.pontos, l.ultimo ? new Date(l.ultimo).toLocaleString("pt-BR") : ""]));
    const csv = "\uFEFF" + rows.map(r => r.map(cell).join(sep)).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `ranking-ciclo360${$("f-turma").value ? "-" + $("f-turma").value.replace(/\W+/g, "") : ""}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Baixado!", "ok");
  });

  $("btn-demo").addEventListener("click", async () => {
    if (!confirm("Tirar os alunos de exemplo?")) return;
    await C360.db.removeDemoData();
    toast("Pronto!", "ok");
    load();
  });

  load();
})();
