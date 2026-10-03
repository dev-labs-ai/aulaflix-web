/** Só o que Meus cursos mostra de cada curso do aluno, sem as aulas. */
const summary = ({ course, completed, published, total, resume }: Enrollment) => ({
  course,
  completed,
  published,
  total,
  resume: { slug: resume.slug, number: resume.number, title: resume.lesson.title },
})

// The student's courses with their progress, and the one to resume, for /meus-cursos.
export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const lastCourse = getLastCourse(event, user)
  return { enrollments: getEnrollments(event, user).map(summary), lastCourse: lastCourse && summary(lastCourse) }
})
