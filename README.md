# Aulaflix

Protótipo do site do Aulaflix, uma plataforma de cursos online para desenvolvedores de software (backend, frontend, banco de dados, DevOps, IA e outras áreas). A estrutura das páginas partiu de uma réplica de [programe.ai](https://programe.ai/); a identidade visual é própria (veja abaixo). Textos e cursos são conteúdo de exemplo e as capas são placeholders.

O protótipo começou em Next.js, em [`dev-labs-ai/aulaflix`](https://github.com/dev-labs-ai/aulaflix) (arquivado), e foi portado para Nuxt 4 com as mesmas páginas, textos e endereços.

Stack: Nuxt 4 (Vue 3, SSR com servidor Nitro) · Tailwind CSS v4 · TypeScript · @lucide/vue · Playwright.

## Rodando

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm build      # build de produção; sirva com PORT=3001 node .output/server/index.mjs
pnpm lint
pnpm typecheck
```

### Testes e2e

Os testes ficam em `tests/e2e/` e rodam contra o app em `BASE_URL` (por padrão, `http://localhost:3001`).

```bash
pnpm exec playwright install chromium     # uma vez

pnpm test:e2e                             # reusa o que estiver na 3001 ou serve a build de produção (rode pnpm build antes)
BASE_URL=<endereço> pnpm test:e2e         # contra o app já rodando em outro endereço
```

Os testes entram na conta definindo o cookie de sessão, como faz `signIn` em `tests/e2e/helpers.ts`; só os testes de login e cadastro passam por `/entrar`.

O CI (`.github/workflows/ci.yml`) roda lint, typecheck, build e e2e em cada pull request.

## Rotas

| Rota | Arquivo |
| --- | --- |
| `/` | `app/pages/index.vue` |
| `/como-funciona` | `app/pages/como-funciona.vue` |
| `/cursos` (filtros `?area=` e `?situacao=a-venda\|em-breve`) | `app/pages/cursos/index.vue` |
| `/cursos/[slug]` (7 cursos) | `app/pages/cursos/[slug]/index.vue`, com as partes em `app/components/curso/` |
| `/cursos/[slug]/comprar` (cursos à venda) | `app/pages/cursos/[slug]/comprar.vue`, com o pagamento em `app/components/compra/PaymentForm.vue` e a rota em `server/api/checkout.post.ts` |
| `/meus-cursos` (só logado) | `app/pages/meus-cursos.vue`, com os dados de `server/api/enrollments.get.ts` |
| `/aprender/[curso]` (só para quem tem o curso) | `app/pages/aprender/[curso]/index.vue`, que leva à aula onde o aluno parou |
| `/aprender/[curso]/[aula]` (só para quem tem o curso) | `app/pages/aprender/[curso]/[aula].vue`, com as partes em `app/components/aula/` e as rotas em `server/api/learning/` |
| `/conta` (só logado; aba Dados da conta) | `app/pages/conta/index.vue`, com o título e as abas em `app/pages/conta.vue` |
| `/conta/compras` (só logado; aba Compras) | `app/pages/conta/compras.vue`, com os dados de `server/api/purchases.get.ts` |
| `/entrar` (entrar e criar conta) | `app/pages/entrar.vue` (sem header/rodapé), com o fluxo em `app/components/auth/` |
| `/redefinir-senha` | `app/pages/redefinir-senha.vue` (sem header/rodapé), com o fluxo em `app/components/auth/PasswordResetFlow.vue` |

O layout `app/layouts/default.vue` aplica header e rodapé (`app/components/SiteShell.vue`). Endereços inexistentes caem em `app/error.vue`, a página 404, que fica fora dos layouts e monta header e rodapé por conta própria. O mesmo vale para o 404 que uma página dispara (ex.: curso que não existe). As telas de autenticação ficam sem header e rodapé (`layout: false`). `/cadastrar` redireciona para `/entrar`, e os endereços antigos `/compras` e `/configuracoes` para as abas de `/conta` (`routeRules` em `nuxt.config.ts`).

## Onde mudar as coisas

- **Marca, título e descrição do site, menu:** `shared/content/site.ts`
- **Lista de cursos (título, área, resumo, status, ícone, cor, capa) e áreas do filtro do catálogo:** `shared/content/courses.ts`
- **Conteúdo de cada curso (ementa, aula grátis, preços, FAQ do curso):** `shared/content/course-details/<slug>.ts`. A aula marcada com `free: true` aparece no player da página do curso. O endereço de cada aula em `/aprender` sai do título (`lessonSlug` em `shared/content/course-details/index.ts`).
- **Como funciona (passos, lista de espera e dúvidas que valem para todos os cursos):** `shared/content/how-it-works.ts`. Cada passo tem o resumo da home (`summary`) e o texto da página `/como-funciona` (`details`). As dúvidas de um curso só ficam no `faq` dele; as que valem para todos, em `platformFaq`.
- **Home:** os botões de área da lousa saem de `areas` em `shared/content/courses.ts`, com os ícones de `areaIcons` em `app/utils/placeholders.ts`.
- **Login, cadastro e redefinição de senha (textos, mensagens de erro, regras de senha e código):** `shared/content/auth.ts`
- **Cores, raios, sombras, animações:** `app/assets/css/globals.css` (tokens `@theme` do Tailwind)
- **Fontes:** `fonts` em `nuxt.config.ts` e `app/assets/css/fonts.css` (Bricolage Grotesque nos títulos, Atkinson Hyperlegible Next no texto)
- **Logo e favicon:** `app/components/Logo.vue` (com a marca em `app/components/LogoMark.vue`) e `public/icon.svg`
- **Imagens:** `app/components/CourseCoverPlaceholder.vue` gera os placeholders, com os ícones e as cores de cada curso em `app/utils/placeholders.ts`. Para usar uma capa real de curso, coloque o arquivo em `public/` e preencha `image` no curso em `courses.ts` (`app/components/CourseCover.vue` passa a mostrá-la).

## Identidade visual

Direção "Lousa": a sala de aula como referência. Fundo de papel, texto em grafite e verde de quadro-negro como cor principal.

- **Lousa:** painel verde com a régua de madeira embaixo (`app/components/Board.vue`), usado no topo da home (com os botões de área, que abrem o catálogo filtrado), da página de curso (com o título, o preço e o botão de compra) e no "Continuar de onde parou" de Meus cursos. Os títulos aparecem como se fossem escritos a giz.
- **Fichas pautadas:** os cursos são fichas com linhas a cada 28px (`pautado`) e uma faixa no topo na cor do curso (`tone` em `courses.ts`: coral, amarelo ou sálvia), em `app/components/CourseCards.vue`. Nos cursos em lista de espera, a faixa é tracejada (`tracejado`).
- **Giz amarelo:** botão principal sobre a lousa, avatar, marcadores e selos de destaque.

## Login e cadastro

`/entrar` começa pelo e-mail. Se já existe conta, pede a senha; se não existe, pede nome e senha e cria a conta na hora. Para a conta de demonstração, use **aulaflix@email.com** com a senha **aulaflix**. Tudo é conferido no servidor (rotas em `server/api/auth/`) e a sessão fica num cookie `httpOnly` por 7 dias; com ela, o header mostra o usuário e o menu da conta, com Meus cursos, Conta e Sair. `/entrar?next=/caminho` define para onde ir depois de entrar.

A conta criada no cadastro fica num cookie deste navegador (com a senha em hash), e só uma por vez: um novo cadastro substitui a anterior. Ela começa sem cursos e com o e-mail por confirmar; enquanto isso, uma faixa abaixo do header (`app/components/EmailConfirmationNotice.vue`) pede a confirmação, sem bloquear nada, e oferece um botão de protótipo que faz o papel do link do e-mail.

As contas e a sessão ficam em `server/utils/auth.ts`; os cursos e o progresso inicial da conta de demonstração, em `server/utils/enrollments.ts` (as aulas concluídas e a última aula aberta de cada curso ficam em cookies deste navegador; é daí que sai o "Continuar de onde parou"), e os pedidos, em `server/utils/purchases.ts` (os feitos em `/cursos/[slug]/comprar` também ficam num cookie). Os cursos do aluno são os que aparecem nos pedidos dele. Páginas só para quem está logado usam o middleware `auth` (`app/middleware/auth.ts`), que manda para `/entrar?next=…`. Em Conta, o nome editado fica num cookie e aparece no header; a troca de senha é só simulada (a senha continua a mesma). As páginas sabem quem entrou por `/api/auth/session` (`app/composables/useSessionUser.ts`), e cada ação que muda dados (entrar, comprar, concluir uma aula, entrar na lista de espera) é uma rota em `server/api/`, chamada com `$fetch` e seguida de `refreshNuxtData()` (`docs/adr/0002-server-actions-become-api-routes.md`). É uma simulação: o cookie guarda só o e-mail e não é protegido contra falsificação, então deve ser substituído por um backend de autenticação real (`docs/adr/0001-keep-the-simulated-backend.md`).

## Limitações do protótipo

Fora o login, o cadastro, a compra e a lista de espera, os formulários (Google/GitHub, redefinição de senha) são só visuais: validam no navegador e mostram um estado de confirmação, mas não enviam nada. A compra não cobra nada: o pedido é aprovado na hora, e os dados do cartão são validados no navegador e nem chegam ao servidor. A lista de espera guarda a inscrição num cookie deste navegador (`server/utils/waitlist.ts`, com as rotas em `server/api/waitlist/`): com a conta, basta um clique em "Avise-me"; sem ela, só o e-mail. Nenhum e-mail é enviado de verdade. O player da aula grátis também é só visual: ainda não há vídeos. Na redefinição de senha, qualquer código de 6 dígitos é aceito.
