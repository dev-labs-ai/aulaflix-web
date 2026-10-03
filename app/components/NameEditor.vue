<!-- Edição do nome em Conta. Desmonta ao cancelar ou salvar, o que zera o erro anterior. -->
<script setup lang="ts">
import { settingsCopy as copy } from '#shared/content/account'

const { current } = defineProps<{ current: string }>()
const emit = defineEmits<{ close: [] }>()

const name = ref(current)
const error = ref<string | null>(null)
const pending = ref(false)

async function save() {
  pending.value = true
  try {
    error.value = await updateName(name.value)
    if (!error.value) return emit('close')
    // The reference app's form resets once the action ends, which puts the saved name back in the field.
    name.value = current
  }
  finally {
    pending.value = false
  }
}

const input = useTemplateRef('input')
onMounted(() => input.value?.focus())
</script>

<template>
  <SettingsRow
    form
    :label="copy.name"
    @submit="save"
  >
    <template #value>
      <div class="flex flex-col gap-1.5 sm:-ml-3">
        <input
          ref="input"
          v-model="name"
          name="name"
          autocomplete="name"
          :aria-label="copy.name"
          :aria-invalid="error ? true : undefined"
          :aria-describedby="error ? 'name-error' : undefined"
          :class="cn(
            'h-10 w-full max-w-72 rounded-control border bg-surface px-3 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface',
            error ? 'border-error-text focus:ring-error-bg' : 'border-line focus:border-line-accent focus:ring-focus',
          )"
        >
        <FieldError
          v-if="error"
          id="name-error"
        >
          {{ error }}
        </FieldError>
      </div>
    </template>
    <template #aside>
      <button
        type="button"
        :class="settingsTextButton('muted')"
        @click="emit('close')"
      >
        {{ copy.cancel }}
      </button>
      <button
        type="submit"
        :disabled="pending"
        :class="settingsTextButton('accent')"
      >
        {{ copy.save }}
      </button>
    </template>
  </SettingsRow>
</template>
