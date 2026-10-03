<!-- Ícone de cada aula na lista: concluída, a atual, por fazer ou ainda não publicada. -->
<script setup lang="ts">
import { Check, Lock, Play } from '@lucide/vue'

defineProps<{ state: 'done' | 'current' | 'todo' | 'locked', number: number }>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn(
      'inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 font-heading text-[13px] font-bold tabular-nums',
      state === 'done' && 'border-lousa-400 bg-lousa-400 text-giz',
      state === 'current' && 'border-amarelo-300 bg-amarelo-300 text-ink',
      state === 'todo' && 'border-lousa-300 text-lousa-500',
      state === 'locked' && 'border-line text-ink-muted',
    )"
  >
    <Check
      v-if="state === 'done'"
      :stroke-width="3"
      class="size-3.5"
    />
    <Play
      v-else-if="state === 'current'"
      fill="currentColor"
      :stroke-width="0"
      class="ml-0.5 size-3"
    />
    <Lock
      v-else-if="state === 'locked'"
      class="size-3"
    />
    <template v-else>{{ number }}</template>
  </span>
</template>
