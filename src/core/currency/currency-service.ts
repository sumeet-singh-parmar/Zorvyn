import { CURRENCIES, type CurrencyInfo } from './currency-data';

export function getCurrencyInfo(code: string): CurrencyInfo {
  return CURRENCIES[code] ?? CURRENCIES['INR'];
}

export function formatCurrency(amount: number, currencyCode: string = 'INR'): string {
  const info = getCurrencyInfo(currencyCode);

  const fixed = Math.abs(amount).toFixed(info.decimals);
  const [intPart, decPart] = fixed.split('.');

  // Indian numbering system for INR (1,23,456.78)
  let formattedInt: string;
  if (currencyCode === 'INR' && intPart.length > 3) {
    const lastThree = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    formattedInt = rest.replace(/\B(?=(\d{2})+(?!\d))/g, info.groupSeparator) + info.groupSeparator + lastThree;
  } else {
    formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, info.groupSeparator);
  }

  const formattedAmount = info.decimals > 0
    ? `${formattedInt}${info.decimalSeparator}${decPart}`
    : formattedInt;

  const sign = amount < 0 ? '-' : '';

  return info.symbolPosition === 'before'
    ? `${sign}${info.symbol}\u200A${formattedAmount}`
    : `${sign}${formattedAmount}\u200A${info.symbol}`;
}

export function formatCompactCurrency(amount: number, currencyCode: string = 'INR'): string {
  const info = getCurrencyInfo(currencyCode);
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  let compact: string;
  if (abs >= 10_000_000) {
    compact = `${(abs / 10_000_000).toFixed(1)}Cr`;
  } else if (abs >= 100_000) {
    compact = `${(abs / 100_000).toFixed(1)}L`;
  } else if (abs >= 1_000) {
    compact = `${(abs / 1_000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount, currencyCode);
  }

  return `${sign}${info.symbol}\u200A${compact}`;
}
