/**
 * Configuração central do site Ciclo 360°.
 *
 * BANCO DE DADOS (Supabase)
 *   Cole aqui o endereço e a chave pública do seu projeto Supabase.
 *   Passo a passo completo em database/README.md.
 *   Enquanto os dois campos estiverem vazios, o site funciona em modo de
 *   demonstração, guardando os dados só neste navegador.
 */
window.C360 = window.C360 || {};

C360.config = {
  appName: "Ciclo 360°",

  // ↓↓↓ Preencha com os dados do Supabase (Project Settings → API) ↓↓↓
  supabaseUrl: "https://jclnekjsllmkvgcwveev.supabase.co",          
  supabaseKey: "sb_publishable_4eqE0whpjFlg_EZIYgSzcg_75Pa2m7S",          // chave "anon" ou "publishable" (pode ficar no site, é pública)
  // ↑↑↑

  // "auto" usa o Supabase quando os campos acima estão preenchidos; senão, o modo local.
  // Também aceita "local", "supabase" ou "api" (API REST própria, veja storage-api.js).
  storageMode: "auto",
  apiBaseUrl: "",
  apiTimeoutMs: 10000,

  seedDemoData: true,       // alunos de exemplo no ranking (só no modo local)
  prototypeUrl: "prototipo/ciclo-360.html",

  // Endereço do site publicado (ex.: "https://ciclo360.netlify.app/").
  // Usado para gerar os QR codes em qrcodes.html.
  siteUrl: "https://ciclotrigonometrico.netlify.app/"
};
