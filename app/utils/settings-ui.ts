// Class strings from the reference app's src/components/settings-card.tsx, shared by SettingsCard and NameEditor.

/** Botão só de texto do cartão de Conta ("Editar", "Salvar", "Cancelar"). */
export const settingsTextButton = (tone: 'accent' | 'muted') =>
  cn(
    '-my-1 rounded-control px-2 py-1 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50',
    tone === 'accent' ? 'text-ink-accent hover:text-ink-accent-hover' : 'text-ink-tertiary hover:text-ink',
  )

export const settingsValueText = 'block truncate text-[15px] text-ink'
