<script setup lang="ts">
import { areaLabel, areas, waitlistCourses, type CourseTone } from '#shared/content/courses'
import { howItWorksCopy, howItWorksSteps } from '#shared/content/how-it-works'

const sectionTitle = 'font-heading text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[42px]'
const textLink = cn(
  'rounded-control text-[16px] font-bold text-ink-accent underline decoration-2 underline-offset-4 transition-colors hover:text-ink-accent-hover',
  focusRing,
)

const stepTones: CourseTone[] = ['coral', 'amarelo', 'salvia']
</script>

<template>
  <div>
    <!-- A lousa do topo, com as áreas: cada botão abre o catálogo já filtrado. -->
    <section
      aria-labelledby="hero-title"
      :class="cn(container, 'pb-16 pt-6 sm:pb-20 sm:pt-10')"
    >
      <Board class="px-6 py-14 text-center sm:px-12 sm:py-20 lg:py-24">
        <h1
          id="hero-title"
          class="anim-giz mx-auto max-w-[900px] text-balance font-heading text-[38px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
        >
          Evolua como dev com cursos feitos para a prática.
        </h1>
        <p class="anim-surge mx-auto mt-7 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-giz-apagado sm:text-[20px]">
          Cursos online para desenvolvedores de software. Escolha o que quer aprender, assista quando quiser e
          volte às aulas sempre que precisar.
        </p>
        <nav
          aria-labelledby="areas-title"
          class="anim-surge anim-surge-tarde mt-10"
        >
          <h2
            id="areas-title"
            class="text-[15px] font-bold text-giz-apagado"
          >
            Escolha uma área
          </h2>
          <ul class="mx-auto mt-4 flex max-w-[1080px] flex-wrap justify-center gap-2.5 sm:gap-3">
            <li
              v-for="area in areas"
              :key="area"
            >
              <NuxtLink
                :to="`/cursos?area=${area}`"
                :class="cn(
                  'inline-flex h-12 items-center gap-2 rounded-full border-2 border-salvia-400 px-5 text-[16px] font-bold text-giz transition-colors hover:border-amarelo-300 hover:text-amarelo-300',
                  focusRing,
                  ringOffset.board,
                )"
              >
                <component
                  :is="areaIcons[area]"
                  aria-hidden="true"
                  class="size-[18px]"
                />
                {{ areaLabel[area] }}
              </NuxtLink>
            </li>
          </ul>
          <ButtonLink
            href="/cursos"
            variant="chalk"
            offset="board"
            class="mt-8"
          >
            Ver todos os cursos
          </ButtonLink>
        </nav>
      </Board>
    </section>

    <!--
      Resumo de "Como funciona" em três fichas pautadas (escolher, comprar uma vez e estudar no seu ritmo),
      com o link para a página que detalha cada passo e reúne as dúvidas.
    -->
    <section
      aria-labelledby="como-funciona-title"
      class="border-y border-line bg-section"
    >
      <div :class="cn(container, 'py-16 sm:py-24')">
        <header class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <h2
            id="como-funciona-title"
            :class="sectionTitle"
          >
            {{ howItWorksCopy.title }}
          </h2>
          <NuxtLink
            to="/como-funciona"
            :class="cn(textLink, ringOffset.section)"
          >
            Ver detalhes e dúvidas
          </NuxtLink>
        </header>
        <ol class="mt-10 grid gap-6 sm:mt-12 md:grid-cols-3 lg:gap-7">
          <li
            v-for="(step, i) in howItWorksSteps"
            :key="step.title"
            class="flex flex-col overflow-hidden rounded-card border border-line shadow-(--shadow-raised)"
          >
            <span
              aria-hidden="true"
              :class="cn('h-3 shrink-0', toneClasses[stepTones[i]].stripe)"
            />
            <!-- Texto em leading-7 e espaços múltiplos de 28px, para cair nas linhas da pauta. -->
            <div class="flex-1 pautado px-6 py-7">
              <p
                class="font-heading text-[40px] font-bold leading-[56px] text-lousa-400"
                aria-hidden="true"
              >
                {{ i + 1 }}
              </p>
              <h3 class="font-heading text-[22px] font-bold leading-7 tracking-[-0.015em] text-ink">
                <span class="sr-only">{{ i + 1 }}. </span>{{ step.title }}
              </h3>
              <p class="mt-7 text-[16px] leading-7 text-ink-tertiary">
                {{ step.summary }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Faixa curta com os cursos que estão chegando, cada um levando à própria página (e à lista de espera). -->
    <section
      aria-labelledby="em-breve-title"
      :class="cn(container, 'py-14 sm:py-20')"
    >
      <header class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2
          id="em-breve-title"
          class="font-heading text-[24px] font-bold tracking-[-0.02em] text-ink sm:text-[28px]"
        >
          Chegando em breve
        </h2>
        <NuxtLink
          to="/cursos?situacao=em-breve"
          :class="cn(textLink, ringOffset.canvas)"
        >
          Ver os cursos em breve
        </NuxtLink>
      </header>
      <ul class="mt-6 flex flex-wrap gap-3">
        <li
          v-for="course in waitlistCourses"
          :key="course.slug"
        >
          <NuxtLink
            :to="`/cursos/${course.slug}`"
            :class="cn(
              'inline-flex h-12 items-center gap-2.5 rounded-full border-2 border-dashed border-line-strong bg-surface pl-2 pr-5 text-[16px] font-bold text-ink transition-colors hover:border-lousa-300',
              focusRing,
              ringOffset.canvas,
            )"
          >
            <span
              aria-hidden="true"
              :class="cn('flex size-8 items-center justify-center rounded-full', toneClasses[course.tone].soft, toneClasses[course.tone].ink)"
            >
              <component
                :is="courseIcons[course.icon]"
                class="size-4"
              />
            </span>
            {{ course.title }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
