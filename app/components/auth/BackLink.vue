<!-- The parent's @click lands on the button. -->
<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { authCopy } from '#shared/content/auth'
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 self-start rounded-control text-[15px] font-bold leading-[22px] text-ink-tertiary transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
  >
    <ArrowLeft
      aria-hidden="true"
      class="size-4"
    />
    {{ authCopy.back }}
  </button>
</template>
