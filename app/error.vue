<!--
  404 de endereços inexistentes e de `createError({ statusCode: 404 })` (ex.: curso que não existe).
  Fica fora dos layouts, então monta header e rodapé por conta própria.
-->
<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{ error: NuxtError }>()

const notFound = computed(() => error.statusCode === 404)

useSeoMeta({
  title: () => (notFound.value ? 'Página não encontrada' : undefined),
  robots: 'noindex',
})
</script>

<template>
  <SiteShell>
    <section
      v-if="notFound"
      aria-labelledby="not-found-title"
      :class="cn(container, 'pb-28 pt-16 sm:pb-36 sm:pt-24 lg:pb-40 lg:pt-32')"
    >
      <p class="font-heading text-[20px] font-bold text-ink-muted">
        Erro 404
      </p>
      <h1
        id="not-found-title"
        class="mt-3 font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]"
      >
        Página não encontrada
      </h1>
      <p class="mt-6 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-ink-tertiary sm:text-[18px]">
        O endereço pode ter mudado ou o conteúdo não existe mais. Confira o link ou siga por um dos caminhos abaixo.
      </p>
      <div class="mt-10 flex flex-wrap items-center gap-3">
        <ButtonLink href="/">
          Ir para a página inicial
        </ButtonLink>
        <ButtonLink
          href="/cursos"
          variant="secondary"
        >
          Ver todos os cursos
        </ButtonLink>
      </div>
    </section>
    <!-- The reference app has no page for other errors, so this one only names the error. -->
    <section
      v-else
      :class="cn(container, 'py-16')"
    >
      <h1 class="font-heading text-[40px] font-bold text-ink">
        Erro {{ error.statusCode }}
      </h1>
    </section>
  </SiteShell>
</template>
