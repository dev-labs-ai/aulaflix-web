import type { WaitlistCourseDetail } from "./types";

export const testesAutomatizados: WaitlistCourseDetail = {
  kind: "waitlist",
  why: [
    "Sem testes, cada mudança no código vira uma aposta: algo pode quebrar num lugar que ninguém lembrou de conferir. Com testes ruins, o problema só muda de lugar, e a suíte fica lenta, frágil e cheia de alarmes falsos.",
    "Este curso vai mostrar como escrever testes que valem o esforço: o que testar em cada camada, como lidar com banco de dados e serviços externos e como manter a suíte rápida conforme o projeto cresce.",
  ],
  learn: [
    "Escolher o tipo de teste certo para cada parte do sistema.",
    "Escrever testes legíveis, que explicam o comportamento esperado.",
    "Testar código que depende de banco de dados, APIs externas e datas.",
    "Manter a suíte rápida e confiável na integração contínua.",
  ],
  audience: [
    "Para devs que escrevem poucos testes, ou nenhum, e querem começar.",
    "Para times com suítes lentas ou instáveis.",
    "Para quem precisa refatorar código antigo com segurança.",
  ],
  coverage: [
    "Por que testar e o que a pirâmide de testes ensina (e o que ela não ensina).",
    "Testes de unidade: estrutura, nomes e asserções.",
    "Dublês de teste: stubs, mocks e fakes sem exagero.",
    "Testes de integração com banco de dados e APIs.",
    "Testes de ponta a ponta no navegador.",
    "TDD, cobertura e testes na integração contínua.",
  ],
  faq: [
    {
      question: "Os exemplos usam qual linguagem?",
      answer: "Os exemplos usam TypeScript, mas as técnicas valem para qualquer linguagem e framework de testes.",
    },
  ],
};
