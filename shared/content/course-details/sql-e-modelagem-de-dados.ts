import type { OnSaleCourseDetail } from "./types";

export const sqlEModelagemDeDados: OnSaleCourseDetail = {
  kind: "on-sale",
  pricing: { price: 397, installments: 10, pixDiscount: 0.1 },
  why: [
    "O banco de dados costuma durar mais que qualquer outra parte do sistema. Um modelo mal pensado ou uma consulta lenta passam despercebidos no começo e viram o principal gargalo quando os dados crescem.",
    "Este curso ensina a modelar e consultar bancos relacionais com PostgreSQL. Você desenha um modelo a partir de um problema real, escreve consultas cada vez mais completas e aprende a ler o plano de execução para descobrir por que uma consulta está lenta.",
  ],
  learn: [
    "Transformar requisitos em tabelas, chaves e relacionamentos.",
    "Aplicar a normalização sem exagero e saber quando desnormalizar.",
    "Escrever consultas com filtros, junções, agregações e subconsultas.",
    "Garantir a consistência dos dados com restrições e transações.",
    "Criar índices e ler planos de execução para acelerar consultas.",
  ],
  audience: [
    "Para devs que usam um ORM e querem entender o SQL que roda por trás.",
    "Para devs backend que vão desenhar o banco de um sistema novo.",
    "Para devs frontend e mobile que querem entender a camada de dados.",
    "Para quem está se preparando para entrevistas técnicas com perguntas de SQL.",
  ],
  modules: [
    {
      title: "Modelagem",
      lessons: [
        { title: "Do requisito ao modelo de dados", duration: "11:48", free: true },
        { title: "Chaves e relacionamentos", duration: "13:05" },
        { title: "Normalização na prática", duration: "17:32" },
      ],
    },
    {
      title: "Consultas",
      lessons: [
        { title: "Filtros, ordenação e paginação", duration: "19:14" },
        { title: "Junções entre tabelas", duration: "16:50" },
        { title: "Agregações e agrupamentos", duration: "18:27" },
      ],
    },
    {
      title: "Consistência e desempenho",
      lessons: [
        { title: "Restrições e transações", duration: "23:41" },
        { title: "Índices: quando e como criar", duration: "15:19" },
        { title: "Lendo planos de execução", duration: "21:30" },
      ],
    },
  ],
  faq: [
    {
      question: "Funciona com MySQL e outros bancos?",
      answer:
        "Sim. As aulas usam PostgreSQL, mas a modelagem e o SQL valem para os principais bancos relacionais. Quando há diferenças importantes, elas são apontadas.",
    },
    {
      question: "Preciso instalar alguma coisa?",
      answer: "Só o PostgreSQL, que é gratuito. O curso mostra como rodá-lo na sua máquina em poucos minutos, com ou sem Docker.",
    },
  ],
};
