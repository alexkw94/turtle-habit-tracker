export type AreaId = 'med' | 'food' | 'sleep' | 'sport' | 'focus';

/** A day is either marked done, marked missed, or still open. */
export type Mark = 'clean' | 'miss';
export type MarkState = Mark | 'open';

export interface Area {
  id: AreaId;
  name: string;
  /** Artwork for the day list, resolved against the deploy base path. */
  icon: string;
}

const asset = (file: string) => `${import.meta.env.BASE_URL}areas/${file}`;

export const AREAS: Area[] = [
  { id: 'med', name: 'Meditation', icon: asset('lotus-position.png') },
  { id: 'food', name: 'Ernährung', icon: asset('dish.png') },
  { id: 'sleep', name: 'Schlaf', icon: asset('sleeping.png') },
  { id: 'sport', name: 'Sport', icon: asset('table-tennis.png') },
  { id: 'focus', name: 'Ablenkungen', icon: asset('no-smartphones.png') },
];

/** Glyph and copy per mark state; the colors live in `.mark-*` in app.css. */
export const MARK_META: Record<MarkState, { glyph: string; label: string }> = {
  clean: { glyph: '✓', label: 'erledigt' },
  miss: { glyph: '✕', label: 'Fehltag' },
  open: { glyph: '', label: 'noch offen' },
};

export const markClass = (state: MarkState) => `mark-${state}`;

/** Tapping a habit walks: open → done → missed → open. */
export const nextMark = (current: MarkState): Mark | null =>
  current === 'clean' ? 'miss' : current === 'miss' ? null : 'clean';
