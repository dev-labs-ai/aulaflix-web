<!-- A aula aberta do curso, para assistir antes de comprar. No desktop, fica presa ao lado da ementa. -->
<script setup lang="ts">
import type { Lesson } from '#shared/content/course-details'

defineProps<{
  lesson: Lesson
  number: number
  moduleTitle: string
}>()
</script>

<template>
  <CourseSection
    title="Aula grátis"
    note="Assista antes de comprar."
    class="scroll-mt-24 lg:sticky lg:top-24"
  >
    <LessonPlayer
      :title="lesson.title"
      :duration="lesson.duration ?? ''"
      :caption="{ label: `Aula ${number} · ${moduleTitle}` }"
    />
  </CourseSection>
</template>
