/**
 * Banco de desafios.
 * Hoje fica neste arquivo; quando o banco de dados entrar, a tabela "challenges"
 * terá os mesmos campos (veja database/schema.sql) e este arquivo vira só a carga inicial.
 *
 * tipo:
 *   "escolha" → opcoes[] e resposta = índice da opção correta
 *   "numero"  → resposta numérica; aceita 0,5 / 1/2 / √3/2 / -√2/2 ; tolerancia opcional
 *   "angulo"  → resposta em graus (0 a 360); 360 é tratado como 0
 */
window.C360 = window.C360 || {};

C360.DIFFICULTIES = {
  facil: {
    id: "facil", label: "Fácil", pontos: 10, ordem: 1, etapa: "Aquecimento",
    descricao: "Conheça o ciclo e as réguas."
  },
  medio: {
    id: "medio", label: "Médio", pontos: 20, ordem: 2, etapa: "Explorando o ciclo",
    descricao: "Ângulos notáveis e radianos."
  },
  dificil: {
    id: "dificil", label: "Difícil", pontos: 35, ordem: 3, etapa: "Todos os quadrantes",
    descricao: "O ponteiro vai para o outro lado."
  },
  desafio360: {
    id: "desafio360", label: "Desafio 360", pontos: 50, ordem: 4, etapa: "Desafio final",
    descricao: "Para quem já domina o ciclo."
  }
};

C360.THEMES = {
  angulos:   "Ângulos e quadrantes",
  radianos:  "Radianos",
  senocos:   "Seno e cosseno",
  sinais:    "Sinais",
  tangente:  "Tangente",
  simetria:  "Simetrias"
};

