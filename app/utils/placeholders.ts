// Placeholder visual para as capas de curso (CourseCoverPlaceholder). Troque por <img> quando houver
// capas próprias em /public.
import { AppWindow, Blocks, Bot, Container, Database, FlaskConical, Server, type LucideIcon } from '@lucide/vue'
import type { CourseArea, CourseIcon, CourseTone } from '#shared/content/courses'

/** Componente Vue de cada nome de ícone usado no catálogo. */
export const courseIcons: Record<CourseIcon, LucideIcon> = {
  'server': Server,
  'app-window': AppWindow,
  'database': Database,
  'container': Container,
  'bot': Bot,
  'flask-conical': FlaskConical,
  'blocks': Blocks,
}

/** Ícone de cada área, nos botões de área da home. */
export const areaIcons: Record<CourseArea, LucideIcon> = {
  'backend': Server,
  'frontend': AppWindow,
  'banco-de-dados': Database,
  'devops': Container,
  'ia': Bot,
  'qualidade': FlaskConical,
  'arquitetura': Blocks,
}

/**
 * Classes de cada cor de curso: faixa da ficha (cheia ou, com `tracejado`, em traços),
 * fundo claro e ícone sobre esse fundo.
 */
export const toneClasses: Record<CourseTone, { stripe: string, dash: string, soft: string, ink: string }> = {
  coral: { stripe: 'bg-coral-400', dash: 'text-coral-400', soft: 'bg-coral-100', ink: 'text-coral-700' },
  amarelo: { stripe: 'bg-amarelo-300', dash: 'text-amarelo-300', soft: 'bg-amarelo-100', ink: 'text-amarelo-700' },
  salvia: { stripe: 'bg-salvia-400', dash: 'text-salvia-400', soft: 'bg-salvia-100', ink: 'text-salvia-700' },
}
