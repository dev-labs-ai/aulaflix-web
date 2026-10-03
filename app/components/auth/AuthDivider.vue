<script setup lang="ts">
import { authCopy } from '#shared/content/auth'
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="h-px grow bg-line" />
    <span class="text-[14px] text-ink-muted">{{ authCopy.divider }}</span>
    <div class="h-px grow bg-line" />
  </div>
</template>
