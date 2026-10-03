<!-- Moldura das páginas da conta (Meus cursos e Conta): título e conteúdo. -->
<script setup lang="ts">
defineProps<{ id: string, title: string }>()
</script>

<template>
  <section
    :aria-labelledby="id"
    :class="cn(container, 'pb-24 pt-14 sm:pb-32')"
  >
    <h1
      :id="id"
      class="font-heading text-[32px] font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-[40px]"
    >
      {{ title }}
    </h1>
    <slot />
  </section>
</template>
