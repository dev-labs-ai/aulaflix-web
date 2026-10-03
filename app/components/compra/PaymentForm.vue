<!--
  Pagamento da compra: Pix ou cartão.
  Protótipo: nenhum pagamento é cobrado. Os campos do cartão não têm `name`, então são validados aqui e não vão para o
  servidor; ele só recebe a forma de pagamento e as parcelas.
-->
<script setup lang="ts">
import { CreditCard, QrCode } from '@lucide/vue'

type Method = 'pix' | 'card'

const { courseSlug, price, pixPrice, pixDiscount, installmentOptions } = defineProps<{
  courseSlug: string
  /** "R$ 497". */
  price: string
  /** "R$ 447,30". */
  pixPrice: string
  /** "10% de desconto". */
  pixDiscount: string
  /** Rótulo de cada número de parcelas, a partir de 1x. */
  installmentOptions: string[]
}>()

const digits = (value: string) => value.replace(/\D/g, '')

/** "MM/AA" com mês válido e ainda não vencido. */
function validExpiry(value: string) {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

const id = useId()
const method = ref<Method>('pix')
const card = reactive({ number: '', name: '', expiry: '', cvc: '' })
const error = ref<string | null>(null)
const pending = ref(false)

const validation = useFieldValidation(
  () => ({ ...card }),
  () => ({
    number: digits(card.number).length >= 13 && digits(card.number).length <= 19 ? undefined : 'Confira o número do cartão.',
    name: card.name.trim() ? undefined : 'Digite o nome como está no cartão.',
    expiry: validExpiry(card.expiry) ? undefined : 'Use a validade no formato MM/AA.',
    cvc: /^\d{3,4}$/.test(card.cvc.trim()) ? undefined : 'Confira o código de segurança.',
  }),
)

async function handleSubmit(event: Event) {
  if (pending.value || (method.value === 'card' && !validation.submit())) return
  // Only the named fields go: the payment method and, with the card, the installments.
  const payment = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)) as Record<string, string>
  pending.value = true
  try {
    error.value = await purchaseCourse(courseSlug, payment)
  }
  finally {
    pending.value = false
  }
}

const options = computed(() => [
  { value: 'pix' as const, title: 'Pix', detail: `${pixPrice}, com ${pixDiscount}`, icon: QrCode },
  { value: 'card' as const, title: 'Cartão de crédito', detail: `${price} em até ${installmentOptions.length}x sem juros`, icon: CreditCard },
])
</script>

<template>
  <form
    class="flex flex-col gap-6"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <fieldset>
      <legend :class="fieldLabelClass">
        Forma de pagamento
      </legend>
      <div class="mt-2 grid gap-3 sm:grid-cols-2">
        <label
          v-for="option in options"
          :key="option.value"
          class="flex cursor-pointer items-start gap-3 rounded-card border-2 border-line bg-surface p-4 transition-colors hover:border-line-strong has-[input:checked]:border-lousa-400 has-[input:checked]:bg-lousa-100 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-focus has-[input:focus-visible]:ring-offset-2"
        >
          <input
            v-model="method"
            type="radio"
            name="method"
            :value="option.value"
            class="mt-1 size-4 accent-lousa-400"
          >
          <span class="min-w-0">
            <span class="flex items-center gap-2 text-[16px] font-bold text-ink">
              <component
                :is="option.icon"
                aria-hidden="true"
                class="size-[18px]"
              />
              {{ option.title }}
            </span>
            <span class="mt-0.5 block text-[14px] tabular-nums text-ink-tertiary">{{ option.detail }}</span>
          </span>
        </label>
      </div>
    </fieldset>

    <div
      v-if="method === 'card'"
      class="grid gap-4"
    >
      <TextField
        v-model="card.number"
        label="Número do cartão"
        inputmode="numeric"
        autocomplete="cc-number"
        placeholder="0000 0000 0000 0000"
        :error="validation.errorFor('number')"
        @blur="validation.touch('number')"
      />
      <TextField
        v-model="card.name"
        label="Nome impresso no cartão"
        autocomplete="cc-name"
        :error="validation.errorFor('name')"
        @blur="validation.touch('name')"
      />
      <div class="grid grid-cols-2 gap-4">
        <TextField
          v-model="card.expiry"
          label="Validade"
          autocomplete="cc-exp"
          placeholder="MM/AA"
          inputmode="numeric"
          :error="validation.errorFor('expiry')"
          @blur="validation.touch('expiry')"
        />
        <TextField
          v-model="card.cvc"
          label="CVV"
          autocomplete="cc-csc"
          inputmode="numeric"
          maxlength="4"
          :error="validation.errorFor('cvc')"
          @blur="validation.touch('cvc')"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label
          :for="`${id}-installments`"
          :class="fieldLabelClass"
        >
          Parcelas
        </label>
        <!-- Uncontrolled, as in the reference app: it starts at the most installments each time the card is chosen. -->
        <select
          :id="`${id}-installments`"
          name="installments"
          class="block h-12 w-full rounded-control border border-line bg-surface px-3 text-[16px] tabular-nums text-ink focus:border-line-accent focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
        >
          <option
            v-for="(label, i) in installmentOptions"
            :key="label"
            :value="i + 1"
            :selected="i + 1 === installmentOptions.length"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>
    <p
      v-else
      class="rounded-card border border-line bg-surface px-4 py-3.5 text-[15px] leading-[1.6] text-ink-tertiary"
    >
      No Pix, o pagamento é aprovado na hora e o acesso ao curso é liberado em seguida.
    </p>

    <AuthAlert
      v-if="error"
      tone="error"
    >
      {{ error }}
    </AuthAlert>

    <div class="flex flex-col gap-3">
      <button
        type="submit"
        :disabled="pending"
        :class="cn(submitButtonClass, 'h-14 text-[17px]')"
      >
        {{ pending ? 'Processando…' : method === 'pix' ? `Pagar ${pixPrice} com Pix` : `Pagar ${price}` }}
      </button>
      <p class="text-[13px] leading-5 text-ink-muted">
        Protótipo: nenhum pagamento é cobrado, o pedido é aprovado na hora e os dados do cartão não saem do navegador.
      </p>
    </div>
  </form>
</template>
