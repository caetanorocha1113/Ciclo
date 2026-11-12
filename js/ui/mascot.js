/**
 * Personagens do Ciclo 360°.
 *   Radi  – o mascote: um ciclo trigonométrico com um ponteiro no lugar do braço.
 *   Sena  – a altura (seno): alta e vermelha, como a régua do seno.
 *   Cosi  – a largura (cosseno): larguinho e azul, como a régua do cosseno.
 *   Tang  – a tangente: comprido e inclinado, cor de palito de churrasco.
 *
 * Humores: "idle", "happy", "sad", "think", "wow".
 */
window.C360 = window.C360 || {};

C360.mascot = (function () {
  const CHARS = {
    radi: { id: "radi", nome: "Radi", cor: "#7C4DCC", escura: "#5A2FA6", clara: "#D9C7FA", papel: "mascote do Ciclo 360°" },
    sena: { id: "sena", nome: "Sena", cor: "#E2574C", escura: "#B23A30", clara: "#FFD3CC", papel: "a régua do seno" },
    cosi: { id: "cosi", nome: "Cosi", cor: "#2F74D0", escura: "#1D529E", clara: "#CFE2FF", papel: "a régua do cosseno" },
    tang: { id: "tang", nome: "Tang", cor: "#D98A1F", escura: "#A8650E", clara: "#FFE6BF", papel: "a reta da tangente" }
  };

  const ARM = { idle: 35, happy: 80, sad: -55, think: 68, wow: 55 };
  const MOODS_PT = { idle: "tranquilo", happy: "feliz", sad: "triste", think: "pensativo", wow: "empolgado" };

  /* Olhos, sobrancelhas, boca e bochechas. (cx, cy) = centro do rosto. */
  function face(cx, cy, mood, s = 1) {
    const ex = 14 * s, er = 8.5 * s, pr = 4.6 * s;
    const eyes = [cx - ex, cx + ex];
    let out = "";

    if (mood === "happy") {
      out += eyes.map(x => `<path d="M${x - er} ${cy + 2 * s} Q${x} ${cy - 9 * s} ${x + er} ${cy + 2 * s}" fill="none" stroke="#21123B" stroke-width="${3.4 * s}" stroke-linecap="round"/>`).join("");
    } else {
      const dx = mood === "think" ? -2.5 * s : 0, dy = mood === "think" ? -3.5 * s : mood === "sad" ? 2 * s : 1 * s;
      const big = mood === "wow" ? 1.25 : 1;
      out += `<g class="m-eyes">` + eyes.map(x =>
        `<circle cx="${x}" cy="${cy}" r="${er * big}" fill="#fff"/>
         <circle cx="${x + dx}" cy="${cy + dy}" r="${pr * big}" fill="#21123B"/>
         <circle cx="${x + dx + 1.6 * s}" cy="${cy + dy - 1.8 * s}" r="${1.5 * s}" fill="#fff"/>`).join("") + `</g>`;
    }
    if (mood === "sad") {
      out += `<path d="M${cx - ex - 8 * s} ${cy - 11 * s} L${cx - ex + 6 * s} ${cy - 15 * s}" stroke="#21123B" stroke-width="${2.6 * s}" stroke-linecap="round"/>
              <path d="M${cx + ex + 8 * s} ${cy - 11 * s} L${cx + ex - 6 * s} ${cy - 15 * s}" stroke="#21123B" stroke-width="${2.6 * s}" stroke-linecap="round"/>`;
    }
    if (mood === "think") {
      out += `<path d="M${cx + ex - 7 * s} ${cy - 15 * s} Q${cx + ex} ${cy - 19 * s} ${cx + ex + 8 * s} ${cy - 14 * s}" fill="none" stroke="#21123B" stroke-width="${2.6 * s}" stroke-linecap="round"/>`;
    }

    const my = cy + 15 * s;
    const mouths = {
      idle: `<path d="M${cx - 8 * s} ${my - 2 * s} Q${cx} ${my + 6 * s} ${cx + 8 * s} ${my - 2 * s}" fill="none" stroke="#21123B" stroke-width="${3 * s}" stroke-linecap="round"/>`,
      happy: `<path d="M${cx - 11 * s} ${my - 4 * s} Q${cx} ${my + 13 * s} ${cx + 11 * s} ${my - 4 * s} Z" fill="#21123B"/><path d="M${cx - 5 * s} ${my + 3.5 * s} Q${cx} ${my + 1 * s} ${cx + 5 * s} ${my + 3.5 * s} Q${cx} ${my + 7.5 * s} ${cx - 5 * s} ${my + 3.5 * s}" fill="#FF7FA0"/>`,
      sad: `<path d="M${cx - 8 * s} ${my + 4 * s} Q${cx} ${my - 4 * s} ${cx + 8 * s} ${my + 4 * s}" fill="none" stroke="#21123B" stroke-width="${3 * s}" stroke-linecap="round"/>`,
      think: `<circle cx="${cx + 3 * s}" cy="${my + 1 * s}" r="${3.6 * s}" fill="#21123B"/>`,
      wow: `<ellipse cx="${cx}" cy="${my + 2 * s}" rx="${6 * s}" ry="${7.5 * s}" fill="#21123B"/>`
    };
    out += mouths[mood] || mouths.idle;
    if (mood !== "sad") {
      out += `<ellipse cx="${cx - ex - 5 * s}" cy="${cy + 11 * s}" rx="${5 * s}" ry="${3 * s}" fill="#FF8FB1" opacity=".55"/>
              <ellipse cx="${cx + ex + 5 * s}" cy="${cy + 11 * s}" rx="${5 * s}" ry="${3 * s}" fill="#FF8FB1" opacity=".55"/>`;
    }
    if (mood === "sad") out += `<path d="M${cx + ex + 9 * s} ${cy + 4 * s} q${2 * s} ${5 * s} 0 ${7 * s} q${-2 * s} ${-2 * s} 0 ${-7 * s}" fill="#8FD3FF"/>`;
    return out;
  }

  /* Braço em forma de ponteiro, girando em torno de (px, py). */
  function arm(px, py, len, angle, cor, escura, clara) {
    const a = angle * Math.PI / 180;
    const x = px + len * Math.cos(a), y = py - len * Math.sin(a);
    return `<g class="m-arm" style="transform-origin:${px}px ${py}px">
      <line x1="${px}" y1="${py}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${escura}" stroke-width="7" stroke-linecap="round"/>
      <line x1="${px}" y1="${py}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${clara}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${clara}" stroke="${escura}" stroke-width="2.5"/>
    </g>`;
  }

  const feet = (c, xs) => xs.map(x => `<ellipse cx="${x}" cy="117" rx="11" ry="6.5" fill="${c.escura}"/>`).join("");
  const shadow = `<ellipse class="m-shadow" cx="60" cy="125" rx="32" ry="4.5" fill="#21123B" opacity=".14"/>`;

  function body(id, mood) {
    const c = CHARS[id];
    const ang = ARM[mood] ?? ARM.idle;
    if (id === "sena") {
      return shadow + feet(c, [48, 72]) +
        `<g class="m-body"><rect x="36" y="14" width="48" height="102" rx="24" fill="${c.cor}"/>
         <path d="M44 92 q6 -10 12 0 t12 0 t12 0" fill="none" stroke="${c.clara}" stroke-width="3" stroke-linecap="round" opacity=".8"/>
         <line x1="60" y1="4" x2="60" y2="16" stroke="${c.escura}" stroke-width="4" stroke-linecap="round"/>
         <circle cx="60" cy="4" r="4.5" fill="${c.clara}" stroke="${c.escura}" stroke-width="2"/>
         ${face(60, 48, mood, .82)}</g>` + arm(82, 72, 24, ang, c.cor, c.escura, c.clara);
    }
    if (id === "cosi") {
      return shadow + feet(c, [40, 80]) +
        `<g class="m-body"><rect x="10" y="44" width="100" height="70" rx="35" fill="${c.cor}"/>
         <path d="M36 100 H84 M40 96 l-4 4 4 4 M80 96 l4 4 -4 4" fill="none" stroke="${c.clara}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
         ${face(60, 70, mood, .85)}</g>` + arm(106, 84, 20, ang, c.cor, c.escura, c.clara);
    }
    if (id === "tang") {
      return shadow + feet(c, [50, 70]) +
        `<g class="m-body"><rect x="40" y="6" width="40" height="110" rx="16" fill="${c.cor}"/>
         <path d="M40 104 L80 64" stroke="${c.clara}" stroke-width="5" opacity=".75"/>
         <path d="M40 116 L80 76" stroke="${c.escura}" stroke-width="3" opacity=".35"/>
         ${face(60, 36, mood, .72)}</g>` + arm(78, 62, 22, ang, c.cor, c.escura, c.clara);
    }
    /* Radi */
    return shadow + feet(c, [44, 76]) +
      `<g class="m-body"><circle cx="60" cy="66" r="48" fill="${c.cor}"/>
       <circle cx="60" cy="66" r="48" fill="none" stroke="${c.escura}" stroke-width="3"/>
       <path d="M30 34 A40 40 0 0 1 90 34" fill="none" stroke="${c.clara}" stroke-width="3" stroke-linecap="round" opacity=".55"/>
       ${[200, 230, 310, 340].map(d => { const a = d * Math.PI / 180; return `<line x1="${60 + 42 * Math.cos(a)}" y1="${66 - 42 * Math.sin(a)}" x2="${60 + 48 * Math.cos(a)}" y2="${66 - 48 * Math.sin(a)}" stroke="${c.clara}" stroke-width="3" opacity=".6"/>`; }).join("")}
       <line x1="60" y1="10" x2="60" y2="20" stroke="${c.clara}" stroke-width="4" stroke-linecap="round"/>
       ${face(60, 60, mood, 1.18)}</g>` + arm(102, 78, 28, ang, c.cor, c.escura, c.clara);
  }

  /**
   * Retorna o SVG de um personagem.
   * @param {object} o  { char: "radi"|"sena"|"cosi"|"tang", mood, size, anim: "wave"|"bounce"|"shake"|"none" }
   */
  function svg({ char = "radi", mood = "idle", size = 96, anim, className = "" } = {}) {
    const c = CHARS[char] || CHARS.radi;
    const a = anim || { idle: "wave", happy: "bounce", sad: "shake", think: "tilt", wow: "bounce" }[mood] || "none";
    return `<svg class="mascot mascot--${a} ${className}" width="${size}" height="${Math.round(size * 130 / 120)}" viewBox="0 0 120 130"
      role="img" aria-label="${c.nome}, ${c.papel}, ${MOODS_PT[mood] || ""}">${body(c.id, mood)}</svg>`;
  }

  /* Quem apresenta cada desafio */
  function forChallenge(ch) {
    if (ch.tema === "tangente") return "tang";
    if (ch.tema === "angulos" || ch.tema === "radianos") return "radi";
    const txt = (ch.enunciado + " " + ch.titulo).toLowerCase();
    const sen = /\bsen|seno/.test(txt), cos = /\bcos|cosseno/.test(txt);
    if (sen && !cos) return "sena";
    if (cos && !sen) return "cosi";
    return "radi";
  }

  const FRASES = {
    certo: ["Mandou bem!", "Isso aí!", "Perfeito!", "Que giro!", "Acertou em cheio!", "Na mosca!", "Arrasou!"],
    errado: ["Quase!", "Ainda não…", "Gira mais uma vez!", "Hmm, não foi dessa vez."],
    combo: n => `${n} seguidas! Você está pegando fogo!`
  };
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  return { CHARS, svg, forChallenge, FRASES, pick };
})();
