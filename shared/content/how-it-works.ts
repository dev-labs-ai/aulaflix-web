// Conteúdo de "Como funciona": os passos (resumidos na home e detalhados em /como-funciona),
// a lista de espera e as dúvidas que valem para todos os cursos.

import type { FaqEntry } from "./course-details";

export const howItWorksCopy = {
  title: "Como funciona",
  description: "Como escolher, comprar e estudar nos cursos do Aulaflix, e as dúvidas que valem para todos eles.",
  intro:
    "Cursos avulsos, comprados uma vez e assistidos no seu ritmo. Veja o caminho da escolha do curso até as aulas, e as dúvidas que valem para todos os cursos.",
};

/** Os passos, da escolha do curso ao estudo. `summary` aparece na home; `details`, em /como-funciona. */
export const howItWorksSteps = [
  {
    title: "Escolha o que aprender",
    summary: "Cada curso é independente. Escolha pela área, leia a ementa e assista à aula grátis antes de decidir.",
    details:
      "Cada curso é independente: não há pacote nem trilha obrigatória. No catálogo, você filtra por área e vê o que já está à venda e o que está chegando. Nos cursos à venda, a página mostra a ementa completa, com a duração de cada aula, e uma aula grátis para assistir ali mesmo, sem precisar de conta.",
  },
  {
    title: "Compre uma vez",
    summary: "Sem assinatura: você paga o curso uma vez, no Pix ou em até 10x no cartão, e ele fica seu para sempre.",
    details:
      "Não há assinatura: você paga o curso uma vez, no Pix com desconto ou no cartão em até 10x sem juros, e o acesso é vitalício. Se ainda não tem conta, ela é criada na própria compra. Com o pagamento aprovado, a primeira aula já fica liberada, e você tem 7 dias de garantia para pedir o reembolso se o curso não for para você.",
  },
  {
    title: "Estude no seu ritmo",
    summary: "Assista quando quiser, marque as aulas concluídas e volte de onde parou, no computador ou no celular.",
    details:
      "Assista quando quiser e quantas vezes quiser, no computador ou no celular. Marque as aulas concluídas para acompanhar o andamento, e em Meus cursos o destaque “Continuar de onde parou” leva direto à última aula que você abriu.",
  },
];

/** Os cursos em lista de espera e o "Avise-me". */
export const waitlistInfo = {
  title: "E os cursos em breve?",
  body: "Os cursos marcados como “Em breve” ainda estão em produção. Na página de cada um, você vê o conteúdo previsto e entra na lista de espera: com a conta, basta um clique em “Avise-me”; sem ela, só o e-mail. Quando as inscrições abrirem, você recebe um aviso.",
  link: "Ver os cursos em breve",
};

/** Dúvidas sobre a plataforma. As de cada curso ficam no `faq` dele, em course-details. */
export const platformFaq: FaqEntry[] = [
  {
    question: "Por quanto tempo tenho acesso ao curso?",
    answer: "O acesso é vitalício. Depois da compra, você pode assistir às aulas quantas vezes quiser, no seu ritmo.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Pix, com desconto, ou cartão de crédito em até 10x sem juros. O valor em cada forma aparece na página do curso.",
  },
  {
    question: "E se o curso não for para mim?",
    answer: "Você tem 7 dias de garantia. Se não gostar, é só pedir o reembolso dentro desse prazo.",
  },
  {
    question: "Preciso criar uma conta para comprar?",
    answer:
      "Sim, mas ela é criada durante a própria compra: você informa o e-mail e, se ainda não tiver conta, nome e senha.",
  },
  {
    question: "Quando os cursos em breve serão lançados?",
    answer:
      "Ainda não há data definida. Quem entra na lista de espera recebe um aviso por e-mail assim que as inscrições abrirem.",
  },
  {
    question: "Entrar na lista de espera tem algum custo?",
    answer: "Não. A lista de espera é gratuita e não obriga você a comprar o curso quando ele for lançado.",
  },
];
