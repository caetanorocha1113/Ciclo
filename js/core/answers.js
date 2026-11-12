/**
 * Leitura e correção das respostas dos alunos.
 * Aceita: 0,5 · 0.5 · 1/2 · -1/2 · √3/2 · -√2/2 · raiz3/2 · 2√3 · 150°
 */
window.C360 = window.C360 || {};

C360.answers = (function () {
  function normalize(raw) {
    return String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[−–—]/g, "-")
      .replace(/,/g, ".")
      .replace(/°|graus?|º/g, "")
      .replace(/raiz(de)?/g, "√")
      .replace(/sqrt\(?(\d+(?:\.\d+)?)\)?/g, "√$1");
  }

  /** Converte o texto em número. Retorna NaN se não conseguir. */
  function parseNumber(raw) {
    const s = normalize(raw);
    if (!s) return NaN;
    const m = s.match(/^([+-]?)(\d*\.?\d*)(?:√(\d+(?:\.\d+)?))?(?:\/(\d+(?:\.\d+)?))?$/);
    if (!m) return NaN;
    const [, sign, coefTxt, rootTxt, denTxt] = m;
    if (!coefTxt && !rootTxt) return NaN;
    let v = coefTxt ? parseFloat(coefTxt) : 1;
    if (Number.isNaN(v)) return NaN;
    if (rootTxt) v *= Math.sqrt(parseFloat(rootTxt));
    if (denTxt) {
      const d = parseFloat(denTxt);
      if (!d) return NaN;
      v /= d;
    }
    return sign === "-" ? -v : v;
  }

  function normalizeAngle(a) {
    return ((Math.round(a) % 360) + 360) % 360;
  }

  /**
   * Corrige uma resposta.
   * @returns {{ok:boolean, valida:boolean, mensagem?:string}}
   */
  function check(challenge, raw) {
    if (challenge.tipo === "escolha") {
      if (raw === null || raw === undefined || raw === "") {
        return { ok: false, valida: false, mensagem: "Escolha uma das opções." };
      }
      return { ok: Number(raw) === challenge.resposta, valida: true };
    }

    const v = parseNumber(raw);
    if (Number.isNaN(v)) {
      return {
        ok: false, valida: false,
        mensagem: challenge.tipo === "angulo"
          ? "Digite o ângulo em graus, por exemplo 150."
          : "Digite um número, por exemplo 0,5 ou 1/2 ou √3/2."
      };
    }

    if (challenge.tipo === "angulo") {
      return { ok: normalizeAngle(v) === normalizeAngle(challenge.resposta), valida: true };
    }

    const tol = challenge.tolerancia ?? 0.02;
    return { ok: Math.abs(v - challenge.resposta) <= tol + 1e-9, valida: true };
  }

  /** Texto da resposta correta para mostrar depois de concluir. */
  function correctText(challenge) {
    if (challenge.tipo === "escolha") return challenge.opcoes[challenge.resposta];
    if (challenge.tipo === "angulo") return challenge.resposta + "°";
    const r = Math.round(challenge.resposta * 100) / 100;
    return String(r).replace(".", ",").replace("-", "−");
  }

  return { parseNumber, check, correctText };
})();
