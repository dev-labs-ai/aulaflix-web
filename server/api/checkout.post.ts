import { getCourseDetail } from '#shared/content/course-details'

// Former Server Action `purchaseCourse`: fecha o pedido do curso e leva à confirmação. Protótipo: nenhum pagamento é
// cobrado e os dados do cartão nem chegam ao servidor; só a forma de pagamento e as parcelas.
// Instead of redirecting, it answers where to go (app/utils/checkout-actions.ts): to sign in when the session ended,
// to the course when the student already owns it, or to the confirmation.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const course = bodyText(body, 'course')
  const path = `/cursos/${course}/comprar`
  const user = getSessionUser(event)
  if (!user) return { signIn: signInPath(path) }
  const detail = getCourseDetail(course)
  if (detail?.kind !== 'on-sale') return { error: 'Este curso não está à venda.' }
  if (getOwnedCourseSlugs(event, user).has(course)) return { redirect: `/aprender/${course}` }

  const method = bodyText(body, 'method')
  if (method !== 'pix' && method !== 'card') return { error: 'Escolha Pix ou cartão.' }
  const { price, installments: maxInstallments, pixDiscount } = detail.pricing
  const installments = method === 'card' ? Number(bodyText(body, 'installments')) : undefined
  if (installments !== undefined && !(Number.isInteger(installments) && installments >= 1 && installments <= maxInstallments)) {
    return { error: 'Escolha o número de parcelas.' }
  }

  const id = recordPurchase(event, user, {
    course,
    method,
    amount: method === 'pix' ? price * (1 - pixDiscount) : price,
    installments,
  })
  return { redirect: `${path}?pedido=${id}` }
})
