<!--
  Conteúdo programático: módulos com aulas numeradas em sequência contínua.
  A aula aberta (`free`) ganha um link para o player da aula grátis (`freeLessonHref`).
-->
<script setup lang="ts">
import { Lock, Play } from '@lucide/vue'
import type { CourseModule } from '#shared/content/course-details'

const props = defineProps<{ modules: CourseModule[], freeLessonHref?: string }>()

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// Índice da primeira aula de cada módulo (a numeração continua entre módulos).
const starts = computed(() =>
  props.modules.map((_, m) => props.modules.slice(0, m).reduce((n, mod) => n + mod.lessons.length, 0)),
)
const lessonCount = computed(() => props.modules.reduce((n, mod) => n + mod.lessons.length, 0))
</script>

<template>
  <CourseSection
    title="Ementa"
    :note="`${plural(modules.length, 'módulo', 'módulos')} e ${plural(lessonCount, 'aula', 'aulas')}.`"
  >
    <div class="space-y-10">
      <div
        v-for="(mod, m) in modules"
        :key="mod.title"
      >
        <h3 class="font-heading text-[19px] font-bold leading-[1.3] tracking-[-0.01em] text-ink sm:text-[20px]">
          <span class="text-ink-muted">Módulo {{ m + 1 }}:</span> {{ mod.title }}
        </h3>
        <ol class="mt-3 border-y border-line">
          <li
            v-for="(lesson, l) in mod.lessons"
            :key="lesson.title"
            class="grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b border-line py-4 last:border-b-0"
          >
            <Step :muted="!lesson.duration">
              <template v-if="lesson.duration">
                {{ starts[m] + l + 1 }}
              </template>
              <Lock
                v-else
                class="size-3.5"
              />
            </Step>
            <div class="min-w-0">
              <p
                :class="cn(
                  'text-[16px] leading-[1.35] sm:text-[17px]',
                  lesson.duration ? 'font-bold text-ink' : 'text-ink-muted',
                )"
              >
                {{ lesson.title }}
              </p>
              <p class="mt-0.5 text-[14px] tabular-nums text-ink-muted">
                {{ lesson.duration ?? 'Em breve' }}
              </p>
            </div>
            <NuxtLink
              v-if="lesson.free && freeLessonHref"
              :to="freeLessonHref"
              :class="cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full bg-amarelo-100 px-3 text-[14px] font-bold text-amarelo-700 transition-colors hover:bg-amarelo-300 hover:text-ink',
                focusRing,
                ringOffset.canvas,
              )"
            >
              <Play
                aria-hidden="true"
                fill="currentColor"
                :stroke-width="0"
                class="size-3.5"
              />
              Grátis<span class="sr-only">: assistir à aula {{ lesson.title }}</span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </div>
  </CourseSection>
</template>
