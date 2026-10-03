<!--
  Painel de quadro-negro com a régua de madeira embaixo: o elemento-assinatura
  do Aulaflix (hero da home e capa da página de curso).
-->
<script setup lang="ts">
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div>
    <div :class="cn('rounded-t-board rounded-b-card bg-lousa-500 text-giz', props.class)">
      <slot />
    </div>
    <div
      aria-hidden="true"
      class="-mx-1.5 h-3 rounded-b-[10px] bg-madeira sm:-mx-2 sm:h-4"
    />
  </div>
</template>
