<!--
  Campo de texto com rótulo, erro e dica. The other attributes (name, autocomplete, placeholder, @blur…)
  go to the input. The `label-aside` slot sits right of the label, e.g. "Esqueceu a senha?".
-->
<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue'
import { authCopy } from '#shared/content/auth'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label: string
  error?: string
  hint?: string
  /** Campo de senha com botão de mostrar/ocultar. */
  password?: boolean
  /** Focuses the input once it mounts, as React does for `autoFocus`. */
  autofocus?: boolean
  id?: string
  type?: string
}>()
const model = defineModel<string>({ required: true })

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const visible = ref(false)
const describedBy = computed(() =>
  [props.hint && !props.error ? `${inputId.value}-hint` : null, props.error ? `${inputId.value}-error` : null]
    .filter(Boolean)
    .join(' '),
)

const input = useTemplateRef('input')
onMounted(() => {
  if (props.autofocus) input.value?.focus()
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-baseline justify-between gap-3">
      <label
        :for="inputId"
        :class="fieldLabelClass"
      >
        {{ label }}
      </label>
      <slot name="label-aside" />
    </div>
    <div class="relative">
      <input
        :id="inputId"
        ref="input"
        v-model="model"
        :type="password ? (visible ? 'text' : 'password') : type"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy || undefined"
        :class="cn(
          'block h-12 w-full rounded-control border bg-surface px-3.5 text-[16px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-raised disabled:opacity-60',
          error ? 'border-error-text focus:border-error-text focus:ring-error-bg' : 'border-line focus:border-line-accent focus:ring-focus',
          password && 'pr-12',
        )"
        v-bind="$attrs"
      >
      <button
        v-if="password"
        type="button"
        :aria-label="visible ? authCopy.fields.hidePassword : authCopy.fields.showPassword"
        :aria-pressed="visible"
        class="absolute right-0 top-0 flex size-12 items-center justify-center rounded-control text-ink-tertiary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        @click="visible = !visible"
      >
        <EyeOff
          v-if="visible"
          aria-hidden="true"
          class="size-5"
        />
        <Eye
          v-else
          aria-hidden="true"
          class="size-5"
        />
      </button>
    </div>
    <FieldError
      v-if="error"
      :id="`${inputId}-error`"
    >
      {{ error }}
    </FieldError>
    <p
      v-if="hint && !error"
      :id="`${inputId}-hint`"
      class="text-[14px] leading-5 text-ink-muted"
    >
      {{ hint }}
    </p>
  </div>
</template>
