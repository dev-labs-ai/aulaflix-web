// Client side of the reference app's Server Action in src/lib/checkout-actions.ts.

/**
 * Fecha o pedido do curso e segue para a confirmação, ou para o curso se o aluno já o tem. `payment` is what the
 * form sends: the payment method and the installments, never the card details. Devolve a mensagem de erro, ou
 * `null` quando seguiu.
 */
export async function purchaseCourse(course: string, payment: Record<string, string>) {
  const result = await $fetch('/api/checkout', { method: 'POST', body: { ...payment, course } })
  if ('error' in result) return result.error
  if ('signIn' in result) {
    await signInAgain(result.signIn)
    return null
  }
  // Navigating first keeps the form, still processing, on screen until the confirmation's data arrives.
  await navigateTo(result.redirect)
  await refreshNuxtData()
  return null
}
