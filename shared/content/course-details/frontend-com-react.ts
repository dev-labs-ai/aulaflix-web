import type { OnSaleCourseDetail } from "./types";

export const frontendComReact: OnSaleCourseDetail = {
  kind: "on-sale",
  pricing: { price: 597, installments: 10, pixDiscount: 0.1 },
  why: [
    "Uma interface que funciona bem no primeiro dia pode virar um problema seis meses depois: componentes que ninguém entende, estado espalhado por toda parte e telas que quebram a cada mudança. Muito disso vem de decisões tomadas no começo do projeto.",
    "Este curso ensina React com foco nessas decisões. Você constrói uma aplicação completa, entende onde cada estado deve morar e aprende a dividir a interface em componentes que continuam fáceis de mudar.",
  ],
  learn: [
    "Dividir a interface em componentes pequenos e reutilizáveis.",
    "Gerenciar estado local e compartilhado sem complicar o código.",
    "Buscar dados de APIs tratando carregamento, erros e cache.",
    "Construir formulários acessíveis, com validação.",
    "Organizar rotas e a estrutura de pastas de uma aplicação real.",
  ],
  audience: [
    "Para quem já conhece HTML, CSS e JavaScript e quer dar o próximo passo.",
    "Para devs backend que precisam construir ou manter interfaces.",
    "Para quem já usa React, mas sente que o código fica confuso conforme cresce.",
    "Para devs que vêm de outros frameworks e querem aprender React.",
  ],
  modules: [
    {
      title: "Componentes",
      lessons: [
        { title: "Pensando em componentes", duration: "13:20", free: true },
        { title: "JSX e propriedades", duration: "19:45" },
        { title: "Listas e renderização condicional", duration: "16:10" },
      ],
    },
    {
      title: "Estado e eventos",
      lessons: [
        { title: "Estado com useState", duration: "18:02" },
        { title: "Onde o estado deve morar", duration: "14:36" },
        { title: "Efeitos e quando evitá-los", duration: "22:18" },
      ],
    },
    {
      title: "Dados e formulários",
      lessons: [
        { title: "Buscando dados de uma API", duration: "20:44" },
        { title: "Carregamento, erros e cache", duration: "25:09" },
        { title: "Formulários acessíveis e validação", duration: "15:53" },
      ],
    },
    {
      title: "Aplicação completa",
      lessons: [
        { title: "Rotas e navegação", duration: "17:27" },
        { title: "Organizando pastas e componentes", duration: "26:40" },
        { title: "Testando a interface" },
      ],
    },
  ],
  faq: [
    {
      question: "O que preciso saber antes de começar?",
      answer:
        "HTML, CSS e o básico de JavaScript: funções, arrays e objetos. Os recursos mais novos da linguagem são revisados quando aparecem nas aulas.",
    },
    {
      question: "O curso usa TypeScript?",
      answer:
        "Sim. Os tipos entram aos poucos, sempre que ajudam a evitar erros, e não é preciso conhecer TypeScript antes.",
    },
  ],
};
