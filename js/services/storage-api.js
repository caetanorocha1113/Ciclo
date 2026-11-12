/**
 * Adaptador da API: base para a integração com o banco de dados.
 *
 * Ainda NÃO há servidor. Este arquivo já define as chamadas que o site fará
 * e o formato esperado. Para ativar:
 *   1. crie a API seguindo database/README.md (contrato dos endpoints)
 *   2. em js/config.js, preencha apiBaseUrl e troque storageMode para "api"
 *
 * Nenhuma outra parte do site precisa mudar: as páginas só conversam com C360.db.
 */
window.C360 = window.C360 || {};

C360.ApiAdapter = (function () {
  const TOKEN_KEY = "c360:token";

  function base() {
    const url = (C360.config.apiBaseUrl || "").replace(/\/+$/, "");
    if (!url) throw new Error("A API ainda não foi configurada. Preencha apiBaseUrl em js/config.js.");
    return url;
  }

  async function request(path, { method = "GET", body, query } = {}) {
    let url = base() + path;
    if (query) {
      const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== ""));
      if ([...qs].length) url += "?" + qs;
    }
    const headers = { "Content-Type": "application/json", "Accept": "application/json" };
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = "Bearer " + token;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), C360.config.apiTimeoutMs);
    let res;
    try {
      res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctrl.signal });
    } catch (e) {
      throw new Error(e.name === "AbortError"
        ? "O servidor demorou para responder. Tente de novo."
        : "Sem conexão com o servidor. Verifique a internet.");
    } finally {
      clearTimeout(timer);
    }

    if (res.status === 204) return null;
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401) C360.auth && C360.auth.clearSession();
      throw new Error((data && data.message) || `Erro ${res.status} no servidor.`);
    }
    return data;
  }

  return {
    name: "api",
    TOKEN_KEY,

    async init() { base(); },

    /* POST /auth/register  → { user, token } */
    register(dados) { return request("/auth/register", { method: "POST", body: dados }); },

    /* POST /auth/login     → { user, token } */
    login(email, senha) { return request("/auth/login", { method: "POST", body: { email, senha } }); },

    /* GET /users/:id       → user */
    getUser(id) { return request(`/users/${encodeURIComponent(id)}`); },

    /* GET /challenges      → challenge[] */
    listChallenges() { return request("/challenges"); },

    /* GET /users/:id/progress → progress[] */
    getProgress(userId) { return request(`/users/${encodeURIComponent(userId)}/progress`); },

    /* PUT /users/:id/progress/:challengeId → progress
       O servidor deve recalcular os pontos com as mesmas regras de js/core/scoring.js. */
    saveProgress(entry) {
      return request(`/users/${encodeURIComponent(entry.userId)}/progress/${encodeURIComponent(entry.challengeId)}`,
        { method: "PUT", body: entry });
    },

    /* DELETE /users/:id/progress */
    resetProgress(userId) { return request(`/users/${encodeURIComponent(userId)}/progress`, { method: "DELETE" }); },

    /* GET /ranking?turma=  → linha[] */
    getRanking({ turma } = {}) { return request("/ranking", { query: { turma } }); },

    /* GET /turmas          → string[] */
    listTurmas() { return request("/turmas"); },

    /* No banco real não há dados de exemplo. */
    async removeDemoData() {}
  };
})();
