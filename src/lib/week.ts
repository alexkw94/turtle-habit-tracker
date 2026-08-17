import { dateKey, startOfWeek, weekDays, weekKey, weekdayIndex } from './date';

/** The Monday-to-Sunday window every screen reads from. */
export interface WeekContext {
  days: Date[];
  /** Storage key per day, aligned with `days`. */
  keys: string[];
  /** Index of the current day; anything after it is still in the future. */
  todayIndex: number;
  /** Storage key for the week itself. */
  key: string;
}

export function buildWeek(today: Date): WeekContext {
  const days = weekDays(startOfWeek(today));
  return {
    days,
    keys: days.map(dateKey),
    todayIndex: weekdayIndex(today),
    key: weekKey(today),
  };
}
