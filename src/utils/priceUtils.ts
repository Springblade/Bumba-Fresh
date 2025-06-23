/**
 * Utility functions for price formatting and handling
 */

/**
 * Safely formats a price value to a fixed decimal string
 * Handles both string and number inputs from database
 * @param price - Price value (can be string or number)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export const formatPrice = (price: string | number, decimals: number = 2): string => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  return numericPrice.toFixed(decimals);
};

/**
 * Formats a price with currency symbol
 * @param price - Price value (can be string or number)
 * @param currency - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string with currency
 */
export const formatCurrency = (price: string | number, currency: string = '$', decimals: number = 2): string => {
  return `${currency}${formatPrice(price, decimals)}`;
};

/**
 * Safely converts a price to a number
 * @param price - Price value (can be string or number)
 * @returns Numeric price value
 */
export const parsePrice = (price: string | number): number => {
  return typeof price === 'number' ? price : parseFloat(price) || 0;
};
