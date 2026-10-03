<script setup lang="ts">
import { Check } from '@lucide/vue'

defineProps<{ items: string[] }>()
</script>

<template>
  <CourseSection title="O que você vai aprender">
    <ul class="space-y-4">
      <li
        v-for="item in items"
        :key="item"
        class="grid grid-cols-[auto_1fr] gap-x-4"
      >
        <span
          aria-hidden="true"
          class="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-amarelo-300 text-ink"
        >
          <Check
            :stroke-width="3"
            class="size-3.5"
          />
        </span>
        <p class="text-[16px] leading-[1.6] text-ink-secondary sm:text-[17px]">
          {{ item }}
        </p>
      </li>
    </ul>
  </CourseSection>
</template>
