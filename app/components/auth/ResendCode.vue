<!-- "Não recebeu?" + botão para pedir outro código, bloqueado enquanto a contagem não zera. -->
<script setup lang="ts">
import { authCopy } from '#shared/content/auth'

defineProps<{ countdown: { remaining: number, label: string } }>()
defineEmits<{ resend: [] }>()
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <p class="text-[15px] leading-[22px] text-ink-tertiary">
      {{ authCopy.resend.notReceived }}
    </p>
    <button
      type="button"
      :disabled="countdown.remaining > 0"
      class="self-start rounded-control text-[15px] font-bold leading-[22px] text-ink-accent underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-default disabled:text-ink-muted disabled:no-underline"
      @click="$emit('resend')"
    >
      <template v-if="countdown.remaining > 0">
        {{ authCopy.resend.countdown }} <span class="tabular-nums">{{ countdown.label }}</span>
      </template>
      <template v-else>
        {{ authCopy.resend.action }}
      </template>
    </button>
  </div>
</template>
