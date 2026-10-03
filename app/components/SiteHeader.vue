<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { authCopy } from '#shared/content/auth'
import { mainNav } from '#shared/content/site'

// NuxtLink marks the link to the current page with aria-current="page"; the reference app's header doesn't,
// so the nav links pass `:aria-current="undefined"`.
const navLink = cn('rounded-control text-[16px] text-ink-secondary transition-colors hover:text-ink', focusRing, ringOffset.canvas)
const navBadge = 'ml-2 inline-flex rounded-full bg-amarelo-100 px-2 py-0.5 align-middle text-[12px] font-bold text-amarelo-700'

const route = useRoute()
const openPath = ref<string | null>(null)
// O menu fecha sozinho ao navegar, porque fica associado à rota em que foi aberto.
const open = computed(() => openPath.value === route.path)
const closeMenu = () => {
  openPath.value = null
}
const toggleMenu = () => {
  openPath.value = open.value ? null : route.path
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line-subtle bg-canvas/90 backdrop-blur">
    <div :class="cn(container, 'flex h-[72px] items-center justify-between')">
      <Logo />

      <nav
        aria-label="Principal"
        class="hidden items-center gap-8 md:flex"
      >
        <NuxtLink
          v-for="item in mainNav"
          :key="item.href"
          :to="item.href"
          :class="navLink"
          :aria-current="undefined"
        >
          {{ item.label }}<span
            v-if="item.badge"
            :class="navBadge"
          >{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <NuxtLink
          to="/entrar"
          :class="cn(
            'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-control bg-surface-accent px-5 text-[16px] font-bold text-ink-inverse transition-colors duration-150 hover:bg-surface-accent-hover',
            focusRing,
            ringOffset.canvas,
          )"
        >
          {{ authCopy.signIn.title }}
        </NuxtLink>
      </div>

      <button
        type="button"
        :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        class="inline-flex size-11 items-center justify-center rounded-control border border-line text-ink md:hidden"
        @click="toggleMenu"
      >
        <X
          v-if="open"
          aria-hidden="true"
          class="size-5"
        />
        <Menu
          v-else
          aria-hidden="true"
          class="size-5"
        />
      </button>
    </div>

    <div
      v-if="open"
      id="mobile-menu"
      class="border-t border-line-subtle bg-canvas md:hidden"
    >
      <div :class="cn(container, 'py-4')">
        <nav
          aria-label="Principal (mobile)"
          class="flex flex-col gap-1"
        >
          <NuxtLink
            v-for="item in mainNav"
            :key="item.href"
            :to="item.href"
            :class="cn(navLink, 'py-2.5 text-[17px]')"
            :aria-current="undefined"
            @click="closeMenu"
          >
            {{ item.label }}<span
              v-if="item.badge"
              :class="navBadge"
            >{{ item.badge }}</span>
          </NuxtLink>
        </nav>
        <div class="mt-3 border-t border-line-subtle pt-4">
          <NuxtLink
            to="/entrar"
            class="inline-flex h-12 w-full items-center justify-center rounded-control bg-surface-accent text-[16px] font-bold text-ink-inverse"
            @click="closeMenu"
          >
            {{ authCopy.signIn.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
