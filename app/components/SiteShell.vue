<!-- Moldura das páginas públicas: header, conteúdo e rodapé. -->
<script setup lang="ts">
const { data: user } = await useSessionUser()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-canvas text-ink">
    <SiteHeader :user="user ?? null" />
    <EmailConfirmationNotice
      v-if="user && !user.verified"
      :email="user.email"
    />
    <!-- flex-1 empurra o rodapé para o fim da tela em páginas curtas, como a 404. -->
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
