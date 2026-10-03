<script setup lang="ts">
import { initials } from '#shared/content/account'

defineProps<{ user: SessionUser }>()
</script>

<template>
  <span
    aria-hidden="true"
    class="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-amarelo-300 text-[13px] font-bold text-ink"
  >{{ initials(user.name, user.email) }}</span>
</template>
