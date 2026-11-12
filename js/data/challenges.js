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
    descricao: "Primeiro contato com o material: posição dos ângulos e leitura das réguas."
  },
  medio: {
    id: "medio", label: "Médio", pontos: 20, ordem: 2, etapa: "Explorando o ciclo",
    descricao: "Ângulos notáveis, radianos e os primeiros sinais."
  },
  dificil: {
    id: "dificil", label: "Difícil", pontos: 35, ordem: 3, etapa: "Todos os quadrantes",
    descricao: "Simetrias e redução ao 1º quadrante: o ponteiro vai para o outro lado."
  },
  desafio360: {
    id: "desafio360", label: "Desafio 360", pontos: 50, ordem: 4, etapa: "Desafio final",
    descricao: "Para quem já domina o ciclo. Exigem raciocínio com mais de uma etapa."
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
    noCiclo: "Comece com o ponteiro em 0° e gire no sentido anti-horário até a marca de 90°.",
    enunciado: "Com o ponteiro em 90°, para onde ele aponta?",
    tipo: "escolha", opcoes: ["Para a direita", "Para cima", "Para a esquerda", "Para baixo"], resposta: 1,
    dicas: ["O 0° fica à direita, sobre o eixo x.", "Um quarto de volta no sentido anti-horário leva ao eixo y positivo."],
    explicacao: "No ciclo, o 0° fica à direita e os ângulos crescem no sentido anti-horário. 90° é um quarto de volta: o ponteiro fica para cima, sobre o eixo y."
  },
  {
    id: "f02", dificuldade: "facil", tema: "angulos",
    titulo: "Que quadrante é esse?",
    noCiclo: "Gire o ponteiro até 135° e observe a cor do quadrante.",
    enunciado: "Em qual quadrante fica o ângulo de 135°?",
    tipo: "escolha", opcoes: ["1º quadrante", "2º quadrante", "3º quadrante", "4º quadrante"], resposta: 1,
    dicas: ["O 1º quadrante vai de 0° a 90°.", "135° está entre 90° e 180°."],
    explicacao: "O 2º quadrante vai de 90° a 180°. Como 135° está nesse intervalo, o ponto fica acima do eixo x e à esquerda do eixo y."
  },
  {
    id: "f03", dificuldade: "facil", tema: "senocos",
    titulo: "Primeira leitura do seno",
    noCiclo: "Leve o ponteiro a 30° e deslize a régua vermelha (seno) até encostar na ponta.",
    enunciado: "Quanto vale sen 30°? Responda em número decimal ou fração.",
    tipo: "numero", resposta: 0.5, tolerancia: 0.02,
    dicas: ["Com raio de 10 cm, a régua do seno para a 5 cm do centro.", "5 cm de 10 cm é metade."],
    explicacao: "A régua do seno para na metade do raio. Como o raio vale 1, sen 30° = 1/2 = 0,5."
  },
  {
    id: "f04", dificuldade: "facil", tema: "senocos",
    titulo: "Cosseno no começo da volta",
    noCiclo: "Deixe o ponteiro em 0° e deslize a régua azul (cosseno) até a ponta.",
    enunciado: "Quanto vale cos 0°?",
    tipo: "numero", resposta: 1, tolerancia: 0.02,
    dicas: ["Em 0°, a ponta do ponteiro está sobre o eixo x.", "A régua azul vai até o final do raio."],
    explicacao: "Em 0° o ponto está na extremidade direita do eixo x, a uma unidade do centro. Por isso cos 0° = 1."
  },
  {
    id: "f05", dificuldade: "facil", tema: "radianos",
    titulo: "Meia volta",
    noCiclo: "Procure o π no anel interno do disco e veja qual grau está ao lado.",
    enunciado: "π rad corresponde a quantos graus?",
    tipo: "angulo", resposta: 180,
    dicas: ["π é meia volta.", "Uma volta completa tem 360°."],
    explicacao: "Uma volta completa vale 2π rad = 360°. Então π rad, que é meia volta, vale 180°."
  },
  {
    id: "f06", dificuldade: "facil", tema: "senocos",
    titulo: "Lá embaixo",
    noCiclo: "Gire até 270° e deslize a régua do seno até a ponta.",
    enunciado: "Quanto vale sen 270°?",
    tipo: "numero", resposta: -1, tolerancia: 0.02,
    dicas: ["Em 270° o ponteiro aponta para baixo.", "Abaixo do eixo x o seno é negativo."],
    explicacao: "Em 270° o ponto está na extremidade inferior do eixo y, uma unidade abaixo do centro. Logo sen 270° = −1."
  },

  /* ---------- MÉDIO ---------- */
  {
    id: "m01", dificuldade: "medio", tema: "senocos",
    titulo: "O cosseno de 60°",
    noCiclo: "Leve o ponteiro a 60° e use a régua azul.",
    enunciado: "Quanto vale cos 60°?",
    tipo: "numero", resposta: 0.5, tolerancia: 0.02,
    dicas: ["Compare com o seno de 30°.", "A régua azul para na metade do raio."],
    explicacao: "Em 60° a régua do cosseno para a 5 cm do centro: cos 60° = 1/2. Repare que cos 60° = sen 30°."
  },
  {
    id: "m02", dificuldade: "medio", tema: "senocos",
    titulo: "A diagonal",
    noCiclo: "Gire até 45° e deslize as duas réguas até a ponta. Compare as duas.",
    enunciado: "Quanto vale sen 45°? (pode responder √2/2 ou com duas casas decimais)",
    tipo: "numero", resposta: Math.SQRT2 / 2, tolerancia: 0.02,
    dicas: ["Em 45° as duas réguas param na mesma distância.", "A régua para em aproximadamente 7,1 cm."],
    explicacao: "Em 45° o ponto fica exatamente na diagonal, então seno e cosseno são iguais: √2/2 ≈ 0,71."
  },
  {
    id: "m03", dificuldade: "medio", tema: "radianos",
    titulo: "De radianos para graus",
    noCiclo: "Encontre 5π/6 no anel interno e leia o grau correspondente.",
    enunciado: "Quantos graus vale 5π/6 rad?",
    tipo: "angulo", resposta: 150,
    dicas: ["π/6 corresponde a 30°.", "5 vezes 30°."],
    explicacao: "Como π/6 = 30°, temos 5π/6 = 5 × 30° = 150°."
  },
  {
    id: "m04", dificuldade: "medio", tema: "sinais",
    titulo: "Cosseno do 2º quadrante",
    noCiclo: "Gire por todo o 2º quadrante (de 90° a 180°) e veja para que lado vai a régua azul.",
    enunciado: "No 2º quadrante, o cosseno é:",
    tipo: "escolha", opcoes: ["Positivo", "Negativo", "Sempre zero", "Depende do ângulo"], resposta: 1,
    dicas: ["O cosseno é a posição horizontal do ponto.", "No 2º quadrante o ponto está à esquerda do eixo y."],
    explicacao: "No 2º quadrante o ponto fica à esquerda do eixo y, então a régua do cosseno marca valores negativos."
  },
  {
    id: "m05", dificuldade: "medio", tema: "simetria",
    titulo: "Mesma altura, outro lado",
    noCiclo: "Deixe a régua do seno na altura de 30° e procure outro ângulo em que a ponta encosta nela.",
    enunciado: "Qual ângulo do 2º quadrante tem seno igual a 1/2?",
    tipo: "angulo", resposta: 150,
    dicas: ["O ponto precisa ficar na mesma altura de 30°, só que à esquerda.", "Quanto falta para 180°?"],
    explicacao: "150° é o simétrico de 30° em relação ao eixo y: mesma altura, outro lado. Por isso sen 150° = sen 30° = 1/2."
  },
  {
    id: "m06", dificuldade: "medio", tema: "tangente",
    titulo: "Tangente da diagonal",
    noCiclo: "Gire até 45°, estique o barbante ao longo do ponteiro até a reta da tangente e leia a escala.",
    enunciado: "Quanto vale tg 45°?",
    tipo: "numero", resposta: 1, tolerancia: 0.03,
    dicas: ["Em 45°, seno e cosseno são iguais.", "tg = sen ÷ cos."],
    explicacao: "O barbante cruza a reta x = 1 na marca 1. Faz sentido: tg 45° = sen 45° ÷ cos 45° = 1."
  },
  {
    id: "m07", dificuldade: "medio", tema: "radianos",
    titulo: "Três quartos de volta",
    noCiclo: "Encontre 3π/2 no anel interno.",
    enunciado: "Quantos graus vale 3π/2 rad?",
    tipo: "angulo", resposta: 270,
    dicas: ["π vale 180°.", "3π/2 = 3 × 90°."],
    explicacao: "π/2 vale 90°, então 3π/2 = 3 × 90° = 270°, três quartos de volta."
  },

  /* ---------- DIFÍCIL ---------- */
  {
    id: "d01", dificuldade: "dificil", tema: "simetria",
    titulo: "Seno no 3º quadrante",
    noCiclo: "Gire até 210° e compare a régua do seno com a de 30°.",
    enunciado: "Quanto vale sen 210°?",
    tipo: "numero", resposta: -0.5, tolerancia: 0.02,
    dicas: ["210° = 180° + 30°.", "A distância é a mesma de 30°, mas o ponto está abaixo do eixo x."],
    explicacao: "210° fica meia volta depois de 30°. A régua para à mesma distância (0,5), mas abaixo do eixo x: sen 210° = −1/2."
  },
  {
    id: "d02", dificuldade: "dificil", tema: "simetria",
    titulo: "Cosseno no 4º quadrante",
    noCiclo: "Gire até 300° e leia a régua azul.",
    enunciado: "Quanto vale cos 300°?",
    tipo: "numero", resposta: 0.5, tolerancia: 0.02,
    dicas: ["300° = 360° − 60°.", "No 4º quadrante o ponto está à direita do eixo y."],
    explicacao: "300° é o simétrico de 60° em relação ao eixo x. A régua do cosseno fica no mesmo lugar: cos 300° = cos 60° = 1/2."
  },
  {
    id: "d03", dificuldade: "dificil", tema: "simetria",
    titulo: "Espelho do 45°",
    noCiclo: "Deixe a régua azul na posição de 45° e procure o ângulo do 4º quadrante que encosta nela.",
    enunciado: "Qual ângulo do 4º quadrante tem o mesmo cosseno de 45°?",
    tipo: "angulo", resposta: 315,
    dicas: ["O ponto desce para baixo do eixo x, sem mudar a posição horizontal.", "Quanto falta de 45° para 360°?"],
    explicacao: "315° = 360° − 45°. É o espelho de 45° em relação ao eixo x, com o mesmo cosseno: √2/2."
  },
  {
    id: "d04", dificuldade: "dificil", tema: "sinais",
    titulo: "Dois negativos",
    noCiclo: "Monte as placas de sinais dos quatro quadrantes e procure onde seno e tangente são ambos −.",
    enunciado: "Em qual quadrante o seno e a tangente são negativos ao mesmo tempo?",
    tipo: "escolha", opcoes: ["1º quadrante", "2º quadrante", "3º quadrante", "4º quadrante"], resposta: 3,
    dicas: ["Seno negativo: 3º e 4º quadrantes.", "Tangente negativa: quando seno e cosseno têm sinais diferentes."],
    explicacao: "Seno negativo acontece no 3º e no 4º quadrantes. No 3º, o cosseno também é negativo e a tangente fica positiva. Só no 4º os dois são negativos."
  },
  {
    id: "d05", dificuldade: "dificil", tema: "tangente",
    titulo: "Barbante para o outro lado",
    noCiclo: "Gire até 120°. Estique o barbante do ponteiro, passando pelo centro, até a reta da tangente.",
    enunciado: "Quanto vale tg 120°? (responda −√3 ou com duas casas decimais)",
    tipo: "numero", resposta: -Math.sqrt(3), tolerancia: 0.03,
    dicas: ["O barbante cruza a reta abaixo do eixo x.", "Compare com tg 60° ≈ 1,73."],
    explicacao: "Em 120° o barbante passa pelo centro e cruza a reta x = 1 em −1,73. tg 120° = −√3."
  },
  {
    id: "d06", dificuldade: "dificil", tema: "tangente",
    titulo: "Tangente igual a 1, de novo",
    noCiclo: "Gire pelo 3º quadrante observando onde o barbante cruza a reta da tangente.",
    enunciado: "Qual ângulo do 3º quadrante tem tangente igual a 1?",
    tipo: "angulo", resposta: 225,
    dicas: ["No 3º quadrante, seno e cosseno são negativos: a divisão fica positiva.", "Meia volta depois de 45°."],
    explicacao: "225° = 180° + 45°. Seno e cosseno valem −√2/2, então tg 225° = 1, igual a tg 45°."
  },
  {
    id: "d07", dificuldade: "dificil", tema: "radianos",
    titulo: "Cosseno em radianos",
    noCiclo: "Encontre 4π/3 no anel interno, gire até lá e leia a régua azul.",
    enunciado: "Quanto vale cos(4π/3)?",
    tipo: "numero", resposta: -0.5, tolerancia: 0.02,
    dicas: ["4π/3 rad = 240°.", "240° = 180° + 60°."],
    explicacao: "4π/3 = 240°, no 3º quadrante. A régua azul fica à mesma distância de 60°, mas à esquerda: cos(4π/3) = −1/2."
  },

  /* ---------- DESAFIO 360 ---------- */
  {
    id: "x01", dificuldade: "desafio360", tema: "simetria",
    titulo: "Dois ângulos, um seno",
    noCiclo: "Posicione a régua do seno em −0,87 e encontre os dois ângulos em que a ponta encosta nela.",
    enunciado: "Entre 0° e 360°, dois ângulos têm seno igual a −√3/2. Digite o menor deles.",
    tipo: "angulo", resposta: 240,
    dicas: ["sen 60° = √3/2. Procure ângulos com a mesma distância, abaixo do eixo x.", "As respostas estão no 3º e no 4º quadrantes."],
    explicacao: "Os ângulos são 240° (180° + 60°) e 300° (360° − 60°). O menor é 240°."
  },
  {
    id: "x02", dificuldade: "desafio360", tema: "simetria",
    titulo: "Réguas opostas",
    noCiclo: "Procure um ângulo em que as duas réguas fiquem à mesma distância do centro, mas em lados opostos.",
    enunciado: "Qual ângulo do 2º quadrante tem sen = −cos?",
    tipo: "angulo", resposta: 135,
    dicas: ["Distâncias iguais acontecem nas diagonais (45°, 135°, 225°, 315°).", "No 2º quadrante o seno é + e o cosseno é −."],
    explicacao: "Em 135°, sen = √2/2 e cos = −√2/2. Mesma distância, sinais opostos: sen = −cos."
  },
  {
    id: "x03", dificuldade: "desafio360", tema: "senocos",
    titulo: "A conta que sempre dá igual",
    noCiclo: "Gire até 150°, leia as duas réguas, eleve cada valor ao quadrado e some. Teste em outros ângulos.",
    enunciado: "Quanto vale sen²150° + cos²150°?",
    tipo: "numero", resposta: 1, tolerancia: 0.02,
    dicas: ["sen 150° = 1/2 e cos 150° = −√3/2.", "1/4 + 3/4."],
    explicacao: "1/4 + 3/4 = 1. É a relação fundamental: o ponteiro tem sempre comprimento 1, e as réguas formam um triângulo retângulo com ele (Pitágoras)."
  },
  {
    id: "x04", dificuldade: "desafio360", tema: "sinais",
    titulo: "Contando no disco",
    noCiclo: "Gire por todas as 16 marcas do disco e conte em quantas a régua azul fica à esquerda do eixo y.",
    enunciado: "Quantos dos 16 ângulos notáveis do ciclo têm cosseno negativo?",
    tipo: "numero", resposta: 7, tolerancia: 0,
    dicas: ["Cosseno negativo: 2º e 3º quadrantes, e também 180°.", "90° e 270° têm cosseno zero, não negativo."],
    explicacao: "São 120°, 135°, 150°, 180°, 210°, 225° e 240°: sete ângulos. Em 90° e 270° o cosseno é zero."
  },
  {
    id: "x05", dificuldade: "desafio360", tema: "tangente",
    titulo: "O barbante que nunca chega",
    noCiclo: "Gire devagar pelo 1º quadrante e observe o barbante se aproximar do topo da reta da tangente.",
    enunciado: "Qual é o menor ângulo positivo em que a tangente não existe?",
    tipo: "angulo", resposta: 90,
    dicas: ["Procure onde o barbante fica paralelo à reta x = 1.", "Isso acontece quando o cosseno é zero."],
    explicacao: "Em 90° o barbante fica paralelo à reta da tangente e nunca a cruza. Como cos 90° = 0, a divisão sen ÷ cos não existe."
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
