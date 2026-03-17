export function createCurrencyFormatter() {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

export function formatMoney(formatter, value) {
  return formatter.format(Number(value || 0))
}
