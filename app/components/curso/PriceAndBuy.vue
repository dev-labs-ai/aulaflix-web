<!-- Ação da lousa nos cursos à venda: preço, condições, compra e o atalho para a aula grátis. -->
<script setup lang="ts">
import { Check, Play } from '@lucide/vue'
import type { CoursePricing } from '#shared/content/course-details'

const props = defineProps<{
  pricing: CoursePricing
  buyHref: string
  freeLessonHref?: string
}>()

const terms = computed(() => priceTerms(props.pricing))
</script>

<template>
  <p class="text-[15px] font-bold text-giz-apagado">
    Valor do curso
  </p>
  <p class="mt-1 font-heading text-[48px] font-extrabold leading-[1.1] tracking-[-0.03em] tabular-nums text-giz sm:text-[56px]">
    {{ brl(pricing.price) }}
  </p>
  <p class="mt-2 text-[16px] tabular-nums text-giz-apagado">
    {{ terms.installments }}
  </p>
  <div class="mt-2 flex flex-wrap items-center gap-2.5">
    <span class="text-[16px] font-bold tabular-nums text-giz">ou {{ terms.pix }} no Pix</span>
    <Badge tone="amarelo">
      {{ terms.pixDiscount }}
    </Badge>
  </div>

  <div
    :id="boardBuyId"
    class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start"
  >
    <ButtonLink
      :href="buyHref"
      variant="chalk"
      offset="board"
      class="sm:min-w-60"
    >
      Comprar curso
    </ButtonLink>
    <ButtonLink
      v-if="freeLessonHref"
      :href="freeLessonHref"
      variant="chalk-outline"
      offset="board"
    >
      <Play
        aria-hidden="true"
        fill="currentColor"
        :stroke-width="0"
        class="size-4"
      />
      Assistir à aula grátis
    </ButtonLink>
  </div>

  <ul class="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
    <li
      v-for="perk in perks"
      :key="perk"
      class="flex items-center gap-2 text-[15px] text-giz-apagado"
    >
      <Check
        aria-hidden="true"
        :stroke-width="2.5"
        class="size-4 shrink-0 text-amarelo-300"
      />
      {{ perk }}
    </li>
  </ul>
</template>
