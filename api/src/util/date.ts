/**
 * Formats a date to a string in the format "YYYY-MM-DD"
 * @param date The date
 * @returns The date as a string
 */
export const formatDate = (date: Date): string => date.toISOString().split("T")[0];

/**
 * Today's date at 00:00:00 in UTC
 * @param date The date
 * @returns The date at 00:00:00 in UTC
 */
export const dayInUTC = (date: Date): Date => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

/**
 * Monday of the week of the date
 * @param date The date
 * @returns Monday of the week of the date
 */
export function mondayOfWeek(date: Date): Date {
    date = new Date(date);

    // We want the week to start on Monday
    const day = date.getDay();
    date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));

    return date;
}