C360.CHALLENGES = [
  /* ---------- FÁCIL ---------- */
  {
    id: "f01", dificuldade: "facil", tema: "angulos",
    titulo: "Para onde aponta o 90°?",
    noCiclo: "Gire do 0° até o 90°.",
    enunciado: "Em 90°, para onde o ponteiro aponta?",
    tipo: "escolha", opcoes: ["Para a direita", "Para cima", "Para a esquerda", "Para baixo"], resposta: 1,
    dicas: ["O 0° fica à direita.", "Gire um quarto de volta, contra o relógio."],
    explicacao: "O 0° fica à direita e o ciclo gira contra o relógio. Um quarto de volta leva o ponteiro para cima."
  },
  {
    id: "f02", dificuldade: "facil", tema: "angulos",
    titulo: "Que quadrante é esse?",
    noCiclo: "Gire até 135° e veja a cor.",
    enunciado: "Em que quadrante fica 135°?",
    tipo: "escolha", opcoes: ["1º quadrante", "2º quadrante", "3º quadrante", "4º quadrante"], resposta: 1,
    dicas: ["O 1º quadrante vai de 0° a 90°.", "135° está entre 90° e 180°."],
    explicacao: "O 2º quadrante vai de 90° a 180°. O 135° está nele."
  },
  {
    id: "f03", dificuldade: "facil", tema: "senocos",
    titulo: "Primeira leitura do seno",
    noCiclo: "Gire até 30° e encoste a régua vermelha na ponta.",
    enunciado: "Quanto vale sen 30°?",
    tipo: "numero", resposta: 0.5, tolerancia: 0.02,
    dicas: ["A régua para a 5 cm do centro.", "5 cm é a metade de 10 cm."],
    explicacao: "A régua do seno para na metade do raio. Então sen 30° = 1/2."
  },
  {
    id: "f04", dificuldade: "facil", tema: "senocos",
    titulo: "Cosseno no começo da volta",
    noCiclo: "Deixe em 0° e encoste a régua azul na ponta.",
    enunciado: "Quanto vale cos 0°?",
    tipo: "numero", resposta: 1, tolerancia: 0.02,
    dicas: ["Em 0°, a ponta está no eixo x.", "A régua azul vai até o fim do raio."],
    explicacao: "Em 0° a ponta está a 1 raio do centro, à direita. Então cos 0° = 1."
  },
  {
    id: "f05", dificuldade: "facil", tema: "radianos",
    titulo: "Meia volta",
    noCiclo: "Ache o π no anel de dentro.",
    enunciado: "π rad vale quantos graus?",
    tipo: "angulo", resposta: 180,
    dicas: ["π é meia volta.", "A volta inteira tem 360°."],
    explicacao: "π é meia volta. Meia volta = 180°."
  },
  {
    id: "f06", dificuldade: "facil", tema: "senocos",
    titulo: "Lá embaixo",
    noCiclo: "Gire até 270° e use a régua vermelha.",
    enunciado: "Quanto vale sen 270°?",
    tipo: "numero", resposta: -1, tolerancia: 0.02,
    dicas: ["Em 270° o ponteiro aponta para baixo.", "Abaixo do eixo x, o seno é negativo."],
    explicacao: "Em 270° a ponta está 1 raio abaixo do centro. Então sen 270° = −1."
  },

  /* ---------- MÉDIO ---------- */
  {
    id: "m01", dificuldade: "medio", tema: "senocos",
    titulo: "O cosseno de 60°",
    noCiclo: "Gire até 60° e use a régua azul.",
    enunciado: "Quanto vale cos 60°?",
    tipo: "numero", resposta: 0.5, tolerancia: 0.02,
    dicas: ["Compare com sen 30°.", "A régua azul para na metade do raio."],
    explicacao: "A régua azul para a 5 cm. Então cos 60° = 1/2, igual a sen 30°."
  },
  {
    id: "m02", dificuldade: "medio", tema: "senocos",
    titulo: "A diagonal",
    noCiclo: "Gire até 45° e compare as duas réguas.",
    enunciado: "Quanto vale sen 45°?",
    tipo: "numero", resposta: Math.SQRT2 / 2, tolerancia: 0.02,
    dicas: ["Em 45° as duas réguas ficam iguais.", "A régua para em uns 7,1 cm."],
    explicacao: "Em 45° o ponto fica na diagonal: seno e cosseno são iguais, √2/2 ≈ 0,71."
  },
  {
    id: "m03", dificuldade: "medio", tema: "radianos",
    titulo: "De radianos para graus",
    noCiclo: "Ache 5π/6 no anel de dentro.",
    enunciado: "5π/6 rad vale quantos graus?",
    tipo: "angulo", resposta: 150,
    dicas: ["π/6 = 30°.", "5 × 30°."],
    explicacao: "π/6 = 30°. Então 5π/6 = 5 × 30° = 150°."
  },
  {
    id: "m04", dificuldade: "medio", tema: "sinais",
    titulo: "Cosseno do 2º quadrante",
    noCiclo: "Gire de 90° até 180° e olhe a régua azul.",
    enunciado: "No 2º quadrante, o cosseno é:",
    tipo: "escolha", opcoes: ["Positivo", "Negativo", "Sempre zero", "Depende do ângulo"], resposta: 1,
    dicas: ["Cosseno é o lado: direita ou esquerda.", "No 2º quadrante o ponto fica à esquerda."],
    explicacao: "No 2º quadrante o ponto fica à esquerda. Então o cosseno é negativo."
  },
  {
    id: "m05", dificuldade: "medio", tema: "simetria",
    titulo: "Mesma altura, outro lado",
    noCiclo: "Deixe a régua vermelha na altura de 30°. Gire até a ponta encostar de novo.",
    enunciado: "Que ângulo do 2º quadrante tem seno 1/2?",
    tipo: "angulo", resposta: 150,
    dicas: ["Mesma altura de 30°, do lado esquerdo.", "Quanto falta para 180°?"],
    explicacao: "150° tem a mesma altura de 30°, do outro lado. Então sen 150° = 1/2."
  },
  {
    id: "m06", dificuldade: "medio", tema: "tangente",
    titulo: "Tangente da diagonal",
    noCiclo: "Gire até 45°. Estique o barbante até a reta da tangente.",
    enunciado: "Quanto vale tg 45°?",
    tipo: "numero", resposta: 1, tolerancia: 0.03,
    dicas: ["Em 45°, seno e cosseno são iguais.", "tg = sen ÷ cos."],
    explicacao: "O barbante cruza a reta na marca 1. Então tg 45° = 1."
  },
  {
    id: "m07", dificuldade: "medio", tema: "radianos",
    titulo: "Três quartos de volta",
    noCiclo: "Ache 3π/2 no anel de dentro.",
    enunciado: "3π/2 rad vale quantos graus?",
    tipo: "angulo", resposta: 270,
    dicas: ["π/2 = 90°.", "3 × 90°."],
    explicacao: "π/2 = 90°. Então 3π/2 = 270°."
  },

  /* ---------- DIFÍCIL ---------- */
  {
    id: "d01", dificuldade: "dificil", tema: "simetria",
    titulo: "Seno no 3º quadrante",
    noCiclo: "Gire até 210° e compare com 30°.",
    enunciado: "Quanto vale sen 210°?",
    tipo: "numero", resposta: -0.5, tolerancia: 0.02,
    dicas: ["210° = 180° + 30°.", "Mesma distância de 30°, mas abaixo do eixo."],
    explicacao: "A régua para na mesma distância de 30°, só que embaixo. Então sen 210° = −1/2."
  },
  {
    id: "d02", dificuldade: "dificil", tema: "simetria",
    titulo: "Cosseno no 4º quadrante",
    noCiclo: "Gire até 300° e use a régua azul.",
    enunciado: "Quanto vale cos 300°?",
    tipo: "numero", resposta: 0.5, tolerancia: 0.02,
    dicas: ["300° = 360° − 60°.", "No 4º quadrante o ponto fica à direita."],
    explicacao: "300° é o espelho de 60°. A régua azul fica no mesmo lugar: cos 300° = 1/2."
  },
  {
    id: "d03", dificuldade: "dificil", tema: "simetria",
    titulo: "Espelho do 45°",
    noCiclo: "Deixe a régua azul em 45°. Gire até encostar de novo, embaixo.",
    enunciado: "Que ângulo do 4º quadrante tem o mesmo cosseno de 45°?",
    tipo: "angulo", resposta: 315,
    dicas: ["O ponto desce, mas não vai para o lado.", "Quanto falta de 45° para 360°?"],
    explicacao: "315° = 360° − 45°. É o espelho de 45°, com o mesmo cosseno."
  },
  {
    id: "d04", dificuldade: "dificil", tema: "sinais",
    titulo: "Dois negativos",
    noCiclo: "Monte as placas de sinais nos quatro quadrantes.",
    enunciado: "Em que quadrante seno e tangente são negativos?",
    tipo: "escolha", opcoes: ["1º quadrante", "2º quadrante", "3º quadrante", "4º quadrante"], resposta: 3,
    dicas: ["Seno negativo: 3º e 4º.", "Tangente negativa: seno e cosseno com sinais diferentes."],
    explicacao: "Seno negativo: 3º e 4º. No 3º a tangente é positiva. Só no 4º os dois são negativos."
  },
  {
    id: "d05", dificuldade: "dificil", tema: "tangente",
    titulo: "Barbante para o outro lado",
    noCiclo: "Gire até 120°. Estique o barbante pelo centro até a reta.",
    enunciado: "Quanto vale tg 120°?",
    tipo: "numero", resposta: -Math.sqrt(3), tolerancia: 0.03,
    dicas: ["O barbante cruza abaixo do eixo x.", "tg 60° ≈ 1,73."],
    explicacao: "O barbante cruza a reta em −1,73. Então tg 120° = −√3."
  },
  {
    id: "d06", dificuldade: "dificil", tema: "tangente",
    titulo: "Tangente igual a 1, de novo",
    noCiclo: "Gire pelo 3º quadrante e olhe onde o barbante cruza a reta.",
    enunciado: "Que ângulo do 3º quadrante tem tangente 1?",
    tipo: "angulo", resposta: 225,
    dicas: ["No 3º, seno e cosseno são negativos: a divisão fica positiva.", "Meia volta depois de 45°."],
    explicacao: "225° = 180° + 45°. Seno e cosseno são iguais (−√2/2), então tg 225° = 1."
  },
  {
    id: "d07", dificuldade: "dificil", tema: "radianos",
    titulo: "Cosseno em radianos",
    noCiclo: "Ache 4π/3, gire até lá e use a régua azul.",
    enunciado: "Quanto vale cos(4π/3)?",
    tipo: "numero", resposta: -0.5, tolerancia: 0.02,
    dicas: ["4π/3 = 240°.", "240° = 180° + 60°."],
    explicacao: "4π/3 = 240°. A régua azul fica na distância de 60°, mas à esquerda: −1/2."
  },

  /* ---------- DESAFIO 360 ---------- */
  {
    id: "x01", dificuldade: "desafio360", tema: "simetria",
    titulo: "Dois ângulos, um seno",
    noCiclo: "Deixe a régua vermelha em −0,87. Ache os dois ângulos que encostam nela.",
    enunciado: "Dois ângulos têm seno −√3/2. Qual é o menor?",
    tipo: "angulo", resposta: 240,
    dicas: ["sen 60° = √3/2. Procure abaixo do eixo x.", "Estão no 3º e no 4º quadrantes."],
    explicacao: "Os ângulos são 240° e 300°. O menor é 240°."
  },
  {
    id: "x02", dificuldade: "desafio360", tema: "simetria",
    titulo: "Réguas opostas",
    noCiclo: "Procure as réguas na mesma distância, em lados opostos.",
    enunciado: "Que ângulo do 2º quadrante tem sen = −cos?",
    tipo: "angulo", resposta: 135,
    dicas: ["Distâncias iguais: 45°, 135°, 225° ou 315°.", "No 2º, seno + e cosseno −."],
    explicacao: "Em 135°: sen = √2/2 e cos = −√2/2. Sinais opostos."
  },
  {
    id: "x03", dificuldade: "desafio360", tema: "senocos",
    titulo: "A conta que sempre dá igual",
    noCiclo: "Gire até 150°. Eleve cada régua ao quadrado e some.",
    enunciado: "Quanto vale sen²150° + cos²150°?",
    tipo: "numero", resposta: 1, tolerancia: 0.02,
    dicas: ["sen 150° = 1/2 e cos 150° = −√3/2.", "1/4 + 3/4."],
    explicacao: "1/4 + 3/4 = 1. Dá 1 em qualquer ângulo: é o Pitágoras com o ponteiro."
  },
  {
    id: "x04", dificuldade: "desafio360", tema: "sinais",
    titulo: "Contando no disco",
    noCiclo: "Passe pelas 16 marcas. Conte quando a régua azul fica à esquerda.",
    enunciado: "Quantos dos 16 ângulos têm cosseno negativo?",
    tipo: "numero", resposta: 7, tolerancia: 0,
    dicas: ["Cosseno negativo: 2º e 3º quadrantes, e o 180°.", "90° e 270° têm cosseno zero."],
    explicacao: "São 120°, 135°, 150°, 180°, 210°, 225° e 240°: sete."
  },
  {
    id: "x05", dificuldade: "desafio360", tema: "tangente",
    titulo: "O barbante que nunca chega",
    noCiclo: "Gire devagar até o barbante subir muito.",
    enunciado: "Qual é o menor ângulo em que a tangente não existe?",
    tipo: "angulo", resposta: 90,
    dicas: ["O barbante fica paralelo à reta.", "Isso acontece com cosseno zero."],
    explicacao: "Em 90° o barbante nunca cruza a reta. cos 90° = 0, e não dá para dividir por zero."
  }
];

/* Desenho de cada carta: ângulo indicado na tarefa (angulo) ou quadrante em destaque.
   Nunca mostra a resposta. */
(function () {
  const VISUAL = {
    f01: { angulo: 90 }, f02: { angulo: 135 }, f03: { angulo: 30 }, f04: { angulo: 0 },
    f06: { angulo: 270 }, m01: { angulo: 60 }, m02: { angulo: 45 }, m04: { quadrante: 2 },
    m05: { angulo: 30 }, m06: { angulo: 45 }, d01: { angulo: 210 }, d02: { angulo: 300 },
    d03: { angulo: 45 }, d05: { angulo: 120 }, d06: { quadrante: 3 }, x02: { quadrante: 2 },
    x03: { angulo: 150 }, x05: { quadrante: 1 }
  };
  C360.CHALLENGES.forEach((c, i) => {
    c.ordem = i + 1;
    if (c.visual === undefined) c.visual = VISUAL[c.id] || null;
  });
})();
