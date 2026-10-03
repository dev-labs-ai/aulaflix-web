<!-- Avatar com menu suspenso da conta (desktop). -->
<script setup lang="ts">
import { BookOpen, ChevronDown, CircleUser, LogOut, type LucideIcon } from '@lucide/vue'
import { accountMenu, type AccountIcon } from '#shared/content/account'

defineProps<{ user: SessionUser }>()

const accountIcons: Record<AccountIcon, LucideIcon> = {
  'book-open': BookOpen,
  'circle-user': CircleUser,
}

const itemClass
  = 'flex w-full items-center gap-2.5 rounded-control px-3 py-2.5 text-left text-[15px] text-ink-secondary transition-colors hover:bg-section focus-visible:bg-section focus-visible:outline-none'
const itemIconClass = 'size-[18px] shrink-0 text-ink-tertiary'

const open = ref(false)
const root = useTemplateRef('root')
const trigger = useTemplateRef('trigger')

function onMouseDown(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  open.value = false
  trigger.value?.focus()
}

watch(open, (isOpen, _, onCleanup) => {
  if (!isOpen) return
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('keydown', onKeyDown)
  onCleanup(() => {
    document.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('keydown', onKeyDown)
  })
})

const close = () => {
  open.value = false
}
</script>

<template>
  <div
    ref="root"
    class="relative"
  >
    <button
      ref="trigger"
      type="button"
      :aria-label="accountMenu.open"
      aria-haspopup="menu"
      :aria-expanded="open"
      :class="cn(
        'inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-surface pl-1.5 pr-2.5 transition-colors hover:bg-section',
        focusRing,
        ringOffset.canvas,
      )"
      @click="open = !open"
    >
      <UserAvatar :user="user" />
      <ChevronDown
        aria-hidden="true"
        class="size-4 text-ink-muted"
      />
    </button>

    <div
      v-if="open"
      role="menu"
      :aria-label="accountMenu.label"
      class="absolute right-0 top-[calc(100%+8px)] z-50 w-[272px] rounded-card bg-surface-raised p-2 shadow-(--shadow-pop)"
    >
      <div class="border-b border-line-subtle px-3 pb-3 pt-2.5">
        <p class="truncate text-[15px] font-bold text-ink">
          {{ user.name }}
        </p>
        <p class="truncate text-[14px] text-ink-muted">
          {{ user.email }}
        </p>
      </div>
      <div class="flex flex-col pt-1.5">
        <!-- Like the header nav, the reference app marks no link here as current. -->
        <NuxtLink
          v-for="link in accountMenu.links"
          :key="link.href"
          :to="link.href"
          role="menuitem"
          :class="itemClass"
          :aria-current="undefined"
          @click="close"
        >
          <component
            :is="accountIcons[link.icon]"
            aria-hidden="true"
            :class="itemIconClass"
          />
          {{ link.label }}
        </NuxtLink>
      </div>
      <div class="mt-1.5 border-t border-line-subtle pt-1.5">
        <form @submit.prevent="signOut">
          <button
            type="submit"
            role="menuitem"
            :class="itemClass"
          >
            <LogOut
              aria-hidden="true"
              :class="itemIconClass"
            />
            {{ accountMenu.signOut }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
