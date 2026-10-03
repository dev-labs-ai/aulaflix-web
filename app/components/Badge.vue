<script lang="ts">
const badgeTones = {
  /** Destaque em giz amarelo, ex.: "À venda". */
  amarelo: 'bg-amarelo-100 text-amarelo-700',
  /** Confirmação, ex.: "Pago". */
  lousa: 'bg-lousa-100 text-lousa-500',
  /** Neutro, ex.: "Lista de espera". */
  neutro: 'bg-surface-muted text-ink-tertiary',
} as const

export type BadgeTone = keyof typeof badgeTones
</script>

<script setup lang="ts">
const { tone = 'neutro' } = defineProps<{ tone?: BadgeTone }>()
</script>

<template>
  <span :class="cn('inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[13px] font-bold leading-5', badgeTones[tone])">
    <slot />
  </span>
</template>
