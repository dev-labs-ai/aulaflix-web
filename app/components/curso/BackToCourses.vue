<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue'
</script>

<template>
  <NuxtLink
    to="/cursos"
    class="-ml-2 inline-flex h-11 min-w-0 max-w-full items-center gap-1.5 rounded-control pl-2 pr-3.5 text-[15px] font-bold text-ink-secondary transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
  >
    <ChevronLeft
      aria-hidden="true"
      :stroke-width="2"
      class="size-[18px] shrink-0"
    />
    <span class="truncate">Cursos</span>
  </NuxtLink>
</template>
