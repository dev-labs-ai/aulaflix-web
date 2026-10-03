<!-- Aba "Dados da conta" de /conta: nome, e-mail e senha. -->
<script setup lang="ts">
import { settingsCopy as copy } from '#shared/content/account'

useSeoMeta({ title: copy.title, description: copy.description })

const { data: user } = await useSessionUser()
</script>

<template>
  <SettingsCard
    v-if="user"
    :user="user"
  />
</template>
