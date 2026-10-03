<!-- Confirmação da lista de espera: o check é desenhado a giz e o e-mail ganha um traço amarelo. -->
<script setup lang="ts">
defineProps<{ email: string }>()
</script>

<template>
  <div :class="$style.success">
    <p class="flex items-start gap-3 text-[18px] leading-[1.55] text-giz">
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="cn('size-7 shrink-0 text-amarelo-300', $style.mark)"
      >
        <path
          d="M7 17 L 13 23 L 25 10"
          pathLength="100"
        />
      </svg>
      <span>
        Pronto! Vamos avisar em <span :class="cn('font-bold', $style.email)">{{ email }}</span> quando as inscrições
        abrirem.
      </span>
    </p>
    <slot />
  </div>
</template>

<style module>
/* Confirmação da lista de espera: o check é desenhado e o e-mail ganha um traço de giz. */

.success {
  animation: rise 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.mark path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.54s cubic-bezier(0.65, 0, 0.35, 1) 0.22s forwards;
}

.email {
  position: relative;
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.email::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 3px;
  border-radius: 2px;
  background: var(--color-amarelo-300);
  transform: scaleX(0);
  transform-origin: 0;
  animation: underline 0.52s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes underline {
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .success {
    opacity: 1;
    animation: none;
    transform: none;
  }
  .mark path {
    stroke-dashoffset: 0;
    animation: none;
  }
  .email::after {
    animation: none;
    transform: scaleX(1);
  }
}
</style>
