import type { H3Event } from 'h3'

// Dados do protótipo guardados em cookies deste navegador, até existir um banco de dados:
// JSON em base64url num cookie httpOnly, no mesmo formato do app de referência.

const baseOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const

/** Lê o JSON do cookie `name`; `null` se não houver cookie ou se ele não for um JSON válido. */
export function readJsonCookie(event: H3Event, name: string): unknown {
  const raw = getCookie(event, name)
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
  }
  catch {
    return null
  }
}

/** Grava `value` como JSON no cookie `name`, por `maxAge` segundos (padrão: 1 ano). */
export function writeJsonCookie(event: H3Event, name: string, value: unknown, maxAge = 60 * 60 * 24 * 365) {
  const raw = Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
  setCookie(event, name, raw, { ...baseOptions, maxAge })
}

/** Objeto comum (não array, não null), para validar o que vem de um cookie. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
