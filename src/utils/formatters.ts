/**
 * Format a number with K/M/B suffixes for large values
 * @param num - The number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format a number with locale-specific thousands separators
 * @param num - The number to format
 * @returns Formatted string with commas (e.g., "1,234,567")
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Format a date string with time to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date with time (e.g., "Jan 15, 2024, 3:45 PM")
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
}
