/**
 * Formats a numeric amount to an INR currency string.
 * Example: 12345.67 => "₹12,345.67"
 * Handles undefined, null, or 0 values gracefully.
 * @param amount The numeric amount to format.
 * @returns A string representing the amount in INR, or '-' if the amount is not valid.
 */
export const formatToINR = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
        return '-';
    }
    return Number(amount).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}; 