<!-- Texto com o trecho do meio em negrito, ex.: "Mandamos um novo código para **email**." -->
<script setup lang="ts">
const { parts, inherit = false } = defineProps<{ parts: readonly [string, string, string], inherit?: boolean }>()
</script>

<template>
  {{ parts[0] }}<strong :class="cn('font-bold', !inherit && 'text-ink')">{{ parts[1] }}</strong>{{ parts[2] }}
</template>
