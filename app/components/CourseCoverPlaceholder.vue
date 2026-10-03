<!-- Capa de curso: fundo claro na cor do curso com o ícone do tema. -->
<script setup lang="ts">
import type { Course } from '#shared/content/courses'

const { course } = defineProps<{ course: Pick<Course, 'icon' | 'tone'> }>()

const icon = computed(() => courseIcons[course.icon])
const tone = computed(() => toneClasses[course.tone])
</script>

<template>
  <div :class="cn('absolute inset-0 flex items-center justify-center', tone.soft)">
    <component
      :is="icon"
      aria-hidden="true"
      :stroke-width="1.25"
      :class="cn('size-[38%]', tone.ink)"
    />
  </div>
</template>
