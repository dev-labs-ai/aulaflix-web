## Agent skills

### Issue tracker

Issues live in GitHub Issues at `dev-labs-ai/aulaflix-web`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created when the first term or decision is settled. See `docs/agents/domain.md`.

## Project conventions

This repo is the Aulaflix prototype in Nuxt 4. It was ported from a Next.js 16 app, [`dev-labs-ai/aulaflix`](https://github.com/dev-labs-ai/aulaflix), and reached parity with it in #15. That repository is archived, and nothing lands there anymore. Code comments, ADRs and issues that mention "the reference app" mean that app.

The backend stays simulated in cookies, weaknesses included. See `docs/adr/0001-keep-the-simulated-backend.md`.

### Where things go

- `shared/content/`: the site's copy and course data (site, courses, course details, how it works, auth, account), imported as `#shared/content/...`.
- `shared/utils/`: framework-free helpers (`cn`, `container`, `ringOffset` and `buttonClass` in `ui.ts`, the formatters in `format.ts`, and the `?next=` helpers).
- `server/utils/`: the simulated data layer (cookie store, session, accounts, enrollments, purchases, waitlist).
- `server/api/`: one route per action that changes data, plus the reads the pages fetch. Components call an action with `$fetch`, then `refreshNuxtData()`. See `docs/adr/0002-server-actions-become-api-routes.md`.
- `app/components/`: one component per `.vue` file, grouped by area (`aula/`, `auth/`, `compra/`, `curso/`). Path prefixes are off (`pathPrefix: false`), so `curso/CourseHero.vue` is `<CourseHero>`.
- Signed-in pages are guarded by the `auth` route middleware (`app/middleware/auth.ts`), which redirects to `/entrar?next=…`. `/aprender` sends a student who does not own the course to its course page (`/cursos/<slug>`, 307), and answers 404 for an unknown course or lesson.

### Stack

- SSR, so the app needs a server runtime. No static hosting.
- Tailwind CSS v4 through `@tailwindcss/vite`. The tokens, the `pautado` and `tracejado` utilities and the chalk animations live in `app/assets/css/globals.css`. Component-scoped CSS uses `<style module>`.
- Fonts through `@nuxt/fonts`: Bricolage Grotesque (with the `opsz` axis) and Atkinson Hyperlegible Next, latin only.
- Icons from `@lucide/vue`. Not `lucide-vue-next`, which is deprecated.
- Images are a plain `<img>`.

### Tests and definition of done

- Playwright e2e tests live in `tests/e2e/`. `pnpm test:e2e` serves the production build on port 3001, or reuses a server already there. `BASE_URL` points the suite at an app running elsewhere.
- Tests sign in by setting the `aulaflix_session` cookie to the account email. Only the sign-in and sign-up tests go through `/entrar`.
- A ticket is done when:
  - its e2e tests cover what it changes;
  - the pages it touches were checked at 1440px and 390px, with no horizontal scroll;
  - lint, typecheck, build and e2e pass in CI;
  - the README still matches the code it describes.

### Language

Issues, PRs, commits and identifiers are in English. User-facing copy stays in pt-BR, copied from the content files.
