export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) amount = 0;
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount);
}
