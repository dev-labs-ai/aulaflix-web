<!--
  Entrada do curso para quem já tem: leva à aula onde o aluno parou. Tudo acontece no middleware, então a página
  em si nunca aparece.
-->
<script setup lang="ts">
import { getCourse } from '#shared/content/courses'

definePageMeta({
  // Só os cursos conhecidos existem; qualquer outro slug vira 404, antes mesmo de pedir para entrar.
  validate: route => Boolean(getCourse(String(route.params.curso))),
  middleware: [
    'auth',
    // Wrapped so that Nuxt keeps its context across the `await`, which `navigateTo` needs.
    defineNuxtRouteMiddleware(async (to) => {
      const course = String(to.params.curso)
      const enrollment = await useRequestFetch()(`/api/courses/${course}/enrollment`)
      // Quem não tem o curso vai para a página de venda.
      const target = enrollment.owned ? `/aprender/${course}/${enrollment.resume}` : `/cursos/${course}`
      return navigateTo(target, { redirectCode: 307 })
    }),
  ],
})
</script>

<template>
  <div />
</template>
