// Conteúdo global do site.

export const site = {
  name: "Aulaflix",
  /** Nome como aparece no logotipo, em minúsculas. */
  wordmark: "aulaflix",
  title: "Aulaflix — Cursos online para desenvolvedores de software",
  description:
    "Cursos online de backend, frontend, banco de dados, DevOps e IA para desenvolvedores de software. Aprenda no seu ritmo, com acesso vitalício.",
  legalName: "AULAFLIX TECNOLOGIA LTDA",
};

type NavItem = { label: string; href: string; /** Selo ao lado do link, ex.: "Novo". */ badge?: string };

export const mainNav: NavItem[] = [
  { label: "Cursos", href: "/cursos" },
  { label: "Como funciona", href: "/como-funciona" },
];
