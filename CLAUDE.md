## Agent skills

### Issue tracker

Issues live in GitHub Issues at `dev-labs-ai/aulaflix-web`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created when the first term or decision is settled. See `docs/agents/domain.md`.

## Porting conventions

This repo ports the Aulaflix prototype from Next.js 16 to Nuxt 4. The reference app is [`dev-labs-ai/aulaflix`](https://github.com/dev-labs-ai/aulaflix). It is frozen (nothing new lands there) and gets archived once this port reaches parity.

### Parity

- Same pages, flows, pt-BR copy and URLs as the reference app, including the temporary redirects `/cadastrar`, `/compras` and `/configuracoes`. A difference from the reference app is a bug here, unless an issue says otherwise.
- No new features, fixes or redesigns during the port. A bug found in the reference app goes into an issue, not silently into the port.
- The backend stays simulated in cookies, weaknesses included. See `docs/adr/0001-keep-the-simulated-backend.md`.

### Where things go

- `shared/content/`: `src/content/*` from the reference app, copied unchanged and imported as `#shared/content/...`.
- `shared/utils/`: framework-free helpers (`cn`, `container`, `ringOffset`, `buttonClass` from `ui.tsx`, and `format.ts`).
- `server/utils/`: the data layer from `src/lib` (cookie store, session, accounts, enrollments, purchases, waitlist), ported as a whole.
- `server/api/`: one route per former Server Action. Components call it with `$fetch`, then `refreshNuxtData()`. See `docs/adr/0002-server-actions-become-api-routes.md`.
- `app/components/`: one `.vue` file per React component, in the same folders (`aula/`, `auth/`, `compra/`, `curso/`) and with the same name. Path prefixes are off (`pathPrefix: false`), so `curso/CourseHero.vue` is `<CourseHero>`. React files that export several components (like `ui.tsx`) become one file per component.
- Signed-in pages are guarded by a route middleware that does what `requireUser()` did: redirect to `/entrar?next=…`. `/aprender` still sends a student who does not own the course to its course page (`/cursos/<slug>`, 307), and answers 404 for an unknown course or lesson.

### Stack

- SSR, so the app needs a server runtime. No static hosting.
- Tailwind CSS v4 through `@tailwindcss/vite`. The tokens, utilities (`pautado`, `tracejado`) and chalk animations from `globals.css` are copied unchanged. CSS modules become `<style module>`.
- Fonts through `@nuxt/fonts`: Bricolage Grotesque (with the `opsz` axis) and Atkinson Hyperlegible Next, latin only.
- Icons from `@lucide/vue`, with the same names as in `lucide-react`. Not `lucide-vue-next`, which is deprecated.
- A plain `<img>` where the reference app used `next/image`.

### Tests and definition of done

- Playwright e2e tests live in `tests/e2e/` and run against either app through `BASE_URL`. Locally, run the reference app on port 3000 and this one on 3001.
- Each route ticket starts by writing its e2e test and watching it pass against the reference app, then ports the route, then watches the test pass here.
- Tests sign in by setting the `aulaflix_session` cookie to the account email. Only the sign-in and sign-up tests go through `/entrar`.
- A route ticket is done when:
  - its e2e test covers what the route shows and each of its interactions;
  - it was compared side by side with the reference app at 1440px and 390px, with no horizontal scroll;
  - lint, typecheck, build and e2e pass in CI;
  - the matching README section points to the Nuxt paths.

### Language

Issues, PRs, commits and identifiers are in English. User-facing copy stays in pt-BR, copied from the content files.
