import type { WaitlistCourseDetail } from "./types";

export const arquiteturaDeSoftware: WaitlistCourseDetail = {
  kind: "waitlist",
  why: [
    "Todo sistema começa simples. Com o tempo, novas funcionalidades e novas pessoas no time fazem o código crescer e, sem uma estrutura clara, cada mudança passa a exigir mexer em vários lugares ao mesmo tempo.",
    "Este curso vai mostrar como organizar sistemas para que continuem fáceis de mudar: como dividir responsabilidades, onde traçar limites entre as partes do sistema e como tomar decisões de arquitetura pesando o custo de cada escolha.",
  ],
  learn: [
    "Dividir um sistema em módulos com responsabilidades claras.",
    "Reconhecer o acoplamento excessivo e reduzi-lo aos poucos.",
    "Comparar monólitos, monólitos modulares e microsserviços.",
    "Registrar e comunicar decisões de arquitetura para o time.",
  ],
  audience: [
    "Para devs que querem dar o passo de pleno para sênior.",
    "Para quem mantém sistemas que ficaram difíceis de mudar.",
    "Para tech leads que precisam orientar as decisões técnicas do time.",
  ],
  coverage: [
    "O que é arquitetura e quais decisões ela envolve.",
    "Coesão, acoplamento e princípios de design de código.",
    "Arquitetura em camadas, hexagonal e limpa.",
    "Domínios, contextos delimitados e modularização.",
    "Monólitos, microsserviços e comunicação entre serviços.",
    "Registros de decisão (ADRs) e a evolução do sistema.",
  ],
  faq: [
    {
      question: "O curso é só teoria?",
      answer:
        "Não. Cada conceito é aplicado na reestruturação de um sistema de exemplo, com o código disponível para você acompanhar.",
    },
  ],
};
