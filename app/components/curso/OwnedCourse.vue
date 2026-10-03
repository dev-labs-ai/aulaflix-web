<!-- Ação da lousa para quem já comprou o curso: o atalho para continuar de onde parou. -->
<script setup lang="ts">
import { Check, Play } from '@lucide/vue'

defineProps<{ courseSlug: string }>()
</script>

<template>
  <p class="flex items-center gap-2 text-[17px] font-bold text-giz">
    <Check
      aria-hidden="true"
      :stroke-width="3"
      class="size-5 text-amarelo-300"
    />
    Você já tem este curso.
  </p>
  <ButtonLink
    :href="`/aprender/${courseSlug}`"
    variant="chalk"
    offset="board"
    class="mt-6 w-full sm:w-auto"
  >
    <Play
      aria-hidden="true"
      fill="currentColor"
      :stroke-width="0"
      class="size-4"
    />
    Continuar curso
  </ButtonLink>
</template>
