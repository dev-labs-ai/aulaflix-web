<!-- Como funciona: os passos em detalhe, a lista de espera e as dúvidas que valem para todos os cursos. -->
<script setup lang="ts">
import type { CourseTone } from '#shared/content/courses'
import { howItWorksCopy as copy, howItWorksSteps, platformFaq, waitlistInfo } from '#shared/content/how-it-works'

useSeoMeta({ title: copy.title, description: copy.description })

/** As mesmas cores dos passos na home. */
const stepTones: CourseTone[] = ['coral', 'amarelo', 'salvia']

const sectionTitle = 'font-heading text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[34px]'
</script>

<template>
  <div :class="cn(container, 'pb-24 pt-14 sm:pb-32 sm:pt-20 lg:pt-24')">
    <h1 class="font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]">
      {{ copy.title }}
    </h1>
    <p class="mt-5 max-w-[70ch] text-pretty text-[17px] leading-[1.6] text-ink-tertiary sm:text-[18px]">
      {{ copy.intro }}
    </p>

    <ol class="mt-12 border-t border-line sm:mt-16">
      <li
        v-for="(step, i) in howItWorksSteps"
        :key="step.title"
        class="grid gap-x-12 gap-y-5 border-b border-line py-10 sm:py-12 md:grid-cols-12"
      >
        <div class="flex items-start gap-5 md:col-span-5">
          <span
            aria-hidden="true"
            :class="cn(
              'inline-flex size-14 shrink-0 items-center justify-center rounded-full font-heading text-[26px] font-bold',
              toneClasses[stepTones[i]].soft,
              toneClasses[stepTones[i]].ink,
            )"
          >
            {{ i + 1 }}
          </span>
          <h2 :class="cn(sectionTitle, 'pt-2.5')">
            <span class="sr-only">{{ i + 1 }}. </span>{{ step.title }}
          </h2>
        </div>
        <p class="text-pretty text-[17px] leading-[1.7] text-ink-secondary sm:text-[18px] md:col-span-7 md:pt-3">
          {{ step.details }}
        </p>
      </li>
    </ol>

    <!-- Borda tracejada, como as fichas dos cursos em lista de espera. -->
    <section
      aria-labelledby="em-breve-title"
      class="mt-16 rounded-card border-2 border-dashed border-line-strong px-6 py-8 sm:mt-20 sm:px-10 sm:py-10"
    >
      <h2
        id="em-breve-title"
        :class="sectionTitle"
      >
        {{ waitlistInfo.title }}
      </h2>
      <p class="mt-5 max-w-[70ch] text-pretty text-[17px] leading-[1.7] text-ink-secondary sm:text-[18px]">
        {{ waitlistInfo.body }}
      </p>
      <NuxtLink
        to="/cursos?situacao=em-breve"
        :class="cn(
          'mt-6 inline-block rounded-control text-[16px] font-bold text-ink-accent underline decoration-2 underline-offset-4 transition-colors hover:text-ink-accent-hover',
          focusRing,
          ringOffset.canvas,
        )"
      >
        {{ waitlistInfo.link }}
      </NuxtLink>
    </section>

    <section
      aria-labelledby="duvidas-title"
      class="mt-20 sm:mt-24 lg:max-w-[760px]"
    >
      <h2
        id="duvidas-title"
        :class="sectionTitle"
      >
        Dúvidas frequentes
      </h2>
      <div class="mt-8">
        <FaqList :items="platformFaq" />
      </div>
    </section>

    <ButtonLink
      href="/cursos"
      class="mt-14"
    >
      Ver todos os cursos
    </ButtonLink>
  </div>
</template>
