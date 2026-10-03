<script setup lang="ts">
import { authCopy, authErrors, isEmail } from '#shared/content/auth'

defineProps<{ heading: 'h1' | 'h2' }>()
const email = defineModel<string>('email', { required: true })
const emit = defineEmits<{ found: [exists: boolean] }>()

const pending = ref(false)
const serverError = ref<string | null>(null)
const oauthNotice = ref(false)

const validation = useFieldValidation(
  () => ({ email: email.value }),
  () => ({ email: !email.value.trim() ? authErrors.emailRequired : isEmail(email.value) ? undefined : authErrors.emailInvalid }),
)

async function handleSubmit() {
  if (pending.value || !validation.submit()) return
  pending.value = true
  serverError.value = null
  try {
    const result = await lookUpEmail(email.value.trim())
    if ('error' in result) serverError.value = result.error
    else emit('found', result.exists)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <AuthHeading
    :as="heading"
    :title="authCopy.entry.title"
    :body="authCopy.entry.body"
  />
  <AuthCard :label="authCopy.entry.title">
    <OAuthButtons @select="oauthNotice = true" />
    <PrototypeNotice v-if="oauthNotice">
      {{ authCopy.prototype.unavailable }}
    </PrototypeNotice>
    <AuthDivider />
    <form
      class="flex flex-col gap-4"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <AuthAlert
        v-if="serverError"
        tone="error"
      >
        {{ serverError }}
      </AuthAlert>
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
        {{ pending ? authCopy.entry.pending : authCopy.entry.submit }}
      </button>
    </form>
  </AuthCard>
</template>
