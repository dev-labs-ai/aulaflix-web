<script setup lang="ts">
import { site } from '#shared/content/site'

const { size = 22, offset = 'canvas' } = defineProps<{
  size?: number
  offset?: Offset
}>()
</script>

<!-- On the home page NuxtLink would add aria-current="page", which the reference app's logo doesn't have. -->
<template>
  <NuxtLink
    to="/"
    :aria-label="`${site.name}, página inicial`"
    :aria-current="undefined"
    :class="cn('inline-flex items-center gap-2.5 rounded-control', focusRing, ringOffset[offset])"
  >
    <LogoMark />
    <span
      class="font-heading font-extrabold tracking-[-0.03em] text-ink"
      :style="{ fontSize: `${size}px` }"
    >
      {{ site.wordmark }}
    </span>
  </NuxtLink>
</template>
