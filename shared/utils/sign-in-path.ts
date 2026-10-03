// From `requireUser` in the reference app's src/lib/auth.ts. It lives in shared/ because both the pages and
// the API routes send a signed-out visitor to sign in.

/** /entrar com `?next=`, para voltar a `path` depois de entrar. */
export const signInPath = (path: string) => `/entrar?next=${encodeURIComponent(path)}`
