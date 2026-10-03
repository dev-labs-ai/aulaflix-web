<script setup lang="ts">
defineProps<{ title: string, body: string, cta: string }>()
</script>

<template>
  <div class="mt-8 rounded-card border border-dashed border-line-strong bg-surface px-6 py-12 text-center sm:py-16">
    <p class="font-heading text-[22px] font-bold tracking-[-0.015em] text-ink">
      {{ title }}
    </p>
    <p class="mt-2 text-[16px] text-ink-tertiary">
      {{ body }}
    </p>
    <ButtonLink
      href="/cursos"
      class="mt-6"
    >
      {{ cta }}
    </ButtonLink>
  </div>
</template>
