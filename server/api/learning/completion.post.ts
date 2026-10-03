// Former Server Action `setLessonCompletion`: o botão da página de aula marca ou desmarca a aula como concluída.
// Signed out, it answers where to sign in instead of redirecting (app/utils/learning-actions.ts).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { course, lesson, done } = isRecord(body) ? body : {}
  if (typeof course !== 'string' || typeof lesson !== 'string' || typeof done !== 'boolean') return null
  const user = getSessionUser(event)
  if (!user) return { redirect: signInPath(`/aprender/${course}/${lesson}`) }
  setLessonCompleted(event, user, course, lesson, done)
  return null
})
