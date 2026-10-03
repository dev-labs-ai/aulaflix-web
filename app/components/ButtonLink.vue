<!-- Link com cara de botão; os demais atributos (como `href`) vão para o NuxtLink. -->
<script setup lang="ts">
const { variant = 'primary', offset = 'canvas' } = defineProps<{
  variant?: ButtonVariant
  offset?: Offset
}>()
</script>

<template>
  <NuxtLink :class="buttonClass(variant, offset)">
    <slot />
  </NuxtLink>
</template>
