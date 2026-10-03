/**
 * Validação de formulário no estilo da referência: o erro de um campo aparece
 * quando ele perde o foco já preenchido, ou em todos os campos depois do primeiro envio.
 * `values` and `errors` are getters, so the errors follow what the user types.
 */
export function useFieldValidation<T extends Record<string, string>>(
  values: () => T,
  errors: () => Partial<Record<keyof T, string>>,
) {
  const touched = ref<Partial<Record<keyof T, boolean>>>({})
  const submitted = ref(false)

  return {
    errorFor: (field: keyof T) => (submitted.value || touched.value[field] ? errors()[field] : undefined),
    /** Call it when the field loses focus. */
    touch: (field: keyof T) => {
      if (values()[field] && !touched.value[field]) touched.value = { ...touched.value, [field]: true }
    },
    /** Marca o formulário como enviado e diz se ele é válido. */
    submit: () => {
      submitted.value = true
      return Object.values(errors()).every(error => !error)
    },
  }
}
