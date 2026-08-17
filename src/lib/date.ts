export const DAY_NAMES = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
];

export const DAY_LETTERS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];

export const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

/** Strips the time so date maths never trips over DST. */
const atMidnight = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Monday = 0 … Sunday = 6. */
export const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7;

export function addDays(date: Date, days: number): Date {
  const d = atMidnight(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const startOfWeek = (date: Date) => addDays(date, -weekdayIndex(date));

export const weekDays = (start: Date) =>
  Array.from({ length: 7 }, (_, i) => addDays(start, i));

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Stable storage key for a single day, e.g. `2026-08-17`. */
export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The Thursday of the ISO week a date belongs to — it carries the ISO year. */
const isoThursday = (date: Date) => addDays(date, 3 - weekdayIndex(date));

export function isoWeek(date: Date): number {
  const thursday = isoThursday(date);
  const firstThursday = isoThursday(new Date(thursday.getFullYear(), 0, 4));
  return (
    1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 864e5))
  );
}

/** Storage key for a week, e.g. `2026-W34`. */
export function weekKey(date: Date): string {
  const thursday = isoThursday(date);
  return `${thursday.getFullYear()}-W${String(isoWeek(date)).padStart(2, '0')}`;
}

/** `17. August` */
export const formatDate = (date: Date) =>
  `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}`;

/** `Montag · 17. August` */
export const formatDayLabel = (date: Date) =>
  `${DAY_NAMES[weekdayIndex(date)]} · ${formatDate(date)}`;

/** `Woche 34 · 17.–23. August` — months are spelled out when the week spans two. */
export function formatWeekRange(start: Date, end: Date): string {
  const span =
    start.getMonth() === end.getMonth()
      ? `${start.getDate()}.–${end.getDate()}. ${MONTH_NAMES[end.getMonth()]}`
      : `${formatDate(start)} – ${formatDate(end)}`;
  return `Woche ${isoWeek(start)} · ${span}`;
}
