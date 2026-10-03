<!-- FAQ da página de curso, só com as dúvidas do curso; as da plataforma ficam em Como funciona. -->
<script setup lang="ts">
import type { FaqEntry } from '#shared/content/course-details'

defineProps<{ items: FaqEntry[] }>()
</script>

<template>
  <CourseSection title="Perguntas frequentes">
    <FaqList :items="items" />
    <p class="mt-6 text-[16px] leading-[1.6] text-ink-muted">
      Pagamento, garantia, acesso e lista de espera valem para todos os cursos e estão explicados em
      <NuxtLink
        to="/como-funciona"
        :class="cn(
          'rounded-control font-bold text-ink-accent underline decoration-2 underline-offset-4 transition-colors hover:text-ink-accent-hover',
          focusRing,
          ringOffset.canvas,
        )"
      >Como funciona</NuxtLink>.
    </p>
  </CourseSection>
</template>
