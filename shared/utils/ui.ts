// Framework-free helpers from the reference app's src/components/ui.tsx.
// The components from that file live in app/components (Board, Badge, ButtonLink, ProgressBar).

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/** Faixa de container usada por todas as seções. */
export const container = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10'

/** Classes de foco; `offset` deve casar com o fundo da seção. */
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4'

export const ringOffset = {
  canvas: 'focus-visible:ring-offset-canvas',
  section: 'focus-visible:ring-offset-section',
  muted: 'focus-visible:ring-offset-surface-muted',
  /** Na lousa o anel fica amarelo, para aparecer sobre o verde. */
  board: 'focus-visible:ring-amarelo-300 focus-visible:ring-offset-lousa-500',
} as const

export type Offset = keyof typeof ringOffset

const buttonVariants = {
  primary: 'bg-surface-accent font-bold text-ink-inverse hover:bg-surface-accent-hover',
  secondary: 'border border-line bg-surface font-bold text-ink hover:border-line-strong hover:bg-section',
  /** Botão principal sobre a lousa: giz amarelo. */
  chalk: 'bg-amarelo-300 font-bold text-ink hover:bg-amarelo-400',
  /** Botão secundário sobre a lousa: só o contorno. */
  'chalk-outline': 'border-2 border-salvia-400 font-bold text-giz hover:border-giz-apagado',
} as const

export type ButtonVariant = keyof typeof buttonVariants

/** Classes de botão, para usar tanto em links (`ButtonLink`) quanto em `<button>`. */
export function buttonClass(variant: ButtonVariant = 'primary', offset: Offset = 'canvas') {
  return cn(
    'inline-flex h-12 items-center justify-center gap-2 rounded-control px-6 font-sans text-[16px] transition-colors',
    buttonVariants[variant],
    focusRing,
    ringOffset[offset],
  )
}
