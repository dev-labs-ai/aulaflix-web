<script setup lang="ts">
import { CircleAlert, Mail } from '@lucide/vue'

defineProps<{ tone: 'info' | 'error' }>()
</script>

<template>
  <p
    :role="tone === 'error' ? 'alert' : 'status'"
    :class="cn(
      'flex items-start gap-2 rounded-control px-3.5 py-3 text-[15px] leading-[22px]',
      tone === 'error' ? 'bg-error-bg text-error-text' : 'bg-surface-accent-soft text-lousa-500',
    )"
  >
    <component
      :is="tone === 'error' ? CircleAlert : Mail"
      aria-hidden="true"
      class="mt-[3px] size-4 shrink-0"
    />
    <span><slot /></span>
  </p>
</template>
