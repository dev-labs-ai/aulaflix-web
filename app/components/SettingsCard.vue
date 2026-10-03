<!-- Cartão da aba "Dados da conta": nome (editável), e-mail e a troca de senha simulada. -->
<script setup lang="ts">
import { settingsCopy as copy } from '#shared/content/account'

defineProps<{ user: SessionUser }>()

const editingName = ref(false)
const changingPassword = ref(false)
</script>

<template>
  <div class="mt-8 max-w-[640px] divide-y divide-line rounded-card border border-line bg-surface shadow-(--shadow-raised)">
    <NameEditor
      v-if="editingName"
      :current="user.name"
      @close="editingName = false"
    />
    <SettingsRow
      v-else
      :label="copy.name"
    >
      <template #value>
        <span :class="settingsValueText">{{ user.name }}</span>
      </template>
      <template #aside>
        <button
          type="button"
          :class="settingsTextButton('accent')"
          @click="editingName = true"
        >
          {{ copy.edit }}
        </button>
      </template>
    </SettingsRow>

    <SettingsRow :label="copy.email">
      <template #value>
        <span :class="settingsValueText">{{ user.email }}</span>
      </template>
    </SettingsRow>

    <SettingsRow :label="copy.password">
      <template #aside>
        <button
          v-if="changingPassword"
          type="button"
          :class="settingsTextButton('accent')"
          @click="changingPassword = false"
        >
          {{ copy.cancel }}
        </button>
        <button
          v-else
          type="button"
          :class="cn(
            'inline-flex h-10 items-center rounded-control border border-line bg-surface px-4 text-[15px] font-bold text-ink transition-colors hover:border-line-strong hover:bg-section',
            focusRing,
            ringOffset.canvas,
          )"
          @click="changingPassword = true"
        >
          {{ copy.changePassword }}
        </button>
      </template>
      <div
        v-if="changingPassword"
        class="px-6 pb-6"
      >
        <!-- Protótipo: o "envio" do código é imediato e qualquer código de 6 dígitos é aceito. -->
        <div class="flex max-w-[440px] flex-col gap-5">
          <p class="text-[16px] leading-[1.6] text-ink-tertiary">
            <Emphasis :parts="copy.codeSent(user.email)" />
          </p>
          <NewPasswordForm
            :email="user.email"
            :submit-label="copy.savePassword"
          >
            <template #saved-notice>
              {{ copy.passwordSavedNotice }}
            </template>
          </NewPasswordForm>
        </div>
      </div>
    </SettingsRow>
  </div>
</template>
