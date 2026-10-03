/**
 * Contagem regressiva para liberar o "Pedir outro código". It ticks once a second while it runs, from the
 * moment the form mounts, so the server never starts a timer.
 */
export function useResendCountdown(seconds: number) {
  const deadline = ref(Date.now() + seconds * 1000)
  const now = ref(Date.now())
  const remaining = computed(() => Math.max(0, Math.ceil((deadline.value - now.value) / 1000)))

  onMounted(() => {
    watchEffect((onCleanup) => {
      if (remaining.value === 0) return
      const timer = setInterval(() => {
        now.value = Date.now()
      }, 1000)
      onCleanup(() => clearInterval(timer))
    })
  })

  return reactive({
    remaining,
    label: computed(() => `${Math.floor(remaining.value / 60)}:${String(remaining.value % 60).padStart(2, '0')}`),
    restart: () => {
      const start = Date.now()
      now.value = start
      deadline.value = start + seconds * 1000
    },
  })
}
