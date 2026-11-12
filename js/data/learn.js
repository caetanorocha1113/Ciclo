/**
* Conteúdo da aba "Aprenda": explicações curtas por tema, figuras, vídeos e a ligação
 * de cada desafio com a parte da explicação que ajuda a resolvê-lo.
 *
 * Vídeos: canais de terceiros no YouTube. Vale a professora assistir antes de indicar.
 */
window.C360 = window.C360 || {};

C360.LEARN = [
  {
    id: "ciclo", tema: "angulos", char: "radi", figura: "ciclo",
    titulo: "O ciclo",
    fala: "Sou um círculo de raio 1. Cada ângulo é um ponto em mim!",
    resumo: "Onde fica o 0° e para onde se gira.",
    secoes: [
      { id: "o-que-e", titulo: "O que é", html: `
        <p>É um círculo com <b>raio 1</b>, com o centro no meio dos eixos.</p>
        <p>No material, o raio mede 10 cm, mas vale <b>1</b>.</p>
        <p>Cada ângulo vira <b>um ponto</b> no círculo: é onde para a ponta do ponteiro.</p>` },
      { id: "sentido", titulo: "Para onde gira", html: `
        <p>O <b>0° fica à direita</b>. Os ângulos crescem <b>contra o relógio</b>.</p>
        <p><b>90°</b> em cima · <b>180°</b> à esquerda · <b>270°</b> embaixo · <b>360°</b> volta ao 0°.</p>
        <p class="lr-warn"><b>Cuidado:</b> o 0° não fica em cima, como no relógio.</p>` },
      { id: "quadrantes", titulo: "Quadrantes", html: `
        <div class="lr-table"><table>
          <tr><th>Quadrante</th><th>Vai de</th><th>O ponto fica</th></tr>
          <tr><td>1º</td><td>0° a 90°</td><td>direita, em cima</td></tr>
          <tr><td>2º</td><td>90° a 180°</td><td>esquerda, em cima</td></tr>
          <tr><td>3º</td><td>180° a 270°</td><td>esquerda, embaixo</td></tr>
          <tr><td>4º</td><td>270° a 360°</td><td>direita, embaixo</td></tr>
        </table></div>` },
      { id: "no-material", titulo: "No material", html: `
        <p>Cada quadrante tem uma cor. Gire e veja: <b>em que cor parou?</b></p>` }
    ],
    videos: [
      { id: "eR9i5AJZMi0", titulo: "Ciclo trigonométrico (aula 5)" },
      { id: "6nfl6-Mbbto", titulo: "Quadrantes e sinais" }
    ]
  },
  {
    id: "radianos", tema: "radianos", char: "radi", figura: "radiano",
    titulo: "Graus e radianos",
    fala: "Radiano é o ângulo do tamanho do raio!",
    resumo: "Como trocar graus por radianos.",
    secoes: [
      { id: "o-que-e", titulo: "O que é", html: `
        <p>Cole na borda um barbante do tamanho do raio. O ângulo que ele forma é <b>1 radiano</b> (uns 57°).</p>
        <p>A volta inteira é <b>2π rad = 360°</b>.</p>` },
      { id: "converter", titulo: "Como converter", html: `
        <p class="lr-formula">π rad = 180°</p>
        <p><b>Radiano → grau:</b> troque π por 180°.<br>Ex.: 5π/6 = 5 × 180° ÷ 6 = <b>150°</b>.</p>
        <p class="lr-tip"><b>Atalho:</b> π/6 = 30° · π/4 = 45° · π/3 = 60°.</p>` },
      { id: "tabela", titulo: "Tabela", html: `
        <div class="lr-table"><table>
          <tr><th>Graus</th><td>0°</td><td>30°</td><td>45°</td><td>60°</td><td>90°</td><td>120°</td><td>135°</td><td>150°</td></tr>
          <tr><th>Rad</th><td>0</td><td>π/6</td><td>π/4</td><td>π/3</td><td>π/2</td><td>2π/3</td><td>3π/4</td><td>5π/6</td></tr>
          <tr><th>Graus</th><td>180°</td><td>210°</td><td>225°</td><td>240°</td><td>270°</td><td>300°</td><td>315°</td><td>330°</td></tr>
          <tr><th>Rad</th><td>π</td><td>7π/6</td><td>5π/4</td><td>4π/3</td><td>3π/2</td><td>5π/3</td><td>7π/4</td><td>11π/6</td></tr>
        </table></div>
        <p>No disco: radianos <b>dentro</b>, graus <b>fora</b>.</p>` }
    ],
    videos: [
      { id: "JB9WW-pLNug", titulo: "Graus para radianos", canal: "Prof. Robson Liers" },
      { id: "P4DS-3yIGN0", titulo: "Graus e radianos", canal: "Sacando Matemática" }
    ]
  },
  {
    id: "senocos", tema: "senocos", char: "sena", figura: "senocos",
    titulo: "Seno e cosseno",
    fala: "Eu meço a altura. O Cosi mede o lado!",
    resumo: "Altura e lado do ponto.",
    secoes: [
      { id: "coordenadas", titulo: "Altura e lado", html: `
        <p><b class="c-sen">Seno</b> = altura do ponto. Em cima é +, embaixo é −.</p>
        <p><b class="c-cos">Cosseno</b> = lado do ponto. Direita é +, esquerda é −.</p>
        <p>No material: a <b class="c-sen">régua vermelha</b> mede o seno e a <b class="c-cos">azul</b> mede o cosseno.</p>` },
      { id: "notaveis", titulo: "Ângulos notáveis", html: `
        <div class="lr-table"><table>
          <tr><th></th><th>30°</th><th>45°</th><th>60°</th></tr>
          <tr><th class="c-sen">sen</th><td>1/2</td><td>√2/2</td><td>√3/2</td></tr>
          <tr><th class="c-cos">cos</th><td>√3/2</td><td>√2/2</td><td>1/2</td></tr>
          <tr><th>Régua</th><td>5 e 8,7 cm</td><td>7,1 e 7,1 cm</td><td>8,7 e 5 cm</td></tr>
        </table></div>
        <p class="lr-tip"><b>Truque:</b> o cosseno é a lista do seno ao contrário.</p>` },
      { id: "eixos", titulo: "Nos eixos", html: `
        <div class="lr-table"><table>
          <tr><th></th><th>0°</th><th>90°</th><th>180°</th><th>270°</th></tr>
          <tr><th class="c-sen">sen</th><td>0</td><td>1</td><td>0</td><td>−1</td></tr>
          <tr><th class="c-cos">cos</th><td>1</td><td>0</td><td>−1</td><td>0</td></tr>
        </table></div>` },
      { id: "fundamental", titulo: "Sempre dá 1", html: `
        <p class="lr-formula">sen² + cos² = 1</p>
        <p>As réguas e o ponteiro formam um triângulo. É o teorema de Pitágoras.</p>
        <p>Ex.: em 120°, 3/4 + 1/4 = 1.</p>` }
    ],
    videos: [
      { id: "AEdrXfqECHA", titulo: "Seno de 120° no ciclo" },
      { id: "d2FsGfLbGQo", titulo: "Exercícios (aula 8)" }
    ]
  },
  {
    id: "sinais", tema: "sinais", char: "cosi", figura: "sinais",
    titulo: "Sinais",
    fala: "Foi para a esquerda? Eu fico negativo!",
    resumo: "Quando é + e quando é −.",
    secoes: [
      { id: "regra", titulo: "Olhe a posição", html: `
        <p><b class="c-sen">Seno:</b> em cima +, embaixo −.</p>
        <p><b class="c-cos">Cosseno:</b> direita +, esquerda −.</p>` },
      { id: "tabela", titulo: "Quadro de sinais", html: `
        <div class="lr-table"><table>
          <tr><th></th><th>1º</th><th>2º</th><th>3º</th><th>4º</th></tr>
          <tr><th class="c-sen">sen</th><td>+</td><td>+</td><td>−</td><td>−</td></tr>
          <tr><th class="c-cos">cos</th><td>+</td><td>−</td><td>−</td><td>+</td></tr>
          <tr><th class="c-tg">tg</th><td>+</td><td>−</td><td>+</td><td>−</td></tr>
        </table></div>
        <p>Nos eixos (0°, 90°, 180°, 270°) um deles vale zero, que não é + nem −.</p>` },
      { id: "tangente-sinal", titulo: "E a tangente?", html: `
        <p>Sinais <b>iguais</b> → tangente <b>+</b>. Sinais <b>diferentes</b> → tangente <b>−</b>.</p>
        <p class="lr-warn"><b>Cuidado:</b> no 3º quadrante a tangente é +.</p>` }
    ],
    videos: [
      { id: "YgWuIuDXMjI", titulo: "Sinal do seno e do cosseno" },
      { id: "u7X549cKH0k", titulo: "Sinal da tangente" }
    ]
  },
  {
    id: "tangente", tema: "tangente", char: "tang", figura: "tangente",
    titulo: "Tangente",
    fala: "Sou a reta em pé. O barbante vem me encontrar!",
    resumo: "A reta e o barbante.",
    secoes: [
      { id: "reta", titulo: "A reta", html: `
        <p>A tangente fica numa reta em pé, encostada no 0°: a reta <b>x = 1</b>. No material, é o palito de churrasco.</p>
        <p>Estique o <b>barbante</b> pelo ponteiro até a reta. A altura do encontro é a tangente.</p>` },
      { id: "divisao", titulo: "A conta", html: `
        <p class="lr-formula">tg = sen ÷ cos</p>
        <p>tg 30° ≈ 0,58 · tg 60° ≈ 1,73</p>
        <p>Seno e cosseno iguais → tangente 1.</p>` },
      { id: "outro-lado", titulo: "Ponteiro à esquerda", html: `
        <p>O barbante <b>passa pelo centro</b> e vai para o outro lado até a reta.</p>
        <p>Ex.: em 150° ele cruza <b>abaixo</b> do eixo: tg 150° ≈ −0,58.</p>` },
      { id: "nao-existe", titulo: "Quando não existe", html: `
        <p>Com o ponteiro <b>em pé</b>, o barbante fica paralelo à reta e nunca a encontra.</p>
        <p>O cosseno é zero, e não dá para dividir por zero.</p>` }
    ],
    videos: [
      { id: "FisyIZ97lOE", titulo: "O eixo das tangentes" },
      { id: "RpaQVTXXR3M", titulo: "Tangente com exercício", canal: "Prof. Sandro Azevedo" }
    ]
  },
  {
    id: "simetria", tema: "simetria", char: "radi", figura: "simetria",
    titulo: "Espelhos",
    fala: "Todo ângulo tem um irmão no 1º quadrante!",
    resumo: "Ache qualquer valor a partir de 30°, 45° e 60°.",
    secoes: [
      { id: "espelhos", titulo: "Os irmãos", html: `
        <p>30°, 150°, 210° e 330° ficam <b>na mesma distância</b> dos eixos. Só muda o lado.</p>
        <div class="lr-table"><table>
          <tr><th>Quadrante</th><th>Ângulo</th><th>Muda</th></tr>
          <tr><td>2º</td><td>180° − a</td><td>cos fica −</td></tr>
          <tr><td>3º</td><td>180° + a</td><td>sen e cos ficam −</td></tr>
          <tr><td>4º</td><td>360° − a</td><td>sen fica −</td></tr>
        </table></div>` },
      { id: "reducao", titulo: "Passo a passo", html: `
        <p><b>1.</b> Ache o quadrante.<br><b>2.</b> Ache o irmão no 1º quadrante.<br><b>3.</b> Pegue o valor na tabela.<br><b>4.</b> Ponha o sinal.</p>
        <p>Ex.: sen 330° → irmão 30° → 1/2 → no 4º o seno é − → <b>−1/2</b>.</p>` },
      { id: "exemplos", titulo: "Duas respostas", html: `
        <p>Um valor aparece em <b>dois ângulos</b>. Deixe a régua parada e gire: a ponta encosta duas vezes.</p>
        <p>Ex.: cosseno −√2/2 → <b>135°</b> e <b>225°</b>.</p>` }
    ],
    videos: [
      { id: "isbQRBIFdJY", titulo: "Redução ao 1º quadrante" },
      { id: "J4zDU4pUPec", titulo: "Seno e cosseno de 120°, 210° e −30°" },
      { id: "MJ8Yc4l6RWE", titulo: "Redução ao 1º quadrante", canal: "Profª Kity Guedes" }
    ]
  }
];

