import { addDays, dateKey, isoWeek, startOfWeek, weekDays, weekKey, weekdayIndex } from './date';

/** The Monday-to-Sunday window every screen reads from. */
export interface WeekContext {
  days: Date[];
  /** Storage key per day, aligned with `days`. */
  keys: string[];
  /** Last editable day. Past weeks are editable throughout. */
  todayIndex: number;
  /** Storage key for the week itself. */
  key: string;
  /** 0 = the running week, -1 = the one before it, and so on. */
  offset: number;
  isCurrent: boolean;
  number: number;
}

export function buildWeek(today: Date, offset = 0): WeekContext {
  const monday = addDays(startOfWeek(today), offset * 7);
  const days = weekDays(monday);
  const isCurrent = offset === 0;
  return {
    days,
    keys: days.map(dateKey),
    // A week that has already ended has no future days left in it.
    todayIndex: isCurrent ? weekdayIndex(today) : 6,
    key: weekKey(monday),
    offset,
    isCurrent,
    number: isoWeek(monday),
  };
}
