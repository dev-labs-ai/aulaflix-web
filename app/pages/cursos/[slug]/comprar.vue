<!--
  Compra de um curso: identificação (entrar ou criar a conta ali mesmo), pagamento (Pix ou cartão)
  e confirmação, com acesso direto à primeira aula. `?pedido=` mostra a confirmação de um pedido.
-->
<script setup lang="ts">
import { Check, ChevronLeft, Play } from '@lucide/vue'
import { purchasesCopy } from '#shared/content/account'
import { courseLessons, getCourseDetail, type OnSaleCourseDetail } from '#shared/content/course-details'
import { areaLabel, getCourse } from '#shared/content/courses'

definePageMeta({
  // Só os cursos conhecidos existem; qualquer outro slug vira 404. The port shows the regular 404 page here, where
  // the reference app doubles the header and footer (#21).
  validate: route => Boolean(getCourse(String(route.params.slug)) && getCourseDetail(String(route.params.slug))),
  middleware: [
    // Curso em lista de espera ainda não se compra.
    (to) => {
      const slug = String(to.params.slug)
      if (getCourseDetail(slug)?.kind !== 'on-sale') return navigateTo(`/cursos/${slug}`, { redirectCode: 307 })
    },
  ],
})

const route = useRoute()
const slug = String(route.params.slug)
const path = `/cursos/${slug}/comprar`
// `validate` and the middleware let only courses on sale through.
const course = getCourse(slug)!
const detail = getCourseDetail(slug) as OnSaleCourseDetail

useSeoMeta({ title: `Comprar ${course.title}` })

const [{ data: user }, { data: purchases }] = await Promise.all([
  useSessionUser(),
  useFetch('/api/purchases', { key: 'purchases' }),
])
const owned = computed(() => Boolean(purchases.value?.some(p => p.courses.some(c => c.slug === slug))))
const order = computed(() =>
  purchases.value?.find(p => p.id === route.query.pedido && p.courses.some(c => c.slug === slug)),
)
const firstLesson = courseLessons(detail).find(entry => entry.lesson.duration)

const steps = ['Identificação', 'Pagamento', 'Pronto'] as const
const step = computed(() => (!user.value ? 0 : order.value ? 2 : 1))
const stepState = (i: number) => (i < step.value ? 'done' : i === step.value ? 'current' : 'todo')

const terms = priceTerms(detail.pricing)
const installmentOptions = Array.from({ length: detail.pricing.installments }, (_, i) =>
  i === 0
    ? `1x de ${brl(detail.pricing.price)} (à vista)`
    : `${i + 1}x de ${brl(detail.pricing.price / (i + 1))} sem juros`,
)
const icon = courseIcons[course.icon]
</script>