/* Qual parte da explicação ajuda em cada desafio */
C360.LEARN_LINKS = {
  f01: "ciclo/sentido", f02: "ciclo/quadrantes", f03: "senocos/notaveis", f04: "senocos/eixos",
  f05: "radianos/converter", f06: "senocos/eixos",
  m01: "senocos/notaveis", m02: "senocos/notaveis", m03: "radianos/converter", m04: "sinais/regra",
  m05: "simetria/espelhos", m06: "tangente/divisao", m07: "radianos/converter",
  d01: "simetria/reducao", d02: "simetria/reducao", d03: "simetria/espelhos", d04: "sinais/tangente-sinal",
  d05: "tangente/outro-lado", d06: "tangente/outro-lado", d07: "simetria/reducao",
  x01: "simetria/exemplos", x02: "simetria/espelhos", x03: "senocos/fundamental", x04: "sinais/tabela",
  x05: "tangente/nao-existe"
};

C360.learn = (function () {
  const byTema = { angulos: "ciclo", radianos: "radianos", senocos: "senocos", sinais: "sinais", tangente: "tangente", simetria: "simetria" };

  function linkFor(ch) {
    const l = C360.LEARN_LINKS[ch.id] || (byTema[ch.tema] + "/");
    const [topico, secao] = l.split("/");
    return { topico: C360.LEARN.find(t => t.id === topico) || C360.LEARN[0], secao: secao || null };
  }

  /* ---------- Figuras ---------- */
  const C = 110, R = 80;
  const P = (d, r = R) => [+(C + r * Math.cos(d * Math.PI / 180)).toFixed(1), +(C - r * Math.sin(d * Math.PI / 180)).toFixed(1)];
  const base = (extra = "", quads = true) => `
    ${quads ? ["#F6D55C", "#9ED39A", "#9EC6EE", "#F2A7C0"].map((col, q) => {
      const [x1, y1] = P(q * 90), [x2, y2] = P(q * 90 + 90);
      return `<path d="M${C} ${C} L${x1} ${y1} A${R} ${R} 0 0 0 ${x2} ${y2} Z" fill="${col}" opacity=".35"/>`;
    }).join("") : ""}
    <line x1="14" y1="${C}" x2="206" y2="${C}" class="lf-x"/><line x1="${C}" y1="14" x2="${C}" y2="206" class="lf-y"/>
    <circle cx="${C}" cy="${C}" r="${R}" class="lf-ring"/>${extra}`;
  const txt = (x, y, t, cls = "lf-t", anchor = "middle") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${t}</text>`;

  const FIGS = {
    ciclo: () => base(
      txt(196, C - 6, "0°") + txt(C + 16, 26, "90°") + txt(22, C - 6, "180°") + txt(C + 20, 202, "270°") +
      txt(152, 70, "1º", "lf-q") + txt(68, 70, "2º", "lf-q") + txt(68, 160, "3º", "lf-q") + txt(152, 160, "4º", "lf-q") +
      `<path d="M${P(15, 96).join(" ")} A96 96 0 0 0 ${P(70, 96).join(" ")}" class="lf-arrow" marker-end="url(#lf-arr)"/>` +
      `<line x1="${C}" y1="${C}" x2="${C + R}" y2="${C}" class="lf-r"/>` + txt(C + 40, C + 16, "raio = 1", "lf-s")),
    radiano: () => {
      const a = 57.3, [x, y] = P(a);
      return base(
        `<path d="M${C + R} ${C} A${R} ${R} 0 0 0 ${x} ${y}" class="lf-arc"/>
         <line x1="${C}" y1="${C}" x2="${C + R}" y2="${C}" class="lf-r"/><line x1="${C}" y1="${C}" x2="${x}" y2="${y}" class="lf-r"/>` +
        txt(C + 40, C + 16, "raio", "lf-s") + txt(P(a / 2, 98)[0] + 6, P(a / 2, 98)[1], "arco = raio", "lf-s", "start") +
        txt(C + 22, C - 10, "1 rad", "lf-b", "start") + txt(C, 214, "1 rad ≈ 57°   ·   π rad = 180°", "lf-s"), false);
    },
    senocos: () => {
      const [x, y] = P(30);
      return base(
        `<line x1="${x}" y1="${y}" x2="${x}" y2="${C}" class="lf-sen"/><line x1="${C}" y1="${C}" x2="${x}" y2="${C}" class="lf-cos"/>
         <line x1="${C}" y1="${C}" x2="${x}" y2="${y}" class="lf-ptr"/><circle cx="${x}" cy="${y}" r="5" class="lf-dot"/>` +
        txt(x + 4, y - 10, "sen 30° = 1/2", "lf-tsen", "end") + txt((C + x) / 2, C + 18, "cos 30° = √3/2", "lf-tcos") +
        txt(C + 26, C - 6, "30°", "lf-b", "start"));
    },
    sinais: () => base(
      [[45, "sen +", "cos +", "tg +"], [135, "sen +", "cos −", "tg −"], [225, "sen −", "cos −", "tg +"], [315, "sen −", "cos +", "tg −"]]
        .map(([d, a, b, c]) => { const [x, y] = P(d, 46); return txt(x, y - 10, a, "lf-tsen") + txt(x, y + 4, b, "lf-tcos") + txt(x, y + 18, c, "lf-ttg"); }).join("")),
    tangente: () => {
      const [x, y] = P(30), ty = +(C - R * Math.tan(Math.PI / 6)).toFixed(1);
      return base(
        `<line x1="${C + R}" y1="10" x2="${C + R}" y2="210" class="lf-tg"/>
         <line x1="${C}" y1="${C}" x2="${C + R}" y2="${ty}" class="lf-str"/>
         <line x1="${C}" y1="${C}" x2="${x}" y2="${y}" class="lf-ptr"/><circle cx="${C + R}" cy="${ty}" r="5" class="lf-tgdot"/>` +
        txt(C + R - 8, ty - 8, "tg 30° ≈ 0,58", "lf-ttg", "end") + txt(C + R + 4, 206, "x = 1", "lf-s", "start"), false);
    },
    simetria: () => {
      const pts = [30, 150, 210, 330].map(d => P(d));
      return base(
        `<polygon points="${pts.map(p => p.join(",")).join(" ")}" class="lf-rect"/>` +
        pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="5" class="lf-dot"/>` +
          txt(p[0] + (i === 0 || i === 3 ? 8 : -8), p[1] + (i < 2 ? -8 : 16), [30, 150, 210, 330][i] + "°", "lf-b", i === 0 || i === 3 ? "start" : "end")).join(""));
    }
  };

  function figure(kind) {
    const f = FIGS[kind];
    if (!f) return "";
    return `<svg class="lr-fig" viewBox="0 0 220 222" role="img" aria-label="Figura: ${kind}">
      <defs><marker id="lf-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="lf-arrowhead"/></marker></defs>
      ${f()}</svg>`;
  }

  /* ---------- Vídeos ---------- */
  function videoCard(v) {
    const url = "https://www.youtube.com/watch?v=" + v.id;
    return `<a class="lr-video" href="${url}" target="_blank" rel="noopener" data-video="${v.id}">
      <span class="lr-video__thumb"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">
        <span class="lr-video__play" aria-hidden="true">▶</span></span>
      <span class="lr-video__info"><b>${v.titulo}</b><small>${v.canal ? v.canal + " · " : ""}YouTube ↗</small></span>
    </a>`;
  }

  /** Nos sites publicados (http/https) o vídeo toca dentro da página; aberto do computador, abre no YouTube. */
  function bindVideos(scope) {
    if (!/^https?:$/.test(location.protocol)) return;
    scope.addEventListener("click", e => {
      const a = e.target.closest("[data-video]");
      if (!a || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const box = document.createElement("div");
      box.className = "lr-video lr-video--playing";
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${a.dataset.video}?autoplay=1&rel=0" title="${a.querySelector("b").textContent}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      a.replaceWith(box);
    });
  }

  /** HTML completo de um tema (usado na aba Aprenda e na explicação dentro da lição). */
  function topicHTML(t, { destaque = null, compacto = false } = {}) {
    const ch = C360.mascot ? C360.mascot.CHARS[t.char] : null;
    return `
      <div class="lr-intro">
        ${C360.mascot ? C360.mascot.svg({ char: t.char, mood: "idle", size: compacto ? 70 : 90 }) : ""}
        <div class="speech" style="--who:${ch ? ch.cor : "var(--accent)"}">
          <span class="speech__who">${ch ? ch.nome : ""}</span>
          <p class="speech__text">${t.fala}</p>
        </div>
      </div>
      <div class="lr-grid">
        <div class="lr-text">
          ${t.secoes.map(s => `<section class="lr-sec ${s.id === destaque ? "is-focus" : ""}" id="${t.id}-${s.id}" data-sec="${s.id}">
            <h3>${s.id === destaque ? '<span class="lr-focus-tag">Para este desafio</span>' : ""}${s.titulo}</h3>${s.html}</section>`).join("")}
        </div>
        <aside class="lr-side">
          ${figure(t.figura)}
          <h3 class="lr-side__h">Vídeos</h3>
          <div class="lr-videos">${t.videos.map(videoCard).join("")}</div>
        </aside>
      </div>`;
  }

  return { linkFor, figure, topicHTML, bindVideos, videoCard };
})();
