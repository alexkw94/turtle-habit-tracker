import { useEffect } from 'react';
import { Tappable } from './Tappable';
import {
  MARK_META,
  markClass,
  type Area,
  type Mark,
  type MarkState,
} from '../lib/areas';

const OPTIONS: { value: Mark; label: string; hint: string }[] = [
  { value: 'clean', label: 'Erledigt', hint: 'Ziel erreicht' },
  { value: 'miss', label: 'Nicht erledigt', hint: 'Fehltag' },
];

interface MarkSheetProps {
  area: Area;
  current: MarkState;
  note: string;
  onPick: (mark: Mark | null) => void;
  onNote: (note: string) => void;
  onClose: () => void;
}

export function MarkSheet({
  area,
  current,
  note,
  onPick,
  onNote,
  onClose,
}: MarkSheetProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="dialog-backdrop sheet-backdrop" onClick={onClose}>
      <div
        className="dialog sheet"
        role="dialog"
        aria-modal="true"
        aria-label={area.name}
        onClick={event => event.stopPropagation()}
      >
        <div className="sheet__handle" />
        <h2 className="sheet__title">{area.name}</h2>

        <div className="sheet__opts">
          {OPTIONS.map(option => {
            const selected = current === option.value;
            return (
              <Tappable
                key={option.value}
                className={[
                  'sheetopt tap',
                  markClass(option.value),
                  selected ? 'sheetopt--on' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onTap={() => onPick(selected ? null : option.value)}
              >
                <div className="sheetopt__dot">
                  <span>{MARK_META[option.value].glyph}</span>
                </div>
                <div className="sheetopt__label">{option.label}</div>
                <div className="sheetopt__hint">{option.hint}</div>
              </Tappable>
            );
          })}
        </div>

        <div className="sheet__note">
          <div className="sheet__note-label">Notiz</div>
          <textarea
            className="sheet__note-input"
            value={note}
            onChange={event => onNote(event.target.value)}
            placeholder="Kurz festhalten …"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block tap sheet__done"
          onClick={onClose}
        >
          Fertig
        </button>
      </div>
    </div>
  );
}
