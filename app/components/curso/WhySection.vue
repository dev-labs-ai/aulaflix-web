<script setup lang="ts">
defineProps<{ paragraphs: string[] }>()
</script>

<template>
  <CourseSection title="Sobre o curso">
    <div class="space-y-5 text-[17px] leading-[1.7] text-ink-secondary sm:text-[18px]">
      <p
        v-for="p in paragraphs"
        :key="p"
      >
        {{ p }}
      </p>
    </div>
  </CourseSection>
</template>
