<!--
  Cursos como fichas pautadas, com a faixa do topo na cor do curso: cheia nos cursos à venda
  e tracejada nos que estão em lista de espera.
  Todo o texto da ficha usa leading-7 e espaços múltiplos de 28px, para cair nas linhas da pauta.
-->
<script setup lang="ts">
import { getCourseDetail } from '#shared/content/course-details'
import { areaLabel, type Course } from '#shared/content/courses'

const { courses, offset = 'canvas' } = defineProps<{
  courses: Course[]
  label: string
  offset?: Offset
}>()

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** Rodapé da ficha: número de aulas e preço à venda; tópicos previstos e "Em breve" na lista de espera. */
function cardFacts(course: Course) {
  const detail = getCourseDetail(course.slug)
  if (!detail) return null
  if (detail.kind === 'waitlist') {
    return { size: plural(detail.coverage.length, 'tópico previsto', 'tópicos previstos'), status: 'Em breve' }
  }
  const lessons = detail.modules.reduce((n, mod) => n + mod.lessons.length, 0)
  return { size: plural(lessons, 'aula', 'aulas'), status: brl(detail.pricing.price) }
}

const cards = computed(() =>
  courses.map(course => ({
    course,
    tone: toneClasses[course.tone],
    facts: cardFacts(course),
    waitlist: course.status === 'waitlist',
  })),
)
</script>

<template>
  <ul
    :aria-label="label"
    class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
  >
    <li
      v-for="{ course, tone, facts, waitlist } in cards"
      :key="course.slug"
    >
      <NuxtLink
        :to="`/cursos/${course.slug}`"
        :class="cn(
          'group flex h-full flex-col overflow-hidden rounded-card border border-line shadow-(--shadow-raised) transition-colors hover:border-line-strong',
          focusRing,
          ringOffset[offset],
        )"
      >
        <span
          aria-hidden="true"
          :class="cn('h-3 shrink-0', waitlist ? cn('tracejado', tone.dash) : tone.stripe)"
        />
        <div class="flex flex-1 flex-col pautado px-6 py-7">
          <p class="flex items-center gap-2.5 text-[15px] font-bold leading-7 text-ink-tertiary">
            <component
              :is="courseIcons[course.icon]"
              aria-hidden="true"
              class="size-5"
            />
            {{ areaLabel[course.area] }}
          </p>
          <h3 class="mt-7 font-heading text-[26px] font-bold leading-7 tracking-[-0.02em] text-ink transition-colors group-hover:text-ink-accent">
            {{ course.title }}
          </h3>
          <p class="mt-7 flex-1 text-[16px] leading-7 text-ink-tertiary">
            {{ course.summary }}
          </p>
          <p
            v-if="facts"
            class="mt-7 flex justify-between gap-4 text-[16px] font-bold leading-7 tabular-nums text-ink"
          >
            <span>{{ facts.size }}</span>
            <span :class="cn(waitlist && 'text-ink-muted')">{{ facts.status }}</span>
          </p>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>
