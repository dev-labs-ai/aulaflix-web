/** "R$ 1.797" para valores inteiros, "R$ 179,70" para valores com centavos. */
export function brl(value: number) {
  const cents = Math.round(value * 100);
  const fraction = cents % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(cents / 100);
}
