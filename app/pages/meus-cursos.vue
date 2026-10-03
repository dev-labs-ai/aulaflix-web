<!--
  Meus cursos: no topo, a aula onde o aluno parou, escrita na lousa; embaixo, os cursos dele com o
  andamento de cada um. Só para quem está logado.
-->
<script setup lang="ts">
import { Play } from '@lucide/vue'
import { myCoursesCopy as copy } from '#shared/content/account'
import { onSaleCourses, waitlistCourses } from '#shared/content/courses'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: copy.title, description: copy.description })

const { data } = await useFetch('/api/enrollments', { key: 'enrollments' })
const enrollments = computed(() => data.value?.enrollments ?? [])
const lastCourse = computed(() => data.value?.lastCourse ?? null)

type EnrollmentSummary = (typeof enrollments.value)[number]

/** Texto de progresso e rótulo do botão conforme o andamento do aluno no curso. */
function describe({ completed, published, total }: EnrollmentSummary) {
  if (completed === 0) return { meta: copy.notStarted(total), cta: copy.start }
  const percent = Math.round((completed / total) * 100)
  if (completed >= total) return { meta: copy.progress(completed, total, percent, copy.completed), cta: copy.openCourse }
  // Viu todas as aulas publicadas, mas o curso ainda vai ganhar aulas novas.
  if (completed >= published) return { meta: copy.progress(completed, total, percent, copy.caughtUp), cta: copy.openCourse }
  return { meta: copy.progress(completed, total, percent), cta: copy.continue }
}

const cards = computed(() =>
  enrollments.value.map(enrollment => ({
    ...enrollment,
    ...describe(enrollment),
    percent: Math.round((enrollment.completed / enrollment.total) * 100),
  })),
)

const more = computed(() => {
  const owned = new Set(enrollments.value.map(e => e.course.slug))
  const notOwnedOnSale = onSaleCourses.filter(c => !owned.has(c.slug)).length
  return [
    notOwnedOnSale > 0 && copy.onSale(notOwnedOnSale),
    waitlistCourses.length > 0 && copy.waitlist(waitlistCourses.length),
  ].filter(Boolean)
})

const lessonHref = (courseSlug: string, lessonSlug: string) => `/aprender/${courseSlug}/${lessonSlug}`
</script>

<template>
  <AccountPage
    id="meus-cursos-title"
    :title="copy.title"
  >
    <template v-if="enrollments.length > 0">
      <!-- A aula onde o aluno parou, escrita na lousa, com o botão para voltar a ela. -->
      <section
        v-if="lastCourse"
        aria-labelledby="continuar-title"
        class="mt-8"
      >
        <Board class="flex flex-col gap-6 px-6 py-7 sm:px-9 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div class="min-w-0">
            <h2
              id="continuar-title"
              class="text-[15px] font-bold text-giz-apagado"
            >
              {{ copy.resume.title }}
            </h2>
            <p class="mt-3 text-balance font-heading text-[26px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[32px]">
              {{ lastCourse.resume.title }}
            </p>
            <p class="mt-2 text-[16px] tabular-nums text-giz-apagado">
              {{ lastCourse.course.title }} · {{ copy.resume.position(lastCourse.resume.number, lastCourse.total) }}
            </p>
          </div>
          <ButtonLink
            :href="lessonHref(lastCourse.course.slug, lastCourse.resume.slug)"
            variant="chalk"
            offset="board"
            class="shrink-0 self-start lg:self-center"
          >
            <Play
              aria-hidden="true"
              fill="currentColor"
              :stroke-width="0"
              class="size-4"
            />
            {{ copy.resume.cta }}
          </ButtonLink>
        </Board>
      </section>

      <ul class="mt-8 flex flex-col gap-4">
        <li
          v-for="{ course, completed, meta, cta, percent, resume } in cards"
          :key="course.slug"
          class="flex flex-col gap-5 rounded-card border border-line bg-surface p-5 shadow-(--shadow-raised) sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
          <CourseCover
            :course="course"
            class="shrink-0 rounded-card sm:w-[220px]"
          />
          <div class="min-w-0 flex-1">
            <h2 class="font-heading text-[22px] font-bold leading-[1.25] tracking-[-0.015em] text-ink">
              {{ course.title }}
            </h2>
            <p class="mt-1.5 text-[15px] tabular-nums text-ink-muted">
              {{ meta }}
            </p>
            <ProgressBar
              v-if="completed > 0"
              :value="percent"
              :label="copy.progressLabel(course.title)"
              class="mt-3 max-w-[240px]"
            />
          </div>
          <NuxtLink
            :to="lessonHref(course.slug, resume.slug)"
            :class="cn(
              'inline-flex h-12 shrink-0 items-center justify-center self-start rounded-control border border-line bg-surface px-5 text-[16px] font-bold text-ink transition-colors hover:border-line-strong hover:bg-section sm:self-center',
              focusRing,
              ringOffset.canvas,
            )"
          >
            {{ cta }}
          </NuxtLink>
        </li>
      </ul>

      <p
        v-if="more.length > 0"
        class="mt-8 text-[16px] leading-[1.6] text-ink-muted"
      >
        {{ more.join(' ') }}
        <NuxtLink
          to="/cursos"
          :class="cn(
            'rounded-control font-bold text-ink-accent underline decoration-2 underline-offset-4 transition-colors hover:text-ink-accent-hover',
            focusRing,
            ringOffset.canvas,
          )"
        >{{ copy.catalog }}</NuxtLink>
      </p>
    </template>
    <AccountEmptyState
      v-else
      v-bind="copy.empty"
    />
  </AccountPage>
</template>
