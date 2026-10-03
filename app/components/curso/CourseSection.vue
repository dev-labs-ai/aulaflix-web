<!-- Seção do corpo da página de curso (título, linha de apoio opcional e conteúdo). -->
<script setup lang="ts">
defineProps<{ title: string, note?: string }>()
</script>

<template>
  <section class="mt-20 sm:mt-24">
    <header>
      <h2 class="font-heading text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[34px]">
        {{ title }}
      </h2>
      <p
        v-if="note"
        class="mt-2 text-[16px] text-ink-muted"
      >
        {{ note }}
      </p>
    </header>
    <div class="mt-8">
      <slot />
    </div>
  </section>
</template>
