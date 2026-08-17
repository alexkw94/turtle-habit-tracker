import { useCallback, useEffect, useMemo, useState } from 'react';
import { AREAS, type AreaId, type Mark } from '../lib/areas';
import { addDays, dateKey, startOfWeek, weekdayIndex } from '../lib/date';

const STORAGE_KEY = 'turtle.habits.v1';

export interface HabitData {
  /** dateKey → areaId → mark. A missing entry means the day is still open. */
  marks: Record<string, Partial<Record<AreaId, Mark>>>;
  /** dateKey → note */
  dayNotes: Record<string, string>;
  /** `dateKey:areaId` → note */
  markNotes: Record<string, string>;
  /** weekKey → note */
  weekNotes: Record<string, string>;
  active: Record<AreaId, boolean>;
  goals: Record<AreaId, number>;
  reminder: boolean;
}

export interface HabitActions {
  setMark: (day: string, area: AreaId, mark: Mark | null) => void;
  setDayNote: (day: string, note: string) => void;
  setMarkNote: (day: string, area: AreaId, note: string) => void;
  setWeekNote: (week: string, note: string) => void;
  toggleActive: (area: AreaId) => void;
  adjustGoal: (area: AreaId, delta: number) => void;
  toggleReminder: () => void;
}

export const markNoteKey = (day: string, area: AreaId) => `${day}:${area}`;

/** The prototype's sample week — seeded into the past days on first launch only. */
const SAMPLE: Record<AreaId, (Mark | null)[]> = {
  med: ['clean', 'clean', 'miss', 'clean', 'clean', null, null],
  food: ['clean', 'miss', 'clean', 'clean', 'miss', null, null],
  sleep: ['clean', 'clean', 'clean', 'miss', 'clean', null, null],
  sport: ['clean', null, 'clean', null, 'clean', null, null],
  focus: ['miss', 'clean', 'clean', 'miss', 'clean', null, null],
};

function seedMarks(today: Date): HabitData['marks'] {
  const monday = startOfWeek(today);
  const marks: HabitData['marks'] = {};
  for (let i = 0; i < weekdayIndex(today); i++) {
    const day: Partial<Record<AreaId, Mark>> = {};
    for (const area of AREAS) {
      const mark = SAMPLE[area.id][i];
      if (mark) day[area.id] = mark;
    }
    if (Object.keys(day).length) marks[dateKey(addDays(monday, i))] = day;
  }
  return marks;
}

const createInitial = (): HabitData => ({
  marks: seedMarks(new Date()),
  dayNotes: {},
  markNotes: {},
  weekNotes: {},
  active: { med: true, food: true, sleep: true, sport: true, focus: true },
  goals: { med: 5, food: 5, sleep: 6, sport: 3, focus: 5 },
  reminder: true,
});

function load(): HabitData {
  const initial = createInitial();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const stored = JSON.parse(raw) as Partial<HabitData>;
    return {
      ...initial,
      ...stored,
      active: { ...initial.active, ...stored.active },
      goals: { ...initial.goals, ...stored.goals },
    };
  } catch {
    // Corrupt or unavailable storage should never keep the app from starting.
    return initial;
  }
}

export function useHabitStore() {
  const [data, setData] = useState<HabitData>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Private-mode quota errors are not worth interrupting the user over.
    }
  }, [data]);

  const setMark = useCallback((day: string, area: AreaId, mark: Mark | null) => {
    setData(d => {
      const dayMarks = { ...d.marks[day] };
      if (mark) dayMarks[area] = mark;
      else delete dayMarks[area];
      const marks = { ...d.marks };
      if (Object.keys(dayMarks).length) marks[day] = dayMarks;
      else delete marks[day];
      return { ...d, marks };
    });
  }, []);

  const setDayNote = useCallback((day: string, note: string) => {
    setData(d => ({ ...d, dayNotes: { ...d.dayNotes, [day]: note } }));
  }, []);

  const setMarkNote = useCallback((day: string, area: AreaId, note: string) => {
    setData(d => ({
      ...d,
      markNotes: { ...d.markNotes, [markNoteKey(day, area)]: note },
    }));
  }, []);

  const setWeekNote = useCallback((week: string, note: string) => {
    setData(d => ({ ...d, weekNotes: { ...d.weekNotes, [week]: note } }));
  }, []);

  const toggleActive = useCallback((area: AreaId) => {
    setData(d => ({ ...d, active: { ...d.active, [area]: !d.active[area] } }));
  }, []);

  const adjustGoal = useCallback((area: AreaId, delta: number) => {
    setData(d => ({
      ...d,
      goals: {
        ...d.goals,
        [area]: Math.min(7, Math.max(0, d.goals[area] + delta)),
      },
    }));
  }, []);

  const toggleReminder = useCallback(() => {
    setData(d => ({ ...d, reminder: !d.reminder }));
  }, []);

  const actions = useMemo<HabitActions>(
    () => ({
      setMark,
      setDayNote,
      setMarkNote,
      setWeekNote,
      toggleActive,
      adjustGoal,
      toggleReminder,
    }),
    [
      setMark,
      setDayNote,
      setMarkNote,
      setWeekNote,
      toggleActive,
      adjustGoal,
      toggleReminder,
    ],
  );

  return { data, actions };
}
