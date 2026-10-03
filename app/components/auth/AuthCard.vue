<!-- Ficha branca com a faixa da lousa no topo (desktop); no mobile o conteúdo fica solto na página. -->
<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <section
    :aria-label="label"
    class="flex flex-col gap-5 sm:rounded-card sm:border sm:border-t-[6px] sm:border-line sm:border-t-lousa-500 sm:bg-surface-raised sm:p-8 sm:shadow-(--shadow-raised)"
  >
    <slot />
  </section>
</template>
