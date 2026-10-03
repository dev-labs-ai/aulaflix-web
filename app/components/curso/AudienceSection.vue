<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<template>
  <CourseSection title="Para quem é">
    <ul class="space-y-3">
      <li
        v-for="item in items"
        :key="item"
        class="grid grid-cols-[auto_1fr] gap-x-3 text-[16px] leading-[1.6] text-ink-secondary sm:text-[17px]"
      >
        <span
          aria-hidden="true"
          class="mt-[0.6em] size-2 rounded-full bg-coral-400"
        />
        <span>{{ item }}</span>
      </li>
    </ul>
  </CourseSection>
</template>
