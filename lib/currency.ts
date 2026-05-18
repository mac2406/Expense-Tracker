/**
 * Formats a numeric value into a premium Canadian Dollar representation (CAD)
 * Example: 1250.5 -> $1,250.50
 */
export function formatCAD(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a numeric value as a percentage
 * Example: 0.85 -> 85%
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}
