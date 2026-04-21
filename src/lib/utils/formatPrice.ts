export const formatPrice = (amount: number, currency = 'BDT'): string => {
  if (currency === 'BDT') {
    return `৳${amount.toLocaleString('en-BD')}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDiscount = (price: number, compareAt: number): number => {
  return Math.round(((compareAt - price) / compareAt) * 100)
}
