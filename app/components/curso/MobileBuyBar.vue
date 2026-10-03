<!--
  Barra de compra presa ao pé da tela no celular. Só aparece depois que o elemento `watchId`
  (os botões de compra da lousa) sai da tela por cima.
  É `sticky`, e não `fixed`: no fim da página ela para no lugar dela, acima do rodapé, sem cobri-lo.
-->
<script setup lang="ts">
const { watchId } = defineProps<{
  watchId: string
  buyHref: string
  price: string
  installments: string
}>()

const visible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const target = document.getElementById(watchId)
  if (!target) return
  observer = new IntersectionObserver(([entry]) => {
    visible.value = Boolean(entry && !entry.isIntersecting && entry.boundingClientRect.top < 0)
  })
  observer.observe(target)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    :inert="!visible"
    :class="cn(
      'sticky bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur transition-transform duration-200 motion-reduce:transition-none lg:hidden',
      !visible && 'translate-y-full',
    )"
  >
    <div :class="cn(container, 'flex items-center justify-between gap-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]')">
      <div class="min-w-0">
        <p class="font-heading text-[22px] font-extrabold leading-tight tracking-[-0.02em] tabular-nums text-ink">
          {{ price }}
        </p>
        <p class="truncate text-[14px] tabular-nums text-ink-muted">
          {{ installments }}
        </p>
      </div>
      <ButtonLink
        :href="buyHref"
        class="shrink-0"
      >
        Comprar
      </ButtonLink>
    </div>
  </div>
</template>
