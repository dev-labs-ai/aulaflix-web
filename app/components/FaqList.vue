<!-- Perguntas que abrem a resposta ao clicar, na página de curso e em Como funciona. -->
<script setup lang="ts">
import type { FaqEntry } from '#shared/content/course-details'

defineProps<{ items: FaqEntry[] }>()
</script>

<template>
  <ul class="divide-y divide-line border-y border-line">
    <li
      v-for="item in items"
      :key="item.question"
    >
      <details class="group py-5">
        <summary class="flex cursor-pointer list-none items-baseline justify-between gap-4 font-heading text-[18px] font-bold leading-[1.3] tracking-[-0.01em] text-ink sm:text-[19px] [&::-webkit-details-marker]:hidden">
          <span>{{ item.question }}</span>
          <span
            aria-hidden="true"
            class="shrink-0 text-[22px] leading-none text-ink-muted transition-transform group-open:rotate-45"
          >+</span>
        </summary>
        <p class="mt-3 max-w-[60ch] text-[16px] leading-[1.65] text-ink-tertiary sm:text-[17px]">
          {{ item.answer }}
        </p>
      </details>
    </li>
  </ul>
</template>
