<!--
  Lista de espera na lousa, para quem não entrou: só o e-mail, e o convite para entrar e se inscrever
  com um clique. Protótipo: a inscrição fica num cookie e nenhum aviso é enviado.
-->
<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'

const { courseSlug } = defineProps<{ courseSlug: string }>()

const id = useId()
const email = ref('')
const error = ref<string | null>(null)
const joinedEmail = ref<string | null>(null)
const pending = ref(false)

async function handleSubmit() {
  pending.value = true
  try {
    const result = await joinWaitlistWithEmail(courseSlug, email.value)
    if ('error' in result) error.value = result.error
    else joinedEmail.value = result.email
  }
  finally {
    pending.value = false
    // The reference app's form action resets the form once it's done, so the field empties after each try.
    email.value = ''
  }
}
</script>

<template>
  <Confirmed
    v-if="joinedEmail"
    :email="joinedEmail"
  />
  <template v-else>
    <p class="max-w-[52ch] text-[17px] leading-[1.6] text-giz-apagado">
      O curso ainda está em produção. Deixe seu e-mail e avisamos quando as inscrições abrirem.
    </p>
    <form
      novalidate
      class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-2 sm:w-80">
        <label
          :for="`${id}-email`"
          class="sr-only"
        >
          E-mail
        </label>
        <input
          :id="`${id}-email`"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          required
          placeholder="seu@email.com"
          :aria-invalid="error ? true : undefined"
          :aria-describedby="error ? `${id}-error` : undefined"
          class="h-12 w-full rounded-control border-2 border-salvia-400 bg-lousa-600 px-3.5 text-[16px] text-giz placeholder:text-giz-apagado focus:border-amarelo-300 focus:outline-none aria-[invalid=true]:border-amarelo-300"
        >
        <p
          v-if="error"
          :id="`${id}-error`"
          class="flex items-start gap-1.5 text-[14px] leading-5 text-amarelo-300"
        >
          <TriangleAlert
            aria-hidden="true"
            class="mt-0.5 size-4 shrink-0"
          />
          {{ error }}
        </p>
      </div>
      <ChalkSubmit
        :pending="pending"
        pending-label="Enviando…"
      >
        Avise-me
      </ChalkSubmit>
    </form>
    <p class="mt-5 text-[15px] leading-[1.6] text-giz-apagado">
      Já tem conta?
      <NuxtLink
        :to="`/entrar?next=/cursos/${courseSlug}`"
        :class="cn('rounded-control font-bold text-giz underline decoration-2 underline-offset-4', focusRing, ringOffset.board)"
      >Entre</NuxtLink>
      e seja avisado com um clique.
    </p>
  </template>
</template>
