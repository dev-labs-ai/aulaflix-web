<!--
  Avisa o servidor de que a aula foi aberta. Fica num efeito, como no app de referência: lá, cookies só podem ser
  gravados em Server Functions, não durante a renderização da página. Não mostra nada.
-->
<script lang="ts">
export default defineComponent({
  props: {
    course: { type: String, required: true },
    lesson: { type: String, required: true },
  },
  setup(props) {
    const record = () => void recordVisit(props.course, props.lesson)
    onMounted(record)
    watch(() => [props.course, props.lesson], record)
    return () => null
  },
})
</script>
