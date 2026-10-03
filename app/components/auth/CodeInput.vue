<!--
  Código numérico em caixas separadas. Um único <input> invisível cobre as caixas,
  então colar o código inteiro e o preenchimento automático do celular funcionam.
-->
<script setup lang="ts">
import { AUTH_CODE_LENGTH, authCopy } from '#shared/content/auth'

const { invalid = false, disabled = false, autofocus = false } = defineProps<{
  id: string
  invalid?: boolean
  disabled?: boolean
  /** Focuses the input once it mounts, as React does for `autoFocus`. */
  autofocus?: boolean
}>()
const model = defineModel<string>({ required: true })
const emit = defineEmits<{ complete: [value: string] }>()

const focused = ref(false)
const activeIndex = computed(() => Math.min(model.value.length, AUTH_CODE_LENGTH - 1))

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  const next = input.value.replace(/\D/g, '').slice(0, AUTH_CODE_LENGTH)
  // Keeps the field in step when a rejected key leaves the model unchanged, as React's controlled input does.
  input.value = next
  model.value = next
  if (next.length === AUTH_CODE_LENGTH) emit('complete', next)
}

function onFocus(event: FocusEvent) {
  focused.value = true
  ;(event.target as HTMLInputElement).select()
}

const input = useTemplateRef('input')
onMounted(() => {
  if (autofocus) input.value?.focus()
})
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      ref="input"
      :value="model"
      inputmode="numeric"
      autocomplete="one-time-code"
      pattern="[0-9]*"
      :maxlength="AUTH_CODE_LENGTH"
      :aria-label="authCopy.fields.codeGroup"
      :aria-invalid="invalid || undefined"
      :disabled="disabled"
      class="absolute inset-0 z-10 size-full cursor-text opacity-0 disabled:cursor-default"
      @input="onInput"
      @focus="onFocus"
      @blur="focused = false"
    >
    <div
      aria-hidden="true"
      class="grid grid-cols-6 gap-2 sm:gap-2.5"
    >
      <div
        v-for="(_, index) in AUTH_CODE_LENGTH"
        :key="index"
        :class="cn(
          'flex h-[52px] items-center justify-center rounded-control border bg-surface font-heading text-[26px] font-bold tabular-nums text-ink sm:h-[60px]',
          invalid ? 'border-error-text' : 'border-line',
          focused && !invalid && index === activeIndex && 'border-line-accent ring-2 ring-focus ring-offset-2 ring-offset-surface-raised',
          disabled && 'opacity-60',
        )"
      >
        {{ model[index] ?? '' }}
      </div>
    </div>
  </div>
</template>
