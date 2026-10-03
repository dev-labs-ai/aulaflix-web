import type { WaitlistCourseDetail } from "./types";

export const iaParaDesenvolvedores: WaitlistCourseDetail = {
  kind: "waitlist",
  why: [
    "Modelos de linguagem passaram a fazer parte de muitos produtos, e integrá-los virou tarefa comum para quem desenvolve. Fazer uma demonstração funcionar é fácil; difícil é ter respostas confiáveis, custos sob controle e uma forma de saber se o sistema melhorou ou piorou.",
    "Este curso vai tratar a IA como mais uma parte do software: você vai aprender a chamar modelos por API, estruturar prompts e respostas, usar seus próprios documentos como contexto e avaliar os resultados com testes.",
  ],
  learn: [
    "Integrar modelos de linguagem a uma aplicação por meio de APIs.",
    "Escrever prompts claros e receber respostas em formatos estruturados.",
    "Responder perguntas com base em documentos próprios usando busca semântica.",
    "Avaliar a qualidade das respostas e controlar custo e latência.",
  ],
  audience: [
    "Para devs que vão adicionar recursos de IA a um produto.",
    "Para quem quer entender o que acontece por trás das ferramentas de IA.",
    "Para devs backend e full stack que querem trabalhar com aplicações de IA.",
  ],
  coverage: [
    "Como funcionam os modelos de linguagem, sem matemática pesada.",
    "Chamadas de API, streaming, limites de tokens e custos.",
    "Engenharia de prompts e respostas estruturadas.",
    "Embeddings, busca semântica e RAG.",
    "Ferramentas e agentes: quando usar e quando evitar.",
    "Avaliação, monitoramento e segurança em produção.",
  ],
  faq: [
    {
      question: "Preciso saber matemática ou machine learning?",
      answer:
        "Não. O curso é sobre usar modelos prontos em aplicações, e os conceitos necessários são explicados de forma prática.",
    },
  ],
};
