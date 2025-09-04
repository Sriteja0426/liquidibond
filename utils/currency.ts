import { Currency } from '../types';

export const formatCurrency = (value: number, currency: Currency): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  // Adjust for locales where Intl might not be perfect
  let locale = 'en-US';
  if (currency === 'INR') locale = 'en-IN';
  if (currency === 'EUR') locale = 'de-DE'; // Using German locale for Euro formatting

  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (e) {
    // Fallback for unsupported currencies
    const prefix = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';
    return `${prefix}${value.toFixed(2)}`;
  }
};
