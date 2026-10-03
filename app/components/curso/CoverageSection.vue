<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<template>
  <CourseSection title="Conteúdo previsto">
    <ol class="border-y border-line">
      <li
        v-for="(item, i) in items"
        :key="item"
        class="grid grid-cols-[auto_1fr] items-center gap-x-5 border-b border-line py-5 last:border-b-0"
      >
        <Step>{{ i + 1 }}</Step>
        <p class="text-[16px] leading-[1.6] text-ink-secondary sm:text-[17px]">
          {{ item }}
        </p>
      </li>
    </ol>
  </CourseSection>
</template>
