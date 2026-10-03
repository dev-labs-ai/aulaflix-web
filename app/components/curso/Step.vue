<!-- Número da aula ou do tópico, num círculo como nas listas escritas no quadro. -->
<script setup lang="ts">
const { muted = false } = defineProps<{ muted?: boolean }>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn(
      'inline-flex size-8 items-center justify-center rounded-full border-2 font-heading text-[14px] font-bold tabular-nums',
      muted ? 'border-line text-ink-muted' : 'border-lousa-300 text-lousa-500',
    )"
  ><slot /></span>
</template>
