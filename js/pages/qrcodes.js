/* QR codes que abrem direto cada nível de desafios (desafios.html?nivel=...). */
(function () {
  const $ = id => document.getElementById(id);
  const KEY = "c360:siteUrl";
  const CHAR = { facil: "radi", medio: "sena", dificil: "cosi", desafio360: "tang" };
  const COR = { facil: "#1E7A5A", medio: "#1F5FAE", dificil: "#B4530F", desafio360: "#B0237A" };
  const QTD = id => C360.CHALLENGES.filter(c => c.dificuldade === id).length;

  /* Se o site já está publicado, usa o próprio endereço */
  const publicado = /^https?:$/.test(location.protocol)
    ? location.href.replace(/[^/]*([?#].*)?$/, "") : "";
  let salvo = "";
  try { salvo = localStorage.getItem(KEY) || ""; } catch (e) {}
  $("qr-url").value = C360.config.siteUrl || salvo || publicado;

  function base() {
    let u = $("qr-url").value.trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    u = u.replace(/(index|desafios)\.html.*$/i, "");
    return u.endsWith("/") ? u : u + "/";
  }

  function qrSVG(text) {
    const q = qrcode(0, "M");
    q.addData(text);
    q.make();
    return q.createSvgTag({ cellSize: 6, margin: 2, scalable: true, alt: "QR code" });
  }

  function render() {
    const b = base();
    const warn = $("qr-warn");
    warn.hidden = !!b;
    warn.textContent = "Cole o endereço do site publicado. Sem ele, o QR code não abre no celular.";
    try { if (b) localStorage.setItem(KEY, $("qr-url").value.trim()); } catch (e) {}

    $("qr-sheet").innerHTML = Object.values(C360.DIFFICULTIES).sort((a, z) => a.ordem - z.ordem).map(d => {
      const url = b ? `${b}desafios.html?nivel=${d.id}` : "";
      return `
        <article class="qr-card" style="--c:${COR[d.id]}">
          <header class="qr-card__band"><span class="qr-card__num">${d.ordem}</span>${d.label}</header>
          <div class="qr-card__body">
            <div class="qr-card__who">${C360.mascot.svg({ char: CHAR[d.id], mood: "happy", size: 72, anim: "none" })}
              <div><b>${d.etapa}</b><small>${QTD(d.id)} desafios · ${d.pontos} pts cada</small></div></div>
            <div class="qr-card__code">${url ? qrSVG(url) : '<span class="qr-card__empty">Falta o endereço</span>'}</div>
            <p class="qr-card__cta">📱 Aponte a câmera</p>
            <p class="qr-card__url">${url ? url.replace(/^https?:\/\//, "") : ""}</p>
          </div>
        </article>`;
    }).join("");
  }

  $("qr-url").addEventListener("input", render);
  $("qr-print").addEventListener("click", () => {
    if (!base() && !confirm("Ainda não tem endereço. Imprimir mesmo assim?")) return;
    window.print();
  });
  render();
})();
