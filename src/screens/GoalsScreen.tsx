import { useRef, useState } from 'react';
import { Tappable } from '../components/Tappable';
import { GearIcon } from '../components/icons';
import { AREAS } from '../lib/areas';
import { countRecordedDays, exportBackup, readBackup } from '../lib/backup';
import type { HabitActions, HabitData } from '../state/useHabitStore';

interface GoalsScreenProps {
  editAreas: boolean;
  onToggleEdit: () => void;
  data: HabitData;
  actions: HabitActions;
}

export function GoalsScreen({
  editAreas,
  onToggleEdit,
  data,
  actions,
}: GoalsScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const recorded = countRecordedDays(data);

  const handleExport = async () => {
    try {
      const how = await exportBackup(data);
      setStatus(
        how === 'shared'
          ? 'Sicherung ans Teilen-Menü übergeben.'
          : 'Sicherung heruntergeladen.',
      );
    } catch {
      setStatus('Die Sicherung konnte nicht erstellt werden.');
    }
  };

  const handleImport = async (file: File) => {
    try {
      const restored = await readBackup(file);
      const days = countRecordedDays(restored);
      const ok = window.confirm(
        `Sicherung mit ${days} aufgezeichneten Tagen einlesen? Die Daten auf diesem Gerät werden dabei ersetzt.`,
      );
      if (!ok) return;
      actions.replaceAll(restored);
      setStatus(`${days} Tage wiederhergestellt.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Datei nicht lesbar.');
    }
  };

  return (
    <div className="screen">
      <div>
        <div className="sethead">
          <div>
            <div className="kicker">Einstellungen</div>
            <h1 className="screen__title">Deine Ziele</h1>
          </div>
          <Tappable
            className={`gearbtn tap${editAreas ? ' gearbtn--on' : ''}`}
            label="Bereiche verwalten"
            onTap={onToggleEdit}
          >
            <GearIcon />
          </Tappable>
        </div>
        <p className="setintro">
          {editAreas
            ? 'Schalte Bereiche aus, die für dich gerade nicht zählen.'
            : 'Wie viele Tage pro Woche willst du in jedem Bereich erledigen? Über das Zahnrad kannst du Bereiche ganz ausschalten.'}
        </p>
      </div>

      <div className="stack">
        {AREAS.map(area => {
          const active = data.active[area.id];
          return (
            <div className="setrow" key={area.id}>
              <div className="setrow__head">
                <div className={`setrow__name${active ? '' : ' setrow__name--off'}`}>
                  {area.name}
                </div>
                {editAreas && (
                  <Tappable
                    className={`switch switch--sm tap${active ? ' switch--on' : ''}`}
                    label={`${area.name} ${active ? 'ausschalten' : 'einschalten'}`}
                    onTap={() => actions.toggleActive(area.id)}
                  >
                    <div className="switch__knob" />
                  </Tappable>
                )}
              </div>
              {active && (
                <div className="goalrow">
                  <div className="goalrow__label">Wochenziel</div>
                  <Tappable
                    className="stepper stepper--down tap"
                    label={`Wochenziel ${area.name} verringern`}
                    onTap={() => actions.adjustGoal(area.id, -1)}
                  >
                    –
                  </Tappable>
                  <div className="goalrow__value">{data.goals[area.id]} / 7</div>
                  <Tappable
                    className="stepper stepper--up tap"
                    label={`Wochenziel ${area.name} erhöhen`}
                    onTap={() => actions.adjustGoal(area.id, 1)}
                  >
                    +
                  </Tappable>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="backup">
        <div className="backup__head">
          <div className="reminder__title">Deine Aufzeichnungen</div>
          <div className="reminder__sub">
            {recorded === 0
              ? 'Noch keine Tage aufgezeichnet.'
              : `${recorded} ${recorded === 1 ? 'Tag' : 'Tage'} aufgezeichnet — sie bleiben auf diesem Gerät gespeichert, auch über Wochen hinweg.`}
          </div>
        </div>
        <div className="backup__actions">
          <button type="button" className="btn btn-secondary tap" onClick={handleExport}>
            Sichern
          </button>
          <button
            type="button"
            className="btn btn-secondary tap"
            onClick={() => fileInput.current?.click()}
          >
            Wiederherstellen
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={event => {
              const file = event.target.files?.[0];
              // Reset first, so picking the same file twice still fires.
              event.target.value = '';
              if (file) void handleImport(file);
            }}
          />
        </div>
        {status && <div className="backup__status">{status}</div>}
      </div>

      <div className="reminder">
        <div className="reminder__text">
          <div className="reminder__title">Sanfte Abenderinnerung</div>
          <div className="reminder__sub">Einmal täglich um 21:00</div>
        </div>
        <Tappable
          className={`switch switch--lg tap${data.reminder ? ' switch--on' : ''}`}
          label={`Abenderinnerung ${data.reminder ? 'ausschalten' : 'einschalten'}`}
          onTap={actions.toggleReminder}
        >
          <div className="switch__knob" />
        </Tappable>
      </div>
    </div>
  );
}
