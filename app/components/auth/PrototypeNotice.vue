<!-- Aviso de que a ação ainda não está conectada a um backend. -->
<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
</script>

<template>
  <p
    role="status"
    class="flex items-start gap-2 rounded-control bg-warning-100 px-3.5 py-3 text-[15px] leading-[22px] text-warning-500"
  >
    <TriangleAlert
      aria-hidden="true"
      class="mt-[3px] size-4 shrink-0"
    />
    <span><slot /></span>
  </p>
</template>
