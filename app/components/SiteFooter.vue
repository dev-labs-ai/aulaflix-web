<script setup lang="ts">
import { site } from '#shared/content/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-section">
    <div
      :class="cn(
        container,
        'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-[14px] text-ink-muted',
      )"
    >
      <span>© {{ year }} {{ site.name }}</span>
      <span>{{ site.legalName }}</span>
    </div>
  </footer>
</template>
