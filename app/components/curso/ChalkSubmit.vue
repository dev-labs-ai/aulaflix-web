<!-- Botão de envio da lista de espera, em giz amarelo sobre a lousa. Mostra `pendingLabel` enquanto envia. -->
<script setup lang="ts">
defineProps<{ pending: boolean, pendingLabel: string }>()
</script>

<template>
  <button
    type="submit"
    :disabled="pending"
    :class="cn(buttonClass('chalk', 'board'), 'shrink-0 disabled:opacity-70')"
  >
    <template v-if="pending">
      {{ pendingLabel }}
    </template>
    <slot v-else />
  </button>
</template>
