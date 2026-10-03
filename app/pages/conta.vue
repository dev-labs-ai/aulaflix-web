<!--
  /conta e suas abas: dados da conta e compras, cada uma numa página filha. Só para quem está logado: o middleware
  daqui vale para as duas abas, as each page's `requireUser()` did in the reference app.
-->
<script setup lang="ts">
import { accountCopy } from '#shared/content/account'

definePageMeta({ middleware: 'auth' })
</script>

<template>
  <AccountPage
    id="conta-title"
    :title="accountCopy.title"
  >
    <AccountTabs />
    <NuxtPage />
  </AccountPage>
</template>
