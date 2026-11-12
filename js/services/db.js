/**
 * Ponto único de acesso aos dados (C360.db) e à sessão (C360.auth).
 * As páginas usam somente estes dois objetos; trocar o banco é só trocar o adaptador.
 */
window.C360 = window.C360 || {};

C360.db = (function () {
  const cfg = C360.config;
  let mode = cfg.storageMode;
  if (mode === "auto") mode = (cfg.supabaseUrl && cfg.supabaseKey) ? "supabase" : "local";
  const adapter = { local: C360.LocalAdapter, supabase: C360.SupabaseAdapter, api: C360.ApiAdapter }[mode] || C360.LocalAdapter;
  const ready = adapter.init();
  const wrap = fn => async (...args) => { await ready; return adapter[fn](...args); };
  return {
    mode: adapter.name,
    ready,
    register: wrap("register"),
    login: wrap("login"),
    getUser: wrap("getUser"),
    listChallenges: wrap("listChallenges"),
    getProgress: wrap("getProgress"),
    saveProgress: wrap("saveProgress"),
    resetProgress: wrap("resetProgress"),
    getRanking: wrap("getRanking"),
    listTurmas: wrap("listTurmas"),
    removeDemoData: wrap("removeDemoData"),
    logout: async () => { await ready; if (adapter.logout) await adapter.logout(); }
  };
})();

C360.auth = (function () {
  const SESSION_KEY = "c360:session";

  function saveSession({ user, token }, lembrar) {
    const store = lembrar ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
    if (token) store.setItem(C360.ApiAdapter.TOKEN_KEY, token);
  }

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY));
    } catch (e) { return null; }
  }

  function clearSession() {
    [localStorage, sessionStorage].forEach(s => {
      s.removeItem(SESSION_KEY);
      s.removeItem(C360.ApiAdapter.TOKEN_KEY);
    });
  }

  return {
    async register(dados, lembrar = true) {
      const r = await C360.db.register(dados);
      saveSession(r, lembrar);
      return r.user;
    },
    async login(email, senha, lembrar = true) {
      const r = await C360.db.login(email, senha);
      saveSession(r, lembrar);
      return r.user;
    },
    async logout() {
      clearSession();
      await C360.db.logout().catch(() => {});
      location.href = "index.html";
    },
    clearSession,
    async currentUser() {
      const s = readSession();
      if (!s) return null;
      const u = await C360.db.getUser(s.userId).catch(() => null);
      if (!u) clearSession();
      return u;
    },
    /** Usado nas páginas internas: sem login, volta para a tela de entrada. */
    async requireUser() {
      const u = await this.currentUser();
      if (!u) { location.replace("index.html"); throw new Error("Sem sessão"); }
      return u;
    }
  };
})();
