<!-- Redefinição de senha por código enviado ao e-mail. Página isolada, sem header/rodapé do site. -->
<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Redefinir senha' })

// Quem já está logado segue para a página inicial (307, like Next's redirect()).
const { data: user } = await useSessionUser()
if (user.value) await navigateTo('/', { redirectCode: 307, replace: true })
</script>

<template>
  <AuthPageShell>
    <PasswordResetFlow />
  </AuthPageShell>
</template>
