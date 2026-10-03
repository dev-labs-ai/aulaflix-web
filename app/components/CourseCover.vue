<!-- Capa do curso: a imagem própria, quando houver, ou o placeholder na cor do curso. -->
<script setup lang="ts">
import type { Course } from '#shared/content/courses'

defineProps<{ course: Course }>()
</script>

<template>
  <div
    aria-hidden="true"
    class="relative aspect-video w-full overflow-hidden"
  >
    <img
      v-if="course.image"
      :src="course.image"
      alt=""
      class="absolute inset-0 size-full object-cover"
    >
    <CourseCoverPlaceholder
      v-else
      :course="course"
    />
  </div>
</template>
