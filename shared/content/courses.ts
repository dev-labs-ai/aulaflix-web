// Catálogo de exemplo: cursos para desenvolvedores de software.
// Sem dependência de framework: só dados e tipos, reaproveitáveis em outro front-end.

export type CourseStatus = "on-sale" | "waitlist";

/** Nome do ícone na biblioteca Lucide (https://lucide.dev/icons). */
export type CourseIcon = "server" | "app-window" | "database" | "container" | "bot" | "flask-conical" | "blocks";

/** Cor da faixa da ficha e da capa do curso (ver tokens em globals.css). */
export type CourseTone = "coral" | "amarelo" | "salvia";

/** Área do curso. A chave é o valor de `?area=` no catálogo (/cursos?area=backend). */
export type CourseArea = "backend" | "frontend" | "banco-de-dados" | "devops" | "ia" | "qualidade" | "arquitetura";

/** Nome de cada área, na ordem em que aparecem nos filtros do catálogo. */
export const areaLabel: Record<CourseArea, string> = {
  backend: "Backend",
  frontend: "Frontend",
  "banco-de-dados": "Banco de dados",
  devops: "DevOps",
  ia: "IA",
  qualidade: "Qualidade",
  arquitetura: "Arquitetura",
};

export const areas = Object.keys(areaLabel) as CourseArea[];

export type Course = {
  slug: string;
  title: string;
  /** Área do curso, mostrada na ficha ao lado do ícone e usada no filtro do catálogo. */
  area: CourseArea;
  summary: string;
  status: CourseStatus;
  /** Ícone usado no placeholder da capa enquanto não há imagem própria. */
  icon: CourseIcon;
  tone: CourseTone;
  /** Caminho em /public para a capa definitiva (opcional). */
  image?: string;
};

export const courses: Course[] = [
  {
    slug: "backend-com-node-js",
    title: "Backend com Node.js",
    area: "backend",
    summary:
      "Construa APIs REST com Node.js e TypeScript: rotas, validação, banco de dados, autenticação e testes, até colocar o serviço no ar.",
    status: "on-sale",
    icon: "server",
    tone: "coral",
  },
  {
    slug: "frontend-com-react",
    title: "Frontend com React",
    area: "frontend",
    summary:
      "Crie interfaces com React e TypeScript: componentes, estado, consumo de APIs, formulários e rotas, com um código que continua fácil de mudar.",
    status: "on-sale",
    icon: "app-window",
    tone: "amarelo",
  },
  {
    slug: "sql-e-modelagem-de-dados",
    title: "SQL e Modelagem de Dados",
    area: "banco-de-dados",
    summary:
      "Modele bancos relacionais, escreva consultas SQL do filtro simples às junções e agregações e use índices para manter tudo rápido no PostgreSQL.",
    status: "on-sale",
    icon: "database",
    tone: "salvia",
  },
  {
    slug: "devops-na-pratica",
    title: "DevOps na Prática",
    area: "devops",
    summary:
      "Empacote aplicações com Docker, automatize testes e deploys com pipelines de CI/CD e acompanhe o que acontece em produção com logs e métricas.",
    status: "waitlist",
    icon: "container",
    tone: "salvia",
  },
  {
    slug: "ia-para-desenvolvedores",
    title: "IA para Desenvolvedores",
    area: "ia",
    summary:
      "Integre modelos de linguagem às suas aplicações: chamadas de API, prompts, respostas estruturadas, busca em documentos próprios e avaliação dos resultados.",
    status: "waitlist",
    icon: "bot",
    tone: "coral",
  },
  {
    slug: "testes-automatizados",
    title: "Testes Automatizados",
    area: "qualidade",
    summary:
      "Escreva testes de unidade, integração e ponta a ponta que dão confiança para mudar o código, sem deixar a suíte lenta ou frágil.",
    status: "waitlist",
    icon: "flask-conical",
    tone: "amarelo",
  },
  {
    slug: "arquitetura-de-software",
    title: "Arquitetura de Software",
    area: "arquitetura",
    summary:
      "Organize sistemas que crescem sem virar um emaranhado: camadas, módulos, limites entre domínios e como tomar e registrar decisões de arquitetura.",
    status: "waitlist",
    icon: "blocks",
    tone: "salvia",
  },
];

export const onSaleCourses = courses.filter((c) => c.status === "on-sale");
export const waitlistCourses = courses.filter((c) => c.status === "waitlist");

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
