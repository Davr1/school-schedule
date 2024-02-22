import { Week } from "@/request";

/**
 * Get the week date (Sunday) for the given week
 * @param week The week to get the date for
 */
export function getWeek(week: Week.Current | Week.Next): Date {
    const sunday = new Date();
    sunday.setDate(sunday.getDate() - sunday.getDay());

    if (week === Week.Next) sunday.setDate(sunday.getDate() + 7);

    return sunday;
}
