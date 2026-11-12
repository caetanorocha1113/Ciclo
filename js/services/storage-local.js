/**
 * Adaptador LOCAL: guarda tudo no localStorage do navegador.
 * Implementa exatamente a mesma interface do adaptador da API (storage-api.js).
 * Todos os métodos são assíncronos de propósito: assim o resto do site já está
 * pronto para trabalhar com um banco de dados remoto.
 *
 * Interface comum dos adaptadores:
 *   init()
 *   register({nome, email, turma, papel, senha})  → {user, token}
 *   login(email, senha)                            → {user, token}
 *   getUser(id)                                    → user | null
 *   listChallenges()                               → challenge[]
 *   getProgress(userId)                            → progress[]
 *   saveProgress(entry)                            → progress
 *   resetProgress(userId)
 *   getRanking({turma})                            → linha[]
 *   listTurmas()                                   → string[]
 *   removeDemoData()
 */
window.C360 = window.C360 || {};

C360.LocalAdapter = (function () {
  const KEY = "c360:db:v1";

  function empty() { return { users: [], progress: [], meta: { version: 1, seeded: false } }; }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || empty(); }
    catch (e) { return empty(); }
  }
  let db = load();

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { console.warn("Não foi possível salvar no navegador:", e); }
  }
  const clone = o => JSON.parse(JSON.stringify(o));
  const uid = () => (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const publicUser = u => { if (!u) return null; const { senhaHash, ...rest } = u; return clone(rest); };

  /* Hash simples só para não guardar a senha em texto puro no navegador.
     No modo API, quem cuida da senha é o servidor (bcrypt/argon2). */
  async function hash(text) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("c360:" + text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return "djb2-" + (h >>> 0).toString(16);
  }

  /* Alunos de exemplo para o ranking não começar vazio na apresentação. */
  function seed() {
    const nomes = [
      ["Ana Beatriz", "2º A"], ["Lucas Martins", "2º A"], ["Júlia Souza", "2º B"],
      ["Pedro Henrique", "2º B"], ["Marina Costa", "2º A"], ["Gabriel Lima", "2º B"]
    ];
    const chs = C360.CHALLENGES;
    nomes.forEach(([nome, turma], i) => {
      const u = { id: uid(), nome, email: `exemplo${i + 1}@ciclo360.demo`, turma, papel: "aluno",
        senhaHash: "-", demo: true, criadoEm: new Date().toISOString() };
      db.users.push(u);
      const quantos = [16, 13, 11, 8, 6, 3][i];
      chs.slice(0, quantos).forEach((c, j) => {
        const erros = (i + j) % 3 === 0 ? 1 : 0;
        const dicas = (i + j) % 5 === 0 ? 1 : 0;
        db.progress.push({
          id: uid(), userId: u.id, challengeId: c.id, concluido: true, erros, dicas,
          pontos: C360.scoring.pointsFor(c, erros, dicas),
          atualizadoEm: new Date(Date.now() - (j + 1) * 3600e3).toISOString()
        });
      });
    });
  }

  return {
    name: "local",

    async init() {
      if (C360.config.seedDemoData && !db.meta.seeded) {
        seed();
        db.meta.seeded = true;
        persist();
      }
    },

    async register({ nome, email, turma, papel, senha }) {
      email = email.trim().toLowerCase();
      if (db.users.some(u => u.email === email)) throw new Error("Já existe uma conta com este e-mail.");
      const user = {
        id: uid(), nome: nome.trim(), email, turma: (turma || "").trim(),
        papel: papel === "professor" ? "professor" : "aluno",
        senhaHash: await hash(senha), demo: false, criadoEm: new Date().toISOString()
      };
      db.users.push(user);
      persist();
      return { user: publicUser(user), token: null };
    },

    async login(email, senha) {
      email = String(email).trim().toLowerCase();
      const u = db.users.find(x => x.email === email && !x.demo);
      if (!u || u.senhaHash !== await hash(senha)) throw new Error("E-mail ou senha incorretos.");
      return { user: publicUser(u), token: null };
    },

    async getUser(id) {
      return publicUser(db.users.find(u => u.id === id));
    },

    async listChallenges() {
      return clone(C360.CHALLENGES);
    },

    async getProgress(userId) {
      return clone(db.progress.filter(p => p.userId === userId));
    },

    async saveProgress(entry) {
      const i = db.progress.findIndex(p => p.userId === entry.userId && p.challengeId === entry.challengeId);
      const row = { ...(i >= 0 ? db.progress[i] : { id: uid() }), ...entry, atualizadoEm: new Date().toISOString() };
      if (i >= 0) db.progress[i] = row; else db.progress.push(row);
      persist();
      return clone(row);
    },

    async resetProgress(userId) {
      db.progress = db.progress.filter(p => p.userId !== userId);
      persist();
    },

    async getRanking({ turma } = {}) {
      const linhas = db.users
        .filter(u => u.papel === "aluno")
        .filter(u => !turma || u.turma === turma)
        .map(u => {
          const done = db.progress.filter(p => p.userId === u.id && p.concluido);
          return {
            userId: u.id, nome: u.nome, turma: u.turma, demo: !!u.demo,
            pontos: done.reduce((s, p) => s + (p.pontos || 0), 0),
            concluidos: done.length,
            ultimo: done.map(p => p.atualizadoEm).sort().pop() || null
          };
        });
      linhas.sort((a, b) => b.pontos - a.pontos || b.concluidos - a.concluidos
        || String(a.ultimo).localeCompare(String(b.ultimo)));
      return linhas;
    },

    async listTurmas() {
      return [...new Set(db.users.map(u => u.turma).filter(Boolean))].sort();
    },

    async removeDemoData() {
      const ids = new Set(db.users.filter(u => u.demo).map(u => u.id));
      db.users = db.users.filter(u => !ids.has(u.id));
      db.progress = db.progress.filter(p => !ids.has(p.userId));
      persist();
    }
  };
})();
