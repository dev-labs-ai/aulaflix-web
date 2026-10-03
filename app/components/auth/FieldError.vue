<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
</script>

<template>
  <p class="flex items-start gap-1.5 text-[14px] leading-5 text-error-text">
    <CircleAlert
      aria-hidden="true"
      class="mt-0.5 size-4 shrink-0"
    />
    <span><slot /></span>
  </p>
</template>
