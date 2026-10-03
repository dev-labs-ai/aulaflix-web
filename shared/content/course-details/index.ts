// Conteúdo das páginas de curso (/cursos/[slug]).
// Título, resumo e status ficam em src/content/courses.ts.
import { backendComNodeJs } from "./backend-com-node-js";
import { frontendComReact } from "./frontend-com-react";
import { sqlEModelagemDeDados } from "./sql-e-modelagem-de-dados";
import { devopsNaPratica } from "./devops-na-pratica";
import { iaParaDesenvolvedores } from "./ia-para-desenvolvedores";
import { testesAutomatizados } from "./testes-automatizados";
import { arquiteturaDeSoftware } from "./arquitetura-de-software";
import type { CourseDetail, CourseModule, Lesson, OnSaleCourseDetail } from "./types";

export type * from "./types";

export const courseDetails: Record<string, CourseDetail> = {
  "backend-com-node-js": backendComNodeJs,
  "frontend-com-react": frontendComReact,
  "sql-e-modelagem-de-dados": sqlEModelagemDeDados,
  "devops-na-pratica": devopsNaPratica,
  "ia-para-desenvolvedores": iaParaDesenvolvedores,
  "testes-automatizados": testesAutomatizados,
  "arquitetura-de-software": arquiteturaDeSoftware,
};

export function getCourseDetail(slug: string): CourseDetail | undefined {
  return courseDetails[slug];
}

/** Uma aula do curso, com o endereço dela, o número na ementa e o módulo (e o número dele) em que está. */
export type LessonEntry = { lesson: Lesson; slug: string; number: number; module: CourseModule; moduleNumber: number };

/** Endereço da aula em /aprender/[curso]/[aula], tirado do título ("Sua primeira rota" → "sua-primeira-rota"). */
export function lessonSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Todas as aulas do curso em ordem, numeradas em sequência contínua entre os módulos. */
export function courseLessons(detail: OnSaleCourseDetail): LessonEntry[] {
  let number = 0;
  return detail.modules.flatMap((mod, m) =>
    mod.lessons.map((lesson) => ({
      lesson,
      slug: lessonSlug(lesson.title),
      number: ++number,
      module: mod,
      moduleNumber: m + 1,
    })),
  );
}

/** A aula aberta do curso (`free: true`). */
export function getFreeLesson(detail: OnSaleCourseDetail) {
  return courseLessons(detail).find((entry) => entry.lesson.free);
}

