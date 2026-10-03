<!--
  Entrar e criar conta, numa tela só que começa pelo e-mail. Página isolada, sem header/rodapé
  do site. `?next=/caminho` define para onde o usuário vai depois.
-->
<script setup lang="ts">
import { authCopy } from '#shared/content/auth'

definePageMeta({ layout: false })
useHead({ title: authCopy.signIn.title })

const route = useRoute()
const next = safeNextPath(route.query.next)

// Na tela de entrar, quem já está logado segue direto para o destino (307, like Next's redirect()).
const { data: user } = await useSessionUser()
if (user.value) await navigateTo(next, { redirectCode: 307, replace: true })
</script>

<template>
  <AuthPageShell>
    <EntryFlow :next="next" />
  </AuthPageShell>
</template>
