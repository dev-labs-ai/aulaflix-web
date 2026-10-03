<!-- Página isolada, sem header/rodapé do site: só o logo e o conteúdo centralizado. -->
<template>
  <div class="min-h-screen bg-canvas text-ink">
    <main class="flex justify-center px-4 pb-24 pt-6 sm:pt-16">
      <div class="flex w-full max-w-[440px] flex-col gap-6 sm:gap-7">
        <!-- `flex` evita a linha de texto implícita em volta do link, que somaria altura. -->
        <div class="flex self-start pb-3">
          <Logo />
        </div>
        <slot />
      </div>
    </main>
  </div>
</template>
