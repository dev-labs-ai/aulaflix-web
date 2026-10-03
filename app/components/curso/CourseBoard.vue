<!--
  Topo da página de curso: área, título e resumo escritos na lousa e, logo abaixo, a ação principal
  (o slot): preço e compra, a lista de espera, ou o atalho para quem já tem o curso.
-->
<script setup lang="ts">
import { areaLabel, type Course } from '#shared/content/courses'

const { course } = defineProps<{ course: Course }>()

const icon = computed(() => courseIcons[course.icon])
</script>

<template>
  <Board class="px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div class="lg:col-span-8">
        <p class="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-bold text-giz-apagado">
          <span class="inline-flex items-center gap-2">
            <component
              :is="icon"
              aria-hidden="true"
              class="size-5"
            />
            {{ areaLabel[course.area] }}
          </span>
          <Badge
            v-if="course.status === 'waitlist'"
            tone="amarelo"
          >
            Em breve
          </Badge>
        </p>
        <h1 class="anim-giz mt-5 text-balance font-heading text-[40px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[56px] lg:text-[64px]">
          {{ course.title }}
        </h1>
        <p class="mt-6 max-w-[56ch] text-pretty text-[18px] leading-[1.6] text-giz-apagado sm:text-[20px]">
          {{ course.summary }}
        </p>

        <!-- Traço de giz separando o texto da ação. -->
        <div class="mt-10 border-t-2 border-dashed border-salvia-400 pt-8">
          <slot />
        </div>
      </div>

      <!-- O ícone do tema desenhado a giz, só no desktop, onde sobra lousa ao lado do texto. -->
      <div
        aria-hidden="true"
        class="hidden lg:col-span-4 lg:flex lg:items-center lg:justify-center"
      >
        <component
          :is="icon"
          :stroke-width="1"
          class="size-56 text-amarelo-300"
        />
      </div>
    </div>
  </Board>
</template>
