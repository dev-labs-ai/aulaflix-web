<!--
  Player de aula do protótipo: a tela com o botão de play. Ainda não há vídeos, então só avisa.
  Com `caption`, vira uma ficha com o número e o título da aula embaixo (aula grátis da página de curso);
  sem ela, é só a tela (página de aula, onde o título fica no h1).
-->
<script setup lang="ts">
import { Play } from '@lucide/vue'

defineProps<{
  title: string
  duration: string
  caption?: { label: string }
}>()

const clicked = ref(false)
const noticeText = 'Protótipo: o vídeo da aula ainda não está disponível.'
const noticeClass = 'mt-3 rounded-control bg-warning-100 px-3 py-2 text-[14px] text-warning-500'
</script>

<template>
  <figure :class="cn(caption && 'overflow-hidden rounded-card border border-line bg-surface-raised shadow-(--shadow-raised)')">
    <button
      type="button"
      :aria-label="`Assistir à aula: ${title}`"
      :class="cn(
        'group relative flex aspect-video w-full items-center justify-center bg-lousa-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amarelo-300',
        !caption && 'rounded-card',
      )"
      @click="clicked = true"
    >
      <span
        aria-hidden="true"
        class="flex size-16 items-center justify-center rounded-full bg-amarelo-300 text-ink transition-transform group-hover:scale-105 motion-reduce:transition-none sm:size-[72px]"
      >
        <Play
          fill="currentColor"
          :stroke-width="0"
          class="ml-1 size-7 sm:size-8"
        />
      </span>
      <span class="absolute bottom-3 right-3 rounded-[4px] bg-lousa-600 px-2 py-0.5 text-[13px] font-bold tabular-nums text-giz">{{ duration }}</span>
    </button>
    <!-- A região do aviso fica sempre no DOM, para ele ser anunciado quando aparecer. -->
    <figcaption
      v-if="caption"
      class="px-5 py-4 sm:px-6"
    >
      <p class="text-[14px] font-bold text-ink-muted">
        {{ caption.label }}
      </p>
      <p class="mt-1 font-heading text-[19px] font-bold leading-[1.3] tracking-[-0.01em] text-ink">
        {{ title }}
      </p>
      <div role="status">
        <p
          v-if="clicked"
          :class="noticeClass"
        >
          {{ noticeText }}
        </p>
      </div>
    </figcaption>
    <div
      v-else
      role="status"
    >
      <p
        v-if="clicked"
        :class="noticeClass"
      >
        {{ noticeText }}
      </p>
    </div>
  </figure>
</template>
