// Former Server Action `recordVisit`: a página de aula registra a aula aberta, para Meus cursos saber de onde
// continuar. Signed out, it answers where to sign in instead of redirecting (app/utils/learning-actions.ts).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { course, lesson } = isRecord(body) ? body : {}
  if (typeof course !== 'string' || typeof lesson !== 'string') return null
  const user = getSessionUser(event)
  if (!user) return { redirect: signInPath(`/aprender/${course}/${lesson}`) }
  recordLessonVisit(event, user, course, lesson)
  return null
})
