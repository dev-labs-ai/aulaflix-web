<!-- Rodapé do menu mobile com o usuário logado: nome, e-mail e Sair (os links da conta ficam no menu acima). -->
<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import { accountMenu } from '#shared/content/account'

defineProps<{ user: SessionUser }>()

const buttonClass
  = 'inline-flex h-11 w-full items-center justify-center gap-2 rounded-control border border-line bg-surface px-4 text-[15px] font-bold text-ink transition-colors hover:border-line-strong hover:bg-section'
</script>

<template>
  <div class="grid gap-3">
    <div class="flex items-center gap-2.5">
      <UserAvatar :user="user" />
      <div class="min-w-0">
        <p class="truncate text-[15px] font-bold text-ink">
          {{ user.name }}
        </p>
        <p class="truncate text-[14px] text-ink-muted">
          {{ user.email }}
        </p>
      </div>
    </div>
    <form @submit.prevent="signOut">
      <button
        type="submit"
        :class="buttonClass"
      >
        <LogOut
          aria-hidden="true"
          class="size-4"
        />
        {{ accountMenu.signOut }}
      </button>
    </form>
  </div>
</template>
