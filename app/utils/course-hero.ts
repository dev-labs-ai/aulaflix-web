// Constants and helpers from the reference app's src/components/curso/course-hero.tsx; its components
// live in app/components/curso.
import type { CoursePricing } from '#shared/content/course-details'

/** Id dos botões de compra da lousa: a barra de compra do celular aparece quando eles saem da tela. */
export const boardBuyId = 'comprar'

/** O que vem com a compra, na lousa e no resumo do pedido. */
export const perks = ['Acesso vitalício', 'Materiais de apoio', 'Garantia de 7 dias']

/** Parcelado e Pix, como aparecem embaixo do preço. */
export function priceTerms(pricing: CoursePricing) {
  return {
    installments: `${pricing.installments}x de ${brl(pricing.price / pricing.installments)} sem juros`,
    pix: brl(pricing.price * (1 - pricing.pixDiscount)),
    pixDiscount: `${Math.round(pricing.pixDiscount * 100)}% de desconto`,
  }
}
