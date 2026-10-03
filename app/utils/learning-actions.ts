// Client side of the reference app's Server Actions in src/lib/learning-actions.ts: each one calls its API route.

/** Botão da página de aula: marca ou desmarca a aula como concluída, e a página volta atualizada (ADR 0002). */
export async function setLessonCompletion(course: string, lesson: string, done: boolean) {
  const result = await $fetch('/api/learning/completion', { method: 'POST', body: { course, lesson, done } })
  if (result) return signInAgain(result.redirect)
  await refreshNuxtData()
}

/**
 * Página de aula: registra a aula aberta, para Meus cursos saber de onde continuar. Nothing on the lesson page
 * shows the visits, so the page data isn't refreshed; Meus cursos fetches its own when it opens.
 */
export async function recordVisit(course: string, lesson: string) {
  const result = await $fetch('/api/learning/visit', { method: 'POST', body: { course, lesson } })
  if (result) return signInAgain(result.redirect)
}
