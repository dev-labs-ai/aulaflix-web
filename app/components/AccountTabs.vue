<!-- Abas de /conta. São links (cada aba é uma página), com a atual marcada por `aria-current`. -->
<script setup lang="ts">
import { accountCopy } from '#shared/content/account'

const route = useRoute()
</script>

<template>
  <nav
    :aria-label="accountCopy.tabsLabel"
    class="mt-6 border-b border-line"
  >
    <ul class="-mb-px flex gap-7">
      <li
        v-for="tab in accountCopy.tabs"
        :key="tab.href"
      >
        <NuxtLink
          :to="tab.href"
          :aria-current="route.path === tab.href ? 'page' : undefined"
          :class="cn(
            'inline-flex h-12 items-center rounded-t-control border-b-[3px] text-[16px] font-bold transition-colors',
            route.path === tab.href ? 'border-lousa-400 text-ink' : 'border-transparent text-ink-tertiary hover:text-ink',
            focusRing,
            ringOffset.canvas,
          )"
        >
          {{ tab.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
