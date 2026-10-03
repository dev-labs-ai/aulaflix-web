<!--
  Marcar a aula como concluída (ou desfazer). O servidor grava o progresso e a página volta atualizada.
-->
<script setup lang="ts">
import { Check } from '@lucide/vue'

const { course, lesson, done } = defineProps<{ course: string, lesson: string, done: boolean }>()

const pending = ref(false)

async function submit() {
  pending.value = true
  try {
    await setLessonCompletion(course, lesson, !done)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <form
    class="flex flex-wrap items-center gap-x-4 gap-y-2"
    @submit.prevent="submit"
  >
    <p
      v-if="done"
      class="inline-flex h-12 items-center gap-2 rounded-control bg-lousa-100 px-4 text-[16px] font-bold text-lousa-500"
    >
      <Check
        aria-hidden="true"
        :stroke-width="3"
        class="size-4"
      />
      Aula concluída
    </p>
    <button
      v-if="done"
      type="submit"
      :disabled="pending"
      :class="cn(
        'rounded-control text-[15px] font-bold text-ink-tertiary underline decoration-2 underline-offset-4 transition-colors hover:text-ink disabled:opacity-60',
        focusRing,
        ringOffset.canvas,
      )"
    >
      {{ pending ? 'Salvando…' : 'Desmarcar' }}
    </button>
    <button
      v-else
      type="submit"
      :disabled="pending"
      :class="cn(buttonClass('primary'), 'disabled:opacity-60')"
    >
      <Check
        aria-hidden="true"
        :stroke-width="2.5"
        class="size-4"
      />
      {{ pending ? 'Salvando…' : 'Marcar como concluída' }}
    </button>
  </form>
</template>
