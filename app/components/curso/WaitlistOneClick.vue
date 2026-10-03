<!--
  Lista de espera na lousa, para quem entrou na conta: um clique, com o e-mail da conta.
  Protótipo: a inscrição fica num cookie e nenhum aviso é enviado.
-->
<script setup lang="ts">
const { courseSlug } = defineProps<{ courseSlug: string, email: string, joined: boolean }>()

const pending = ref(false)

async function join() {
  pending.value = true
  try {
    await joinWaitlist(courseSlug)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <Confirmed
    v-if="joined"
    :email="email"
  >
    <form
      class="mt-4"
      @submit.prevent="leaveWaitlist(courseSlug)"
    >
      <button
        type="submit"
        :class="cn(
          'rounded-control text-[15px] font-bold text-giz-apagado underline decoration-2 underline-offset-4 transition-colors hover:text-giz',
          focusRing,
          ringOffset.board,
        )"
      >
        Não quero mais ser avisado
      </button>
    </form>
  </Confirmed>
  <template v-else>
    <p class="max-w-[52ch] text-[17px] leading-[1.6] text-giz-apagado">
      O curso ainda está em produção. Com um clique, avisamos em <strong class="text-giz">{{ email }}</strong> quando
      as inscrições abrirem.
    </p>
    <form
      class="mt-6"
      @submit.prevent="join"
    >
      <ChalkSubmit
        :pending="pending"
        pending-label="Inscrevendo…"
      >
        Avise-me
      </ChalkSubmit>
    </form>
  </template>
</template>
