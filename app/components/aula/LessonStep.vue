<!-- Link para a aula anterior ou a próxima, com o título dela. -->
<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import type { LessonEntry } from '#shared/content/course-details'

const { direction } = defineProps<{ entry: LessonEntry, course: string, direction: 'previous' | 'next' }>()

const isNext = computed(() => direction === 'next')
</script>

<template>
  <NuxtLink
    :to="`/aprender/${course}/${entry.slug}`"
    :class="cn(
      'group flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong',
      isNext && 'flex-row-reverse text-right sm:col-start-2',
      focusRing,
      ringOffset.canvas,
    )"
  >
    <component
      :is="isNext ? ArrowRight : ArrowLeft"
      aria-hidden="true"
      class="size-5 shrink-0 text-ink-tertiary transition-colors group-hover:text-ink"
    />
    <span class="min-w-0">
      <span class="block text-[13px] font-bold text-ink-muted">{{ isNext ? 'Próxima aula' : 'Aula anterior' }}</span>
      <span class="block truncate text-[15px] font-bold text-ink">{{ entry.lesson.title }}</span>
    </span>
  </NuxtLink>
</template>
