<!--
  Entrar e criar conta numa tela só: o e-mail vem primeiro e o servidor diz se já existe conta.
  Com conta, pede a senha; sem conta, pede nome e senha e cria a conta na hora.
  Google e GitHub ainda não têm backend e só mostram um aviso.
  `heading="h2"` quando o fluxo fica dentro de outra página (a de compra), que já tem o h1.
-->
<script setup lang="ts">
const { next, heading = 'h1' } = defineProps<{ next: string, heading?: 'h1' | 'h2' }>()

const step = ref<'email' | 'password' | 'create'>('email')
const email = ref('')

const back = () => {
  step.value = 'email'
}
const onFound = (exists: boolean) => {
  step.value = exists ? 'password' : 'create'
}
</script>

<template>
  <PasswordStep
    v-if="step === 'password'"
    :email="email.trim()"
    :next="next"
    :heading="heading"
    @back="back"
  />
  <CreateAccountStep
    v-else-if="step === 'create'"
    :email="email.trim()"
    :next="next"
    :heading="heading"
    @back="back"
  />
  <EmailStep
    v-else
    v-model:email="email"
    :heading="heading"
    @found="onFound"
  />
</template>