<template>
  <div :class="cn(container, 'pb-24 pt-6 sm:pb-32 sm:pt-10')">
    <NuxtLink
      :to="`/cursos/${slug}`"
      :class="cn(
        '-ml-2 inline-flex h-11 max-w-full items-center gap-1.5 rounded-control pl-2 pr-3.5 text-[15px] font-bold text-ink-secondary transition-colors hover:bg-surface-muted',
        focusRing,
        ringOffset.canvas,
      )"
    >
      <ChevronLeft
        aria-hidden="true"
        class="size-[18px] shrink-0"
      />
      <span class="truncate">{{ course.title }}</span>
    </NuxtLink>
    <h1 class="mt-3 font-heading text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[44px]">
      Comprar curso
    </h1>

    <!-- As três etapas, com as já feitas marcadas e a atual em destaque. -->
    <ol class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-bold sm:gap-x-3">
      <li
        v-for="(label, i) in steps"
        :key="label"
        :aria-current="stepState(i) === 'current' ? 'step' : undefined"
        class="flex items-center gap-3"
      >
        <span :class="cn('flex items-center gap-2', stepState(i) === 'todo' ? 'text-ink-muted' : 'text-ink')">
          <span
            aria-hidden="true"
            :class="cn(
              'inline-flex size-7 items-center justify-center rounded-full border-2 font-heading text-[13px] tabular-nums',
              stepState(i) === 'done' && 'border-lousa-400 bg-lousa-400 text-giz',
              stepState(i) === 'current' && 'border-amarelo-300 bg-amarelo-300 text-ink',
              stepState(i) === 'todo' && 'border-line text-ink-muted',
            )"
          >
            <Check
              v-if="stepState(i) === 'done'"
              :stroke-width="3"
              class="size-3.5"
            />
            <template v-else>{{ i + 1 }}</template>
          </span>{{ label }}<span
            v-if="stepState(i) === 'done'"
            class="sr-only"
          >(concluída)</span>
        </span>
        <!-- No celular as etapas podem quebrar de linha, e o traço ficaria solto no fim dela. -->
        <span
          v-if="i < steps.length - 1"
          aria-hidden="true"
          class="hidden h-0.5 w-10 rounded-full bg-line sm:block"
        />
      </li>
    </ol>

    <div class="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div class="lg:col-span-7">
        <!-- Mesmo espaçamento entre título e formulário que a moldura de /entrar dá ao fluxo. -->
        <div
          v-if="!user"
          class="flex flex-col gap-6 sm:gap-7"
        >
          <EntryFlow
            :next="path"
            heading="h2"
          />
        </div>
        <Board
          v-else-if="order"
          class="px-6 py-8 sm:px-10 sm:py-10"
        >
          <h2 class="flex items-center gap-3 font-heading text-[28px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[34px]">
            <Check
              aria-hidden="true"
              :stroke-width="3"
              class="size-7 shrink-0 text-amarelo-300"
            />
            Pronto, o curso é seu
          </h2>
          <p class="mt-4 text-[17px] leading-[1.6] text-giz-apagado">
            {{ purchasesCopy.order(order.id) }} · {{ purchasesCopy.paymentMethod[order.method] }}{{ order.installments && order.installments > 1 ? ` em ${order.installments}x` : '' }} · {{ brl(order.amount) }}
          </p>
          <p class="mt-2 text-[17px] leading-[1.6] text-giz-apagado">
            O acesso é vitalício: as aulas ficam em Meus cursos, e o pedido, em Conta.
          </p>
          <ButtonLink
            v-if="firstLesson"
            :href="`/aprender/${slug}/${firstLesson.slug}`"
            variant="chalk"
            offset="board"
            class="mt-8 h-14 w-full text-[17px] sm:w-auto"
          >
            <Play
              aria-hidden="true"
              fill="currentColor"
              :stroke-width="0"
              class="size-4"
            />
            Assistir à primeira aula
          </ButtonLink>
        </Board>
        <div
          v-else-if="owned"
          class="rounded-card border border-line bg-surface p-6 shadow-(--shadow-raised) sm:p-8"
        >
          <h2 class="font-heading text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
            Você já tem este curso
          </h2>
          <p class="mt-3 text-[16px] leading-[1.6] text-ink-tertiary">
            Não precisa comprar de novo: é só continuar.
          </p>
          <ButtonLink
            :href="`/aprender/${slug}`"
            class="mt-6"
          >
            Continuar curso
          </ButtonLink>
        </div>
        <section
          v-else
          aria-labelledby="pagamento-title"
          class="flex flex-col gap-6"
        >
          <p class="flex flex-wrap items-center gap-x-2 rounded-card border border-line bg-surface px-4 py-3 text-[15px] text-ink-tertiary">
            <Check
              aria-hidden="true"
              :stroke-width="3"
              class="size-4 text-ink-accent"
            />
            Comprando como <strong class="text-ink">{{ user.name }}</strong>
            <span class="text-ink-muted">({{ user.email }})</span>
          </p>
          <h2
            id="pagamento-title"
            class="font-heading text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[30px]"
          >
            Pagamento
          </h2>
          <PaymentForm
            :course-slug="slug"
            :price="brl(detail.pricing.price)"
            :pix-price="terms.pix"
            :pix-discount="terms.pixDiscount"
            :installment-options="installmentOptions"
          />
        </section>
      </div>

      <!-- Resumo do pedido: o curso, o preço e o que vem junto. -->
      <div class="mt-12 lg:col-span-5 lg:mt-0">
        <aside
          aria-label="Resumo do pedido"
          class="overflow-hidden rounded-card border border-line bg-surface shadow-(--shadow-raised) lg:sticky lg:top-24"
        >
          <span
            aria-hidden="true"
            class="block h-3 bg-amarelo-300"
          />
          <div class="p-6">
            <p class="flex items-center gap-2 text-[14px] font-bold text-ink-tertiary">
              <component
                :is="icon"
                aria-hidden="true"
                class="size-4"
              />
              {{ areaLabel[course.area] }}
            </p>
            <p class="mt-2 font-heading text-[22px] font-bold leading-[1.2] tracking-[-0.015em] text-ink">
              {{ course.title }}
            </p>
            <dl class="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 border-t border-line pt-5 text-[15px] tabular-nums">
              <dt class="text-ink-tertiary">
                No cartão
              </dt>
              <dd class="text-right font-bold text-ink">
                {{ brl(detail.pricing.price) }}
              </dd>
              <dt class="text-ink-tertiary">
                Parcelado
              </dt>
              <dd class="text-right text-ink-secondary">
                {{ terms.installments.replace(' sem juros', '') }}
              </dd>
              <dt class="text-ink-tertiary">
                No Pix ({{ terms.pixDiscount }})
              </dt>
              <dd class="text-right font-bold text-ink">
                {{ terms.pix }}
              </dd>
            </dl>
            <ul class="mt-5 flex flex-col gap-2 border-t border-line pt-5">
              <li
                v-for="perk in perks"
                :key="perk"
                class="flex items-center gap-2 text-[15px] text-ink-tertiary"
              >
                <Check
                  aria-hidden="true"
                  :stroke-width="2.5"
                  class="size-4 shrink-0 text-ink-accent"
                />
                {{ perk }}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
