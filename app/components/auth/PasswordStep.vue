<script setup lang="ts">
import { authCopy, authErrors } from '#shared/content/auth'

const props = defineProps<{ email: string, next: string, heading: 'h1' | 'h2' }>()
defineEmits<{ back: [] }>()

const password = ref('')
const error = ref<string | null>(null)
const pending = ref(false)
const validation = useFieldValidation(
  () => ({ password: password.value }),
  () => ({ password: password.value ? undefined : authErrors.passwordRequired }),
)

async function handleSubmit() {
  if (pending.value || !validation.submit()) return
  pending.value = true
  try {
    error.value = await signIn({ email: props.email, password: password.value, next: props.next })
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <StepHeading
    :title="authCopy.signIn.heading"
    :body="authCopy.signIn.body(email)"
    :heading="heading"
    @back="$emit('back')"
  />
  <AuthCard :label="authCopy.signIn.title">
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
        v-model="password"
        :label="authCopy.fields.password"
        name="password"
        password
        autocomplete="current-password"
        autofocus
        :error="validation.errorFor('password')"
        @blur="validation.touch('password')"
      >
        <template #label-aside>
          <NuxtLink
            to="/redefinir-senha"
            :class="cn(inlineLinkClass, 'text-[13px] leading-[18px]')"
          >
            {{ authCopy.signIn.forgotPassword }}
          </NuxtLink>
        </template>
      </TextField>
      <button
        type="submit"
        :disabled="pending"
        :class="cn(submitButtonClass, 'mt-2')"
      >
        {{ pending ? authCopy.signIn.pending : authCopy.signIn.submit }}
      </button>
    </form>
  </AuthCard>
</template>
