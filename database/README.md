# Ligando o site ao banco de dados (Supabase)

O Supabase é um banco de dados online com login pronto. O plano gratuito é suficiente para uma ou várias turmas.
Com ele, cada aluno entra de qualquer celular ou computador e o ranking reúne a turma inteira.

Tempo estimado: 10 minutos.

## 1. Criar o projeto
1. Acesse https://supabase.com e crie uma conta (pode entrar com o Google).
2. Clique em **New project**. Dê o nome `ciclo360`, crie uma senha para o banco (guarde-a) e escolha a região **South America (São Paulo)**.
3. Aguarde uns 2 minutos até o projeto ficar pronto.

## 2. Criar as tabelas e carregar os desafios
1. No menu lateral, abra **SQL Editor** e clique em **New query**.
2. Abra o arquivo `database/supabase.sql` (Bloco de Notas serve), copie **tudo** e cole no editor.
3. Clique em **Run**. Deve aparecer "Success". Isso cria as tabelas, as regras de segurança, o ranking e os 25 desafios.

Pode rodar o mesmo arquivo de novo no futuro (por exemplo, depois de editar desafios): nada é apagado.

## 3. Deixar os alunos entrarem na hora
Por padrão o Supabase pede que cada pessoa confirme o e-mail antes de entrar.
Para a sala de aula é mais prático desligar isso:
**Authentication → Sign In / Providers → Email → desmarque "Confirm email" → Save.**
(Se preferir manter a confirmação, o site avisa o aluno para abrir o e-mail antes de entrar.)

## 4. Ligar o site ao projeto
1. Em **Project Settings → API** (ou **API Keys**), copie:
   - **Project URL** (algo como `https://abcdefgh.supabase.co`)
   - a chave **anon** ou **publishable** (é pública, pode ficar no site). Nunca use a chave `service_role`/`secret`.
2. Abra `js/config.js` no Bloco de Notas e cole entre as aspas:
   ```js
   supabaseUrl: "https://abcdefgh.supabase.co",
   supabaseKey: "cole-a-chave-aqui",
   ```
3. Salve e abra o `index.html`. Embaixo do formulário deve aparecer **"Conectado ao banco de dados"**.

## 5. Colocar o site no ar para a turma (opcional)
Para os alunos acessarem por um link, publique a pasta inteira do site em um serviço gratuito,
como Netlify Drop (arraste a pasta em https://app.netlify.com/drop) ou GitHub Pages.

---

## Como os dados ficam guardados
| Tabela | O que guarda |
|---|---|
| `profiles` | nome, e-mail, turma e papel (aluno/professor) de cada conta |
| `challenges` | os 25 desafios (para editar um desafio, use **Table Editor**) |
| `progress` | erros, dicas, pontos e se concluiu, por aluno e desafio |

Para ver o desempenho da turma direto no banco: **Table Editor → progress**, ou use o botão
"Exportar planilha" na página de ranking (entrando como professor).

## Segurança já configurada
- Cada aluno só vê e altera o próprio progresso.
- Os pontos são calculados pelo próprio banco, então ninguém consegue se dar pontos alterando o site.
- Depois que um desafio é concluído, ele não muda mais.
- O ranking mostra apenas nome, turma e pontos, sem e-mails.
- O aluno não consegue trocar o próprio papel para professor depois do cadastro.

Limitação conhecida: as respostas dos desafios ficam acessíveis para quem souber inspecionar o site.
Para uma competição valendo nota, o próximo passo seria conferir a resposta no banco (uma função SQL) em vez de no navegador.

## Outros modos
Em `js/config.js`, `storageMode` pode ser `"local"` (só no navegador), `"supabase"` ou `"api"`
(uma API REST própria; o contrato está comentado em `js/services/storage-api.js`).
