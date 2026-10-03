// Textos da área do aluno: menu do usuário, Meus cursos e Conta (dados da conta e compras).

/** Nome do ícone na biblioteca Lucide (https://lucide.dev/icons). */
export type AccountIcon = "book-open" | "circle-user";

export type AccountLink = { label: string; href: string; icon: AccountIcon };

export const accountMenu = {
  open: "Abrir menu do usuário",
  label: "Menu do usuário",
  /** Áreas da conta; no celular aparecem junto com os links do menu principal. */
  links: [
    { label: "Meus cursos", href: "/meus-cursos", icon: "book-open" },
    { label: "Conta", href: "/conta", icon: "circle-user" },
  ] satisfies AccountLink[],
  signOut: "Sair",
};

/** Página /conta: o título e as abas. */
export const accountCopy = {
  title: "Conta",
  tabsLabel: "Seções da conta",
  tabs: [
    { label: "Dados da conta", href: "/conta" },
    { label: "Compras", href: "/conta/compras" },
  ],
};

/** Iniciais para o avatar: primeira e última palavra do nome ("Aluno Aulaflix" → "AA"). */
export function initials(name: string | null, email: string) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  return (words[0]?.[0] ?? email[0] ?? "?").toUpperCase();
}

export const myCoursesCopy = {
  title: "Meus cursos",
  description: "Os cursos que você comprou e o andamento de cada um.",
  /** Destaque no topo da página, com a aula onde o aluno parou. */
  resume: {
    title: "Continuar de onde parou",
    position: (number: number, total: number) => `Aula ${number} de ${total}`,
    cta: "Continuar aula",
  },
  start: "Começar",
  continue: "Continuar",
  openCourse: "Rever aulas",
  notStarted: (lessons: number) => `${lessons} ${lessons === 1 ? "aula" : "aulas"}, ainda não começou`,
  progress: (done: number, total: number, percent: number, status?: string) =>
    `${done} de ${total} aulas (${percent}%)${status ? `, ${status}` : ""}`,
  completed: "finalizado",
  caughtUp: "aguardando novas aulas",
  progressLabel: (title: string) => `Andamento em ${title}`,
  onSale: (count: number) =>
    count === 1 ? "Mais 1 curso disponível." : `Mais ${count} cursos disponíveis.`,
  waitlist: (count: number) =>
    count === 1 ? "Mais 1 curso chegando em breve." : `Mais ${count} cursos chegando em breve.`,
  catalog: "Conhecer o catálogo",
  empty: {
    title: "Nenhum curso por aqui ainda",
    body: "Quando você comprar um curso, ele aparece nesta página.",
    cta: "Ver todos os cursos",
  },
};

export const purchasesCopy = {
  title: "Compras",
  description: "Seus pedidos no Aulaflix: pagamentos, valores e cursos incluídos.",
  status: { paid: "Pago" },
  paymentMethod: { pix: "Pix", card: "Cartão" },
  order: (id: string) => `Pedido nº ${id}`,
  includes: "Cursos do pedido",
  empty: {
    title: "Nenhuma compra ainda",
    body: "Seus pedidos aparecem aqui depois da primeira compra.",
    cta: "Ver todos os cursos",
  },
};

export const settingsCopy = {
  title: "Dados da conta",
  description: "Seu nome, e-mail e senha no Aulaflix.",
  name: "Nome",
  email: "E-mail",
  password: "Senha",
  edit: "Editar",
  save: "Salvar",
  cancel: "Cancelar",
  changePassword: "Trocar senha",
  codeSent: (email: string) => ["Digite o código que mandamos para ", email, " e escolha a nova senha."] as const,
  savePassword: "Salvar nova senha",
  passwordSavedNotice: "Protótipo: a senha não foi trocada de verdade. Continue entrando com a senha atual.",
  nameTooLong: "Use no máximo 80 caracteres.",
};
