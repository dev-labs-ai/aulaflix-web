<script setup lang="ts">
import { areaLabel, areas, courses, type CourseArea, type CourseStatus } from '#shared/content/courses'
import { site } from '#shared/content/site'

useHead({ title: 'Cursos' })

/** Valor de `?situacao=` para cada status, o rótulo do filtro e como o status entra numa frase. */
const statusFilters: Record<CourseStatus, { slug: string, label: string, phrase: string }> = {
  'on-sale': { slug: 'a-venda', label: 'À venda', phrase: 'à venda' },
  'waitlist': { slug: 'em-breve', label: 'Em breve', phrase: 'na lista de espera' },
}

const statuses = Object.keys(statusFilters) as CourseStatus[]

type Filters = { area: CourseArea | null, status: CourseStatus | null }

function filtersHref({ area, status }: Filters) {
  const query = new URLSearchParams()
  if (area) query.set('area', area)
  if (status) query.set('situacao', statusFilters[status].slug)
  const search = query.toString()
  return search ? `/cursos?${search}` : '/cursos'
}

const route = useRoute()

/** Lê os filtros da URL; valores desconhecidos (ou repetidos) contam como "Todas". */
const filters = computed<Filters>(() => ({
  area: areas.find(a => a === route.query.area) ?? null,
  status: statuses.find(s => statusFilters[s].slug === route.query.situacao) ?? null,
}))

const results = computed(() =>
  courses.filter(
    course => (!filters.value.area || course.area === filters.value.area)
      && (!filters.value.status || course.status === filters.value.status),
  ),
)

/** Uma linha de filtros por grupo: o rótulo e um link por opção, com a escolhida preenchida. */
const filterGroups = computed(() => [
  {
    id: 'filtro-area',
    label: 'Área',
    options: [null, ...areas].map(area => ({
      label: area ? areaLabel[area] : 'Todas',
      href: filtersHref({ ...filters.value, area }),
      selected: filters.value.area === area,
    })),
  },
  {
    id: 'filtro-situacao',
    label: 'Situação',
    options: [null, ...statuses].map(status => ({
      label: status ? statusFilters[status].label : 'Todas',
      href: filtersHref({ ...filters.value, status }),
      selected: filters.value.status === status,
    })),
  },
])

/** Nenhum curso com os dois filtros juntos: oferece ver todos os cursos da área escolhida. */
const empty = computed(() => {
  const area = filters.value.area ? areaLabel[filters.value.area] : null
  const status = filters.value.status ? statusFilters[filters.value.status].phrase : null
  return {
    body: area && status ? `Ainda não há cursos de ${area} ${status}.` : 'Nenhum curso corresponde a esses filtros.',
    href: filtersHref({ area: filters.value.area, status: null }),
    link: area ? `Ver todos os cursos de ${area}` : 'Ver todos os cursos',
  }
})
</script>

<template>
  <div :class="cn(container, 'pb-24 pt-14 sm:pb-32 sm:pt-20 lg:pt-24')">
    <h1 class="font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]">
      Todos os cursos
    </h1>
    <p class="mt-5 max-w-[70ch] text-pretty text-[17px] leading-[1.6] text-ink-tertiary sm:text-[18px]">
      Conheça os cursos do {{ site.name }}: os que já estão à venda e os que estão chegando.
    </p>

    <nav
      aria-label="Filtrar cursos"
      class="mt-10 space-y-4 border-y border-line py-6 sm:mt-12"
    >
      <div
        v-for="group in filterGroups"
        :key="group.id"
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
      >
        <p
          :id="group.id"
          class="w-20 shrink-0 text-[14px] font-bold text-ink-muted"
        >
          {{ group.label }}
        </p>
        <ul
          :aria-labelledby="group.id"
          class="flex flex-wrap gap-2"
        >
          <li
            v-for="option in group.options"
            :key="option.label"
          >
            <!-- Changing only the query keeps the scroll position (Nuxt's default), like scroll={false} in the reference app. -->
            <NuxtLink
              :to="option.href"
              :aria-current="option.selected ? 'true' : undefined"
              :class="cn(
                'inline-flex h-11 items-center rounded-full border px-4 text-[15px] font-bold transition-colors',
                option.selected
                  ? 'border-surface-accent bg-surface-accent text-ink-inverse'
                  : 'border-line bg-surface text-ink-secondary hover:border-line-strong hover:text-ink',
                focusRing,
                ringOffset.canvas,
              )"
            >
              {{ option.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Fica sempre na página, para leitores de tela anunciarem a nova contagem ao trocar o filtro. -->
    <p
      role="status"
      class="mt-8 text-[15px] text-ink-muted"
    >
      {{ results.length === 1 ? '1 curso' : `${results.length} cursos` }}
    </p>

    <CourseCards
      v-if="results.length > 0"
      :courses="results"
      label="Cursos"
      class="mt-5"
    />
    <div
      v-else
      class="mt-5 rounded-card border border-dashed border-line-strong px-6 py-12 text-center"
    >
      <p class="font-heading text-[22px] font-bold leading-[1.2] tracking-[-0.015em] text-ink">
        Nenhum curso por aqui ainda.
      </p>
      <p class="mx-auto mt-3 max-w-[52ch] text-[16px] leading-[1.6] text-ink-tertiary">
        {{ empty.body }}
      </p>
      <!-- vue-router ignores the query, so NuxtLink would mark this link as the current page. -->
      <NuxtLink
        :to="empty.href"
        :aria-current="undefined"
        :class="cn(
          'mt-6 inline-block rounded-control text-[16px] font-bold text-ink-accent underline decoration-2 underline-offset-4 transition-colors hover:text-ink-accent-hover',
          focusRing,
          ringOffset.canvas,
        )"
      >
        {{ empty.link }}
      </NuxtLink>
    </div>
  </div>
</template>
