import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'
import { isRecord, readJsonCookie, writeJsonCookie } from './cookie-store'

// Autenticação do protótipo, sem banco de dados: a conta de demonstração e, no máximo,
// uma conta criada no cadastro, guardada num cookie deste navegador.
// O cookie de sessão guarda só o e-mail da conta, então não é seguro contra falsificação;
// serve para simular a sessão até existir um backend de autenticação de verdade (ADR 0001).

const DEMO_ACCOUNT = {
  name: 'Aluno Aulaflix',
  email: 'aulaflix@email.com',
  password: 'aulaflix',
}

const SESSION_COOKIE = 'aulaflix_session'
/** Nome da conta de demonstração alterado em Conta; sem ele, vale o nome original. */
const NAME_COOKIE = 'aulaflix_name'
/** Conta criada no cadastro. Um novo cadastro substitui a anterior. */
const ACCOUNT_COOKIE = 'aulaflix_account'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 dias
} as const

type Account = SessionUser & { passwordHash: string }

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')
const normalizeEmail = (email: string) => email.trim().toLowerCase()

/** Conta criada neste navegador. */
function readCreatedAccount(event: H3Event): Account | null {
  const value = readJsonCookie(event, ACCOUNT_COOKIE)
  if (!isRecord(value)) return null
  const { name, email, passwordHash, verified } = value
  if (typeof name !== 'string' || typeof email !== 'string' || typeof passwordHash !== 'string') return null
  return { name, email, passwordHash, verified: verified === true }
}

function writeCreatedAccount(event: H3Event, account: Account) {
  writeJsonCookie(event, ACCOUNT_COOKIE, account)
}

/** A conta com esse e-mail: a de demonstração ou a criada neste navegador. */
function findAccount(event: H3Event, email: string): Account | null {
  const normalized = normalizeEmail(email)
  if (normalized === DEMO_ACCOUNT.email) {
    const name = getCookie(event, NAME_COOKIE) || DEMO_ACCOUNT.name
    return { name, email: DEMO_ACCOUNT.email, passwordHash: hashPassword(DEMO_ACCOUNT.password), verified: true }
  }
  const created = readCreatedAccount(event)
  return created?.email === normalized ? created : null
}

const toSessionUser = ({ name, email, verified }: Account): SessionUser => ({ name, email, verified })

/** Usuário da sessão atual, ou `null` se ninguém entrou. */
export function getSessionUser(event: H3Event): SessionUser | null {
  const email = getCookie(event, SESSION_COOKIE)
  const account = email ? findAccount(event, email) : null
  return account && toSessionUser(account)
}

export function accountExists(event: H3Event, email: string) {
  return Boolean(findAccount(event, email))
}

export function checkCredentials(event: H3Event, email: string, password: string): SessionUser | null {
  const account = findAccount(event, email)
  return account && account.passwordHash === hashPassword(password) ? toSessionUser(account) : null
}

/** Cria a conta, com o e-mail ainda por confirmar. */
export function createAccount(event: H3Event, input: { name: string, email: string, password: string }): SessionUser {
  const account: Account = {
    name: input.name,
    email: normalizeEmail(input.email),
    passwordHash: hashPassword(input.password),
    verified: false,
  }
  writeCreatedAccount(event, account)
  return toSessionUser(account)
}

/** Marca o e-mail da conta criada como confirmado. */
export function markEmailVerified(event: H3Event, email: string) {
  const created = readCreatedAccount(event)
  if (created?.email === email) writeCreatedAccount(event, { ...created, verified: true })
}

/** Grava o cookie de sessão. */
export function startSession(event: H3Event, user: SessionUser) {
  setCookie(event, SESSION_COOKIE, user.email, cookieOptions)
}

/** Troca o nome exibido da conta. */
export function setDisplayName(event: H3Event, user: SessionUser, name: string) {
  if (user.email === DEMO_ACCOUNT.email) {
    setCookie(event, NAME_COOKIE, name, cookieOptions)
    return
  }
  const created = readCreatedAccount(event)
  if (created?.email === user.email) writeCreatedAccount(event, { ...created, name })
}

export function endSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}
