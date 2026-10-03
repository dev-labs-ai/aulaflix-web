<!-- Título e texto de apoio (`body`, ou o slot). `as="h2"` quando o fluxo fica dentro de outra página, como a de compra. -->
<script setup lang="ts">
const props = defineProps<{ title: string, body?: string, as?: 'h1' | 'h2' }>()
const tag = computed(() => props.as ?? 'h1')
</script>

<template>
  <div class="flex flex-col gap-3">
    <component
      :is="tag"
      :class="cn(
        'font-heading font-bold leading-[1.15] tracking-[-0.025em] text-ink',
        tag === 'h1' ? 'text-[32px] sm:text-[38px]' : 'text-[26px] sm:text-[30px]',
      )"
    >
      {{ title }}
    </component>
    <p
      v-if="body || $slots.default"
      class="text-[17px] leading-[1.6] text-ink-tertiary"
    >
      <slot>{{ body }}</slot>
    </p>
  </div>
</template>
