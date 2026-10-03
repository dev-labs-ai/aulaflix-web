import type { H3Event } from 'h3'
import { getCourse } from '#shared/content/courses'
import { isRecord, readJsonCookie, writeJsonCookie } from './cookie-store'

// Protótipo: as inscrições na lista de espera ficam num cookie deste navegador, por e-mail
// (o da conta, para quem entrou, ou o digitado no formulário): e-mail → slugs dos cursos.
// Nenhum aviso é enviado de verdade.
const WAITLIST_COOKIE = 'aulaflix_waitlist'

type WaitlistStore = Record<string, string[]>

function readWaitlist(event: H3Event): WaitlistStore {
  const value = readJsonCookie(event, WAITLIST_COOKIE)
  return isRecord(value) ? (value as WaitlistStore) : {}
}

const normalize = (email: string) => email.trim().toLowerCase()

export function isOnWaitlist(event: H3Event, email: string, courseSlug: string) {
  const courses = readWaitlist(event)[normalize(email)]
  return Array.isArray(courses) && courses.includes(courseSlug)
}

/** Inscreve (ou, com `join = false`, desinscreve) o e-mail. Só para cursos em lista de espera. */
export function setWaitlist(event: H3Event, email: string, courseSlug: string, join: boolean) {
  if (getCourse(courseSlug)?.status !== 'waitlist') return
  const store = readWaitlist(event)
  const key = normalize(email)
  const current = new Set(Array.isArray(store[key]) ? store[key] : [])
  if (join) current.add(courseSlug)
  else current.delete(courseSlug)
  writeJsonCookie(event, WAITLIST_COOKIE, { ...store, [key]: [...current] })
}
