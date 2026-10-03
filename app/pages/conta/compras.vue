<!-- Aba "Compras" de /conta: os pedidos, do mais recente para o mais antigo. -->
<script setup lang="ts">
import { purchasesCopy as copy } from '#shared/content/account'

useSeoMeta({ title: copy.title, description: copy.description })

const { data } = await useFetch('/api/purchases', { key: 'purchases' })
const purchases = computed(() => data.value ?? [])

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "2 out 2026, 00:10", no fuso de Brasília. */
function formatDate(iso: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map(part => [part.type, part.value]),
  )
  return `${Number(parts.day)} ${months[Number(parts.month) - 1]} ${parts.year}, ${parts.hour}:${parts.minute}`
}

// Always with cents here ("R$ 597,00"), unlike `brl` in shared/utils/format.ts.
const amount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** "A, B e C." */
function listCourses(titles: string[]) {
  return `${titles.length > 1 ? `${titles.slice(0, -1).join(', ')} e ${titles.at(-1)}` : titles[0]}.`
}

const cards = computed(() =>
  purchases.value.map((purchase) => {
    const installments = purchase.installments && purchase.installments > 1 ? ` em ${purchase.installments}x` : ''
    const meta = [copy.paymentMethod[purchase.method] + installments, formatDate(purchase.createdAt), copy.order(purchase.id)]
    return { ...purchase, meta }
  }),
)
</script>

<template>
  <ul
    v-if="cards.length > 0"
    class="mt-8 flex flex-col gap-4"
  >
    <li
      v-for="purchase in cards"
      :key="purchase.id"
      class="rounded-card border border-line bg-surface p-5 shadow-(--shadow-raised) sm:p-6"
    >
      <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h2 class="font-heading text-[20px] font-bold leading-[1.3] tracking-[-0.015em] text-ink">
              {{ purchase.title }}
            </h2>
            <Badge tone="lousa">
              {{ copy.status[purchase.status] }}
            </Badge>
          </div>
          <ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[14px] tabular-nums text-ink-muted">
            <li
              v-for="item in purchase.meta"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <p class="font-heading text-[22px] font-bold tabular-nums text-ink">
          {{ amount.format(purchase.amount) }}
        </p>
      </div>

      <!-- Com cursos avulsos, a lista de cursos só aparece quando o pedido tem mais de um. -->
      <div
        v-if="purchase.courses.length > 1"
        class="mt-5"
      >
        <p class="text-[14px] font-bold text-ink-secondary">
          {{ copy.includes }}
        </p>
        <p class="mt-1 text-[15px] leading-[1.6] text-ink-tertiary">
          {{ listCourses(purchase.courses.map(course => course.title)) }}
        </p>
      </div>
    </li>
  </ul>
  <AccountEmptyState
    v-else
    v-bind="copy.empty"
  />
</template>
