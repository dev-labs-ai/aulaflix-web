import type { WaitlistCourseDetail } from "./types";

export const devopsNaPratica: WaitlistCourseDetail = {
  kind: "waitlist",
  why: [
    "Escrever o código é só parte do trabalho. Ele ainda precisa ser testado, empacotado, publicado e acompanhado em produção, e é aí que muitos times perdem tempo com passos manuais e deploys arriscados.",
    "Este curso vai mostrar como automatizar esse caminho, do commit até a produção, com Docker, pipelines de CI/CD e o monitoramento necessário para saber quando algo dá errado.",
  ],
  learn: [
    "Empacotar aplicações em contêineres com Docker.",
    "Montar pipelines que testam e publicam o código a cada mudança.",
    "Gerenciar configurações e segredos com segurança entre ambientes.",
    "Acompanhar a aplicação em produção com logs, métricas e alertas.",
  ],
  audience: [
    "Para devs que querem publicar e operar as próprias aplicações.",
    "Para times pequenos que ainda fazem deploy manualmente.",
    "Para quem quer começar a trabalhar com DevOps ou engenharia de plataforma.",
  ],
  coverage: [
    "Docker: imagens, contêineres, volumes e redes.",
    "Ambientes de desenvolvimento com Docker Compose.",
    "Integração contínua: testes e verificações a cada commit.",
    "Entrega contínua: estratégias de deploy e rollback.",
    "Infraestrutura como código: conceitos e primeiros passos.",
    "Observabilidade: logs, métricas, alertas e resposta a incidentes.",
  ],
  faq: [
    {
      question: "Preciso conhecer Linux?",
      answer: "Ajuda, mas não é obrigatório. Os comandos de terminal usados no curso são explicados na primeira vez em que aparecem.",
    },
  ],
};
