<!-- Cabeçalho dos passos depois do e-mail: voltar, título e o e-mail escolhido. -->
<script setup lang="ts">
defineProps<{ title: string, body: readonly [string, string, string], heading: 'h1' | 'h2' }>()
defineEmits<{ back: [] }>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <BackLink @click="$emit('back')" />
    <AuthHeading
      :as="heading"
      :title="title"
    >
      <Emphasis :parts="body" />
    </AuthHeading>
  </div>
</template>
