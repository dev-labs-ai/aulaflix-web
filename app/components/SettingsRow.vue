<!--
  Linha do cartão de Conta (`Row` em settings-card.tsx): rótulo, valor e ação. No celular o valor desce para baixo
  do rótulo; a partir de `sm` os três ficam lado a lado. Slots: `value`, `aside` (a ação à direita, link ou botão)
  e o padrão, embaixo da linha.
-->
<script setup lang="ts">
const { form = false } = defineProps<{
  label: string
  /** A linha inteira vira um <form>, que emite `submit`. */
  form?: boolean
}>()
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <component
    :is="form ? 'form' : 'div'"
    @submit.prevent="emit('submit')"
  >
    <div class="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1.5 px-6 py-3 sm:grid-cols-[140px_minmax(0,1fr)_auto]">
      <span class="col-start-1 row-start-1 text-[15px] font-bold text-ink-secondary">{{ label }}</span>
      <div
        v-if="$slots.value"
        class="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1"
      >
        <slot name="value" />
      </div>
      <div
        v-if="$slots.aside"
        class="col-start-2 row-start-1 flex items-center justify-self-end gap-1.5 sm:col-start-3"
      >
        <slot name="aside" />
      </div>
    </div>
    <slot />
  </component>
</template>
