/**
 * Sons curtos gerados no próprio navegador (sem arquivos de áudio) e vibração no celular.
 * O som pode ser desligado; a escolha fica salva neste aparelho.
 */
window.C360 = window.C360 || {};

C360.sfx = (function () {
  const KEY = "c360:som";
  let ctx = null;
  let on = localStorage.getItem(KEY) !== "off";

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type = "sine", vol = .18) {
    const a = ac();
    if (!a) return;
    const t = a.currentTime + start;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  const vibrate = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

  const sounds = {
    tap: () => tone(660, 0, .06, "triangle", .08),
    certo: () => { tone(784, 0, .14, "triangle"); tone(1175, .1, .26, "triangle"); vibrate(30); },
    errado: () => { tone(220, 0, .18, "sawtooth", .07); tone(185, .12, .24, "sawtooth", .07); vibrate([40, 40, 60]); },
    combo: () => { [784, 988, 1319].forEach((f, i) => tone(f, i * .07, .16, "triangle", .12)); },
    fim: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .1, .3, "triangle", .14)); vibrate([30, 60, 30, 60, 80]); },
    dica: () => { tone(988, 0, .12, "sine", .1); tone(740, .09, .18, "sine", .1); }
  };

  return {
    get on() { return on; },
    toggle() { on = !on; localStorage.setItem(KEY, on ? "on" : "off"); if (on) sounds.tap(); return on; },
    play(name) { if (on && sounds[name]) { try { sounds[name](); } catch (e) {} } }
  };
})();
