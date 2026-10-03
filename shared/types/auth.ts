/** Usuário da sessão, como o servidor o devolve às páginas. */
export type SessionUser = {
  name: string
  email: string
  /** E-mail confirmado pelo link enviado no cadastro. A conta funciona antes disso. */
  verified: boolean
}
