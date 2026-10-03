<!--
  Área da lista de aulas que rola por dentro no desktop. Ao abrir a aula, centraliza a aula atual
  (`aria-current="page"`) mexendo só na rolagem da lista, nunca na da página.
-->
<script setup lang="ts">
const { current } = defineProps<{ current: string }>()

const list = useTemplateRef('list')

function scrollToCurrent() {
  const el = list.value
  const row = el?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!el || !row || el.scrollHeight <= el.clientHeight) return
  const offset = row.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
  el.scrollTop = offset - (el.clientHeight - row.offsetHeight) / 2
}

// Só quando a aula muda: marcar como concluída não deve mexer na rolagem da lista.
onMounted(scrollToCurrent)
watch(() => current, scrollToCurrent, { flush: 'post' })
</script>

<template>
  <div ref="list">
    <slot />
  </div>
</template>
