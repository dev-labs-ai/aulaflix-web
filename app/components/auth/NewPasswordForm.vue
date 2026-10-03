<!--
  Código recebido por e-mail + nova senha. Usado na redefinição de senha e em Conta.
  Protótipo: qualquer código de 6 dígitos é aceito. The `saved-notice` slot is the message shown after saving.
-->
<script setup lang="ts">
import { AUTH_CODE_LENGTH, AUTH_PASSWORD_MIN_LENGTH, AUTH_RESEND_SECONDS, authCopy, authErrors } from '#shared/content/auth'

defineProps<{ email: string, submitLabel: string }>()

const code = ref('')
const values = reactive({ password: '', confirm: '' })
const status = ref<'idle' | 'pending' | 'saved'>('idle')
const resent = ref(false)
const countdown = useResendCountdown(AUTH_RESEND_SECONDS)

const validation = useFieldValidation(
  () => ({ ...values }),
  () => ({
    password: values.password.length < AUTH_PASSWORD_MIN_LENGTH ? authErrors.passwordTooShort : undefined,
    confirm: values.confirm !== values.password ? authErrors.passwordMismatch : undefined,
  }),
)

async function handleSubmit() {
  if (status.value !== 'idle' || !validation.submit() || code.value.length !== AUTH_CODE_LENGTH) return
  status.value = 'pending'
  await simulateRequest()
  status.value = 'saved'
}

function resend() {
  code.value = ''
  resent.value = true
  countdown.restart()
}
</script>

<template>
  <PrototypeNotice v-if="status === 'saved'">
    <slot name="saved-notice" />
  </PrototypeNotice>
  <AuthAlert
    v-else-if="resent"
    tone="info"
  >
    <Emphasis
      :parts="authCopy.resend.sent(email)"
      inherit
    />
  </AuthAlert>
  <form
    class="flex flex-col gap-5"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-2">
      <label
        for="password-code"
        :class="fieldLabelClass"
      >
        {{ authCopy.fields.code }}
      </label>
      <CodeInput
        id="password-code"
        v-model="code"
        :disabled="status !== 'idle'"
        autofocus
      />
    </div>
    <TextField
      v-model="values.password"
      :label="authCopy.fields.newPassword"
      name="new-password"
      autocomplete="new-password"
      password
      :hint="authCopy.fields.passwordHint"
      :disabled="status === 'saved'"
      :error="validation.errorFor('password')"
      @blur="validation.touch('password')"
    />
    <TextField
      v-model="values.confirm"
      :label="authCopy.fields.confirmNewPassword"
      name="confirm-password"
      autocomplete="new-password"
      password
      :disabled="status === 'saved'"
      :error="validation.errorFor('confirm')"
      @blur="validation.touch('confirm')"
    />
    <button
      type="submit"
      :disabled="status !== 'idle' || code.length !== AUTH_CODE_LENGTH"
      :class="cn(submitButtonClass, 'mt-1')"
    >
      {{ submitLabel }}
    </button>
  </form>
  <ResendCode
    v-if="status !== 'saved'"
    :countdown="countdown"
    @resend="resend"
  />
</template>
