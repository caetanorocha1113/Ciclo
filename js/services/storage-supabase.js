/**
 * Adaptador SUPABASE: banco de dados real (PostgreSQL) com login.
 * Usa a mesma interface do adaptador local, então as páginas não mudam.
 *
 * Tabelas, regras de acesso e funções: database/supabase.sql
 * Passo a passo de configuração: database/README.md
 */
window.C360 = window.C360 || {};

C360.SupabaseAdapter = (function () {
  let sb = null;

  /* Converte as mensagens do Supabase (em inglês) para algo útil ao aluno. */
  function friendly(error) {
    const m = String((error && (error.message || error.error_description)) || error || "");
    if (/invalid login credentials/i.test(m)) return "E-mail ou senha incorretos.";
    if (/already registered|already exists/i.test(m)) return "Já existe uma conta com este e-mail.";
    if (/email not confirmed/i.test(m)) return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
    if (/password should be at least/i.test(m)) return "A senha precisa ter pelo menos 6 caracteres.";
    if (/rate limit|too many/i.test(m)) return "Muitas tentativas seguidas. Aguarde um minuto e tente de novo.";
    if (/failed to fetch|network/i.test(m)) return "Sem conexão com o banco de dados. Verifique a internet.";
    if (/JWT|not authenticated|permission denied/i.test(m)) return "Sua sessão expirou. Entre novamente.";
    return m || "Erro inesperado no banco de dados.";
  }
  function check({ data, error }) {
    if (error) throw new Error(friendly(error));
    return data;
  }

  /* Banco (snake_case) ⇄ site (camelCase) */
  const toUser = r => r && ({ id: r.id, nome: r.nome, email: r.email, turma: r.turma || "", papel: r.papel, criadoEm: r.criado_em });
  const toProgress = r => ({
    id: r.id, userId: r.user_id, challengeId: r.challenge_id, concluido: r.concluido,
    erros: r.erros, dicas: r.dicas, pontos: r.pontos, atualizadoEm: r.atualizado_em
  });
  const toChallenge = r => ({
    id: r.id, dificuldade: r.dificuldade, tema: r.tema, titulo: r.titulo, noCiclo: r.no_ciclo,
    enunciado: r.enunciado, tipo: r.tipo, opcoes: r.opcoes || undefined, resposta: Number(r.resposta),
    tolerancia: r.tolerancia == null ? undefined : Number(r.tolerancia), dicas: r.dicas || [],
    explicacao: r.explicacao, visual: r.visual || null, ordem: r.ordem
  });

  return {
    name: "supabase",

    async init() {
      if (!window.supabase || !window.supabase.createClient) {
        throw new Error("Biblioteca do Supabase não carregou (js/vendor/supabase-*.js).");
      }
      sb = window.supabase.createClient(C360.config.supabaseUrl, C360.config.supabaseKey, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: "c360-auth" }
      });
    },

    async register({ nome, email, turma, papel, senha }) {
      const data = check(await sb.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: { data: { nome: nome.trim(), turma: (turma || "").trim(), papel } }
      }));
      if (!data.session) {
        throw new Error("Conta criada! Abra o e-mail de confirmação que enviamos e depois volte aqui para entrar.");
      }
      const user = await this.getUser(data.user.id);
      return { user: user || { id: data.user.id, nome, email, turma, papel }, token: null };
    },

    async login(email, senha) {
      const data = check(await sb.auth.signInWithPassword({ email: String(email).trim().toLowerCase(), password: senha }));
      const user = await this.getUser(data.user.id);
      if (!user) throw new Error("Seu perfil não foi encontrado no banco. Fale com o professor.");
      return { user, token: null };
    },

    async logout() {
      await sb.auth.signOut().catch(() => {});
    },

    async getUser(id) {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) return null;
      const row = check(await sb.from("profiles").select("*").eq("id", id).maybeSingle());
      return toUser(row);
    },

    async listChallenges() {
      const rows = check(await sb.from("challenges").select("*").eq("ativo", true).order("ordem"));
      return rows.length ? rows.map(toChallenge) : JSON.parse(JSON.stringify(C360.CHALLENGES));
    },

    async getProgress(userId) {
      return check(await sb.from("progress").select("*").eq("user_id", userId)).map(toProgress);
    },

    /* Os pontos são recalculados pelo banco (gatilho em supabase.sql). */
    async saveProgress(e) {
      const row = check(await sb.from("progress").upsert({
        user_id: e.userId, challenge_id: e.challengeId, concluido: !!e.concluido,
        erros: e.erros || 0, dicas: e.dicas || 0, pontos: e.pontos || 0
      }, { onConflict: "user_id,challenge_id" }).select().single());
      return toProgress(row);
    },

    async resetProgress(userId) {
      check(await sb.from("progress").delete().eq("user_id", userId));
    },

    async getRanking({ turma } = {}) {
      const rows = check(await sb.rpc("get_ranking", { p_turma: turma || null }));
      return rows.map(r => ({
        userId: r.user_id, nome: r.nome, turma: r.turma, demo: false,
        pontos: Number(r.pontos), concluidos: Number(r.concluidos), ultimo: r.ultimo
      }));
    },

    async listTurmas() {
      return check(await sb.rpc("list_turmas")).map(r => r.turma ?? r).filter(Boolean);
    },

    async removeDemoData() { /* no banco real não há alunos de exemplo */ }
  };
})();
