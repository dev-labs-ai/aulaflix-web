// Input helpers shared by the auth routes, from the reference app's src/lib/auth-actions.ts.
import { isRecord } from './cookie-store'

export const NAME_MAX_LENGTH = 80

/** O campo `field` do corpo da requisição como texto, ou "" se não vier. */
export function bodyText(body: unknown, field: string) {
  const value = isRecord(body) ? body[field] : undefined
  return value === undefined || value === null ? '' : String(value)
}

export const cleanName = (value: string) => value.trim().replace(/\s+/g, ' ')
