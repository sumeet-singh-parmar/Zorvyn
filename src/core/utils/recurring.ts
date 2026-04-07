/**
 * Convert a recurring amount at any frequency to its monthly equivalent.
 * Used to estimate monthly cost/income from recurring rules across the app.
 */
export function getMonthlyEquivalent(amount: number, frequency: string): number {
  if (frequency === 'monthly') return amount;
  if (frequency === 'weekly') return amount * 4.33;
  if (frequency === 'daily') return amount * 30;
  if (frequency === 'yearly') return amount / 12;
  return amount;
}
