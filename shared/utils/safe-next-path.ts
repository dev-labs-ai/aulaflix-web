// From the reference app's src/lib/auth.ts. It lives in shared/ because both the sign-in page and the
// sign-in routes sanitize `?next=`.

/**
 * Aceita só caminhos internos (ex.: "/cursos"), para o `?next=` não virar redirecionamento aberto.
 * Recusa "//site" e também "/\site", que o navegador lê como "//site".
 */
export function safeNextPath(value: unknown): string {
  return typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : '/'
}
