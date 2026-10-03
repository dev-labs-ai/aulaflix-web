<!-- Moldura das páginas públicas: header, conteúdo e rodapé. -->
<template>
  <div class="flex min-h-screen flex-col bg-canvas text-ink">
    <SiteHeader />
    <!-- flex-1 empurra o rodapé para o fim da tela em páginas curtas, como a 404. -->
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
