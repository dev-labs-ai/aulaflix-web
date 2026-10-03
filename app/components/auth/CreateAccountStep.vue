<script setup lang="ts">
import { AUTH_PASSWORD_MIN_LENGTH, authCopy, authErrors } from '#shared/content/auth'

const props = defineProps<{ email: string, next: string, heading: 'h1' | 'h2' }>()
defineEmits<{ back: [] }>()

const values = reactive({ name: '', password: '' })
const error = ref<string | null>(null)
const pending = ref(false)
const validation = useFieldValidation(
  () => ({ ...values }),
  () => ({
    name: values.name.trim() ? undefined : authErrors.nameRequired,
    password: values.password.length < AUTH_PASSWORD_MIN_LENGTH ? authErrors.passwordTooShort : undefined,
  }),
)

async function handleSubmit() {
  if (pending.value || !validation.submit()) return
  pending.value = true
  try {
    error.value = await signUp({ ...values, email: props.email, next: props.next })
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <StepHeading
    :title="authCopy.signUp.heading"
    :body="authCopy.signUp.body(email)"
    :heading="heading"
    @back="$emit('back')"
  />
  <AuthCard :label="authCopy.signUp.heading">
    <form
      class="flex flex-col gap-4"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <AuthAlert
        v-if="error"
        tone="error"
      >
        {{ error }}
      </AuthAlert>
      <input
        type="hidden"
        name="next"
        :value="next"
      >
      <!-- O e-mail já escolhido vai junto, e também ajuda o gerenciador de senhas a salvar o par. -->
      <input
        type="email"
        name="email"
        autocomplete="username"
        :value="email"
        readonly
        hidden
      >
      <TextField
        v-model="values.name"
        :label="authCopy.fields.name"
        name="name"
        autocomplete="name"
        :placeholder="authCopy.fields.namePlaceholder"
        autofocus
        :error="validation.errorFor('name')"
        @blur="validation.touch('name')"
      />
      <TextField
        v-model="values.password"
        :label="authCopy.fields.password"
        name="password"
        password
        autocomplete="new-password"
        :hint="authCopy.fields.passwordHint"
        :error="validation.errorFor('password')"
        @blur="validation.touch('password')"
      />
      <button
        type="submit"
        :disabled="pending"
        :class="cn(submitButtonClass, 'mt-2')"
      >
        {{ pending ? authCopy.signUp.pending : authCopy.signUp.submit }}
      </button>
      <p class="text-[14px] leading-5 text-ink-muted">
        {{ authCopy.signUp.confirmLater }}
      </p>
    </form>
  </AuthCard>
</template>
