<!--
  Faixa abaixo do header para quem criou a conta e ainda não confirmou o e-mail.
  Não bloqueia nada: a conta funciona normalmente enquanto isso.
-->
<script setup lang="ts">
import { MailCheck } from '@lucide/vue'
import { authCopy } from '#shared/content/auth'

defineProps<{ email: string }>()

const actionClass = cn(
  'rounded-control font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-ink disabled:no-underline disabled:opacity-70',
  focusRing,
  'focus-visible:ring-offset-amarelo-100',
)

const resend = ref<'idle' | 'pending' | 'sent'>('idle')

async function handleResend() {
  resend.value = 'pending'
  // Protótipo: nenhum e-mail é enviado de verdade.
  await simulateRequest()
  resend.value = 'sent'
}
</script>

<template>
  <div class="border-b border-amarelo-300 bg-amarelo-100 text-amarelo-700">
    <div :class="cn(container, 'flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-[15px] leading-[22px]')">
      <p class="flex items-start gap-2">
        <MailCheck
          aria-hidden="true"
          class="mt-[3px] size-4 shrink-0"
        />
        <span><Emphasis
          :parts="authCopy.confirmEmail.body(email)"
          inherit
        /></span>
      </p>
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
        <!-- A região fica sempre no DOM, para "Link reenviado" ser anunciado. -->
        <span role="status">
          <template v-if="resend === 'sent'">{{ authCopy.confirmEmail.resent }}</template>
          <button
            v-else
            type="button"
            :disabled="resend === 'pending'"
            :class="actionClass"
            @click="handleResend"
          >
            {{ authCopy.confirmEmail.resend }}
          </button>
        </span>
        <form @submit.prevent="confirmEmail">
          <button
            type="submit"
            :class="actionClass"
          >
            {{ authCopy.confirmEmail.simulate }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
