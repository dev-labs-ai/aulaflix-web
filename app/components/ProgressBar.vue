<!-- Barra de andamento de um curso (0 a 100%). -->
<script setup lang="ts">
defineProps<{ value: number, label: string }>()
</script>

<template>
  <div
    role="progressbar"
    :aria-label="label"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="value"
    class="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
  >
    <div
      class="h-full rounded-full bg-lousa-400"
      :style="{ width: `${value}%` }"
    />
  </div>
</template>
