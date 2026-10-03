import type { OnSaleCourseDetail } from "./types";

export const backendComNodeJs: OnSaleCourseDetail = {
  kind: "on-sale",
  pricing: { price: 497, installments: 10, pixDiscount: 0.1 },
  why: [
    "Quase todo produto de software depende de um backend: é ele que guarda os dados, aplica as regras de negócio e responde às telas e a outros sistemas. Mesmo assim, muita gente aprende a criar rotas sem entender o que torna uma API confiável em produção.",
    "Este curso constrói uma API do zero com Node.js e TypeScript. Cada módulo acrescenta uma camada de que um serviço real precisa (validação, banco de dados, autenticação e testes) e o curso termina com a API publicada.",
  ],
  learn: [
    "Projetar rotas e respostas de uma API REST seguindo as convenções do HTTP.",
    "Validar entradas e tratar erros com respostas claras e consistentes.",
    "Conectar a API a um banco PostgreSQL e organizar o acesso aos dados.",
    "Proteger rotas com autenticação por token e controle de permissões.",
    "Escrever testes automatizados e publicar o serviço em produção.",
  ],
  audience: [
    "Para devs frontend que querem entender e construir o outro lado da aplicação.",
    "Para quem já programa em JavaScript e quer dar o primeiro passo no backend.",
    "Para devs backend de outras linguagens que vão trabalhar com Node.js.",
    "Para quem já cria APIs, mas quer uma base mais sólida em validação, segurança e testes.",
  ],
  modules: [
    {
      title: "Fundamentos de APIs",
      lessons: [
        { title: "Como funciona uma requisição HTTP", duration: "12:40", free: true },
        { title: "Preparando o projeto com Node.js e TypeScript", duration: "09:15" },
        { title: "Sua primeira rota", duration: "14:02" },
      ],
    },
    {
      title: "Construindo a API",
      lessons: [
        { title: "Rotas, parâmetros e status HTTP", duration: "18:31" },
        { title: "Validação dos dados de entrada", duration: "15:47" },
        { title: "Tratamento de erros", duration: "21:10" },
      ],
    },
    {
      title: "Dados e autenticação",
      lessons: [
        { title: "Conectando ao PostgreSQL", duration: "19:22" },
        { title: "Organizando o acesso aos dados", duration: "24:05" },
        { title: "Autenticação com tokens", duration: "16:38" },
      ],
    },
    {
      title: "Qualidade e produção",
      lessons: [
        { title: "Testando as rotas da API", duration: "22:14" },
        { title: "Configuração e variáveis de ambiente", duration: "20:51" },
        { title: "Projeto final: publicando a API" },
      ],
    },
  ],
  faq: [
    {
      question: "Preciso saber JavaScript antes?",
      answer:
        "Sim, o básico: variáveis, funções, objetos e arrays. O TypeScript é apresentado ao longo do curso, conforme o código passa a precisar dele.",
    },
  ],
};
