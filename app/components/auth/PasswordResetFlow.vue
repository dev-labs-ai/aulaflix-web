<!--
  Redefinição de senha em duas etapas: pedir o código por e-mail e criar a nova senha.
  Protótipo: nada é enviado a um backend. O pedido de código é simulado e qualquer
  código de 6 dígitos é aceito na troca de senha.
-->
<script setup lang="ts">
import { authCopy, authErrors, isEmail } from '#shared/content/auth'

const email = ref('')
const step = ref<'email' | 'reset'>('email')
const pending = ref(false)

const validation = useFieldValidation(
  () => ({ email: email.value }),
  () => ({ email: !email.value.trim() ? authErrors.emailRequired : isEmail(email.value) ? undefined : authErrors.emailInvalid }),
)

async function handleSubmit() {
  if (pending.value || !validation.submit()) return
  pending.value = true
  await simulateRequest()
  pending.value = false
  step.value = 'reset'
}
</script>

<template>
  <template v-if="step === 'reset'">
    <div class="flex flex-col gap-6">
      <BackLink @click="step = 'email'" />
      <AuthHeading :title="authCopy.reset.title">
        <Emphasis :parts="authCopy.reset.body(email.trim())" />
      </AuthHeading>
    </div>
    <AuthCard :label="authCopy.reset.title">
      <NewPasswordForm
        :email="email.trim()"
        :submit-label="authCopy.reset.submit"
      >
        <template #saved-notice>
          {{ authCopy.prototype.passwordSaved }}
          <NuxtLink
            to="/"
            class="font-bold underline underline-offset-2"
          >{{ authCopy.prototype.goHome }}</NuxtLink>
        </template>
      </NewPasswordForm>
    </AuthCard>
  </template>
  <template v-else>
    <div class="flex flex-col gap-6">
      <BackLink @click="navigateTo('/entrar')" />
      <AuthHeading :title="authCopy.forgot.title" />
    </div>
    <AuthCard :label="authCopy.forgot.title">
      <form
        class="flex flex-col gap-4"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <TextField
          v-model="email"
          :label="authCopy.fields.email"
          type="email"
          name="email"
          autocomplete="email"
          :placeholder="authCopy.fields.emailPlaceholder"
          :error="validation.errorFor('email')"
          @blur="validation.touch('email')"
        />
        <button
          type="submit"
          :disabled="pending"
          :class="cn(submitButtonClass, 'mt-2')"
        >
          {{ authCopy.forgot.submit }}
        </button>
      </form>
    </AuthCard>
  </template>
</template>
