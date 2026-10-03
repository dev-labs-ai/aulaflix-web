<!-- Lista de aulas da página de aula: o andamento do curso e as aulas por módulo, com a atual marcada. -->
<script setup lang="ts">
import { NuxtLink } from '#components'
import { myCoursesCopy as copy } from '#shared/content/account'
import type { CourseModule, LessonEntry } from '#shared/content/course-details'
import type { Course } from '#shared/content/courses'

const props = defineProps<{
  course: Course
  /** Aulas do curso em ordem. */
  lessons: LessonEntry[]
  /** Slugs das aulas concluídas. */
  completedSlugs: Set<string>
  current: string
}>()

const completed = computed(() => props.completedSlugs.size)
const total = computed(() => props.lessons.length)
const percent = computed(() => Math.round((completed.value / total.value) * 100))

/** Como a aula aparece na lista: publicada ou não, a atual, concluída. */
function row(entry: LessonEntry) {
  const published = Boolean(entry.lesson.duration)
  const isCurrent = entry.slug === props.current
  const done = props.completedSlugs.has(entry.slug)
  const state = !published ? 'locked' : isCurrent ? 'current' : done ? 'done' : 'todo'
  return { entry, published, isCurrent, done, state } as const
}

// Aulas agrupadas por módulo, na ordem do curso.
const modules = computed(() => {
  const groups: { module: CourseModule, number: number, rows: ReturnType<typeof row>[] }[] = []
  for (const entry of props.lessons) {
    const last = groups.at(-1)
    if (last?.module === entry.module) last.rows.push(row(entry))
    else groups.push({ module: entry.module, number: entry.moduleNumber, rows: [row(entry)] })
  }
  return groups
})

const rowClass = 'flex items-center gap-3 px-5 py-2.5'
</script>

<template>
  <nav
    aria-label="Aulas do curso"
    class="overflow-hidden rounded-card border border-line bg-surface shadow-(--shadow-raised) lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-10rem)] lg:flex-col"
  >
    <div class="border-b border-line px-5 py-5">
      <p class="font-heading text-[19px] font-bold leading-[1.25] tracking-[-0.01em] text-ink">
        {{ course.title }}
      </p>
      <p class="mt-1 text-[14px] tabular-nums text-ink-muted">
        {{ completed }} de {{ total }} aulas concluídas
      </p>
      <ProgressBar
        :value="percent"
        :label="copy.progressLabel(course.title)"
        class="mt-3"
      />
    </div>
    <ScrollToCurrent
      :current="current"
      class="pb-3 lg:overflow-y-auto"
    >
      <section
        v-for="{ module: mod, number, rows } in modules"
        :key="mod.title"
        :aria-labelledby="`modulo-${number}`"
      >
        <h2
          :id="`modulo-${number}`"
          class="px-5 pb-1 pt-5 text-[14px] font-bold text-ink-muted"
        >
          Módulo {{ number }}: {{ mod.title }}
        </h2>
        <ol>
          <li
            v-for="{ entry, published, isCurrent, done, state } in rows"
            :key="entry.slug"
          >
            <!-- Aulas publicadas são links; as outras, só a linha. -->
            <component
              :is="published ? NuxtLink : 'div'"
              v-bind="published ? { to: `/aprender/${course.slug}/${entry.slug}`, 'aria-current': isCurrent ? 'page' : undefined } : {}"
              :class="cn(
                rowClass,
                published && 'transition-colors hover:bg-section focus-visible:bg-section focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
                published && isCurrent && 'bg-amarelo-100 hover:bg-amarelo-100',
              )"
            >
              <LessonMark
                :state="state"
                :number="entry.number"
              />
              <span class="min-w-0">
                <span :class="cn('block text-[15px] leading-[1.35]', isCurrent ? 'font-bold text-ink' : published ? 'text-ink-secondary' : 'text-ink-muted')">
                  {{ entry.lesson.title }}
                </span>
                <span class="mt-0.5 block text-[13px] tabular-nums text-ink-muted">
                  {{ entry.lesson.duration ?? 'Em breve' }}<span
                    v-if="done"
                    class="sr-only"
                  >, concluída</span>
                </span>
              </span>
            </component>
          </li>
        </ol>
      </section>
    </ScrollToCurrent>
  </nav>
</template>
