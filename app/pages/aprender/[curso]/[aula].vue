<!-- Página de aula: o vídeo, o botão de concluir, a navegação entre aulas e a lista do curso. -->
<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { courseLessons, getCourseDetail } from '#shared/content/course-details'
import { getCourse } from '#shared/content/courses'

definePageMeta({
  // Só os cursos conhecidos existem; qualquer outro slug vira 404, antes mesmo de pedir para entrar.
  validate: route => Boolean(getCourse(String(route.params.curso))),
  middleware: 'auth',
})

const route = useRoute()
const courseSlug = String(route.params.curso)
const lessonSlug = String(route.params.aula)
const course = getCourse(courseSlug)!
const detail = getCourseDetail(courseSlug)

/** Aulas do curso em ordem. */
const lessons = detail?.kind === 'on-sale' ? courseLessons(detail) : []
const entry = lessons.find(e => e.slug === lessonSlug)
const published = lessons.filter(e => e.lesson.duration)
const position = entry ? published.indexOf(entry) : -1
const previous = entry && published[position - 1]
const next = entry && published[position + 1]

const { data: enrollment } = await useFetch(`/api/courses/${courseSlug}/enrollment`, { key: `enrollment-${courseSlug}` })
const completedSlugs = computed(() => new Set(enrollment.value?.owned ? enrollment.value.completedSlugs : []))
const done = computed(() => completedSlugs.value.has(lessonSlug))

// Quem não tem o curso vai para a página de venda, onde pode ver a aula grátis. The template waits for the
// redirect, since `entry` may not exist then.
if (!enrollment.value?.owned) await navigateTo(`/cursos/${courseSlug}`, { redirectCode: 307, replace: true })
// Aulas sem duração ainda não foram publicadas. The port shows the regular 404 page here, where the reference
// app doubles the header and footer (#21).
else if (!entry?.lesson.duration) throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })

useSeoMeta({ title: entry && `${entry.lesson.title} · ${course.title}` })
</script>

<template>
  <div
    v-if="entry && enrollment?.owned"
    :class="cn(container, 'pb-24 pt-6 sm:pb-32 sm:pt-8')"
  >
    <RecordVisit
      :course="courseSlug"
      :lesson="entry.slug"
    />
    <nav
      aria-label="Você está em"
      class="text-[15px] text-ink-tertiary"
    >
      <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <li>
          <NuxtLink
            to="/meus-cursos"
            :class="cn('font-bold text-ink-secondary hover:text-ink', focusRing, ringOffset.canvas, 'rounded-control')"
          >
            Meus cursos
          </NuxtLink>
        </li>
        <li aria-hidden="true">
          <ChevronRight class="size-4 text-ink-muted" />
        </li>
        <li>{{ course.title }}</li>
      </ol>
    </nav>

    <div class="mt-5 lg:grid lg:grid-cols-12 lg:gap-x-10">
      <div class="lg:col-span-8">
        <LessonPlayer
          :key="entry.slug"
          :title="entry.lesson.title"
          :duration="entry.lesson.duration!"
        />

        <p class="mt-7 text-[15px] font-bold tabular-nums text-ink-muted">
          Aula {{ entry.number }} de {{ lessons.length }} · Módulo {{ entry.moduleNumber }}: {{ entry.module.title }}
        </p>
        <h1 class="mt-2 font-heading text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[38px]">
          {{ entry.lesson.title }}
        </h1>

        <div class="mt-7">
          <CompleteLesson
            :course="courseSlug"
            :lesson="entry.slug"
            :done="done"
          />
        </div>

        <div class="mt-10 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          <LessonStep
            v-if="previous"
            :entry="previous"
            :course="courseSlug"
            direction="previous"
          />
          <span
            v-else
            class="hidden sm:block"
          />
          <LessonStep
            v-if="next"
            :entry="next"
            :course="courseSlug"
            direction="next"
          />
          <p
            v-else
            class="text-[15px] leading-[1.6] text-ink-tertiary sm:text-right"
          >
            Esta é a última aula publicada.
            <NuxtLink
              to="/meus-cursos"
              :class="cn(
                'rounded-control font-bold text-ink-accent underline decoration-2 underline-offset-4 transition-colors hover:text-ink-accent-hover',
                focusRing,
                ringOffset.canvas,
              )"
            >
              Voltar para Meus cursos
            </NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-12 lg:col-span-4 lg:mt-0">
        <LessonList
          :course="course"
          :lessons="lessons"
          :completed-slugs="completedSlugs"
          :current="entry.slug"
        />
      </div>
    </div>
  </div>
</template>
