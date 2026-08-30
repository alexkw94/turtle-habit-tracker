import { Tappable } from '../components/Tappable';
import { AREAS, MARK_META, markClass, type MarkState } from '../lib/areas';
import { DAY_LETTERS, formatDayLabel, formatWeekRange } from '../lib/date';
import type { WeekContext } from '../lib/week';
import type { HabitActions, HabitData } from '../state/useHabitStore';

interface WeekScreenProps {
  week: WeekContext;
  onPickDay: (index: number) => void;
  onShiftWeek: (delta: number) => void;
  data: HabitData;
  actions: HabitActions;
}

export function WeekScreen({
  week,
  onPickDay,
  onShiftWeek,
  data,
  actions,
}: WeekScreenProps) {
  const activeAreas = AREAS.filter(area => data.active[area.id]);

  const rows = activeAreas.map(area => {
    const marks: MarkState[] = week.keys.map(
      key => data.marks[key]?.[area.id] ?? 'open',
    );
    const clean = marks.filter(mark => mark === 'clean').length;
    const goal = data.goals[area.id];
    return { area, marks, clean, goal, met: clean >= goal };
  });

  const met = rows.filter(row => row.met);
  const total = rows.length;
  const allMet = met.length === total;

  const title = week.isCurrent
    ? 'Diese Woche'
    : week.offset === -1
      ? 'Letzte Woche'
      : `Woche ${week.number}`;

  const verdictTitle = allMet
    ? 'Alle Ziele erreicht.'
    : `${met.length} von ${total} Zielen erreicht`;

  // The running week can still be talked out of a bad start; a finished one
  // only gets a summary.
  const verdictBody = week.isCurrent
    ? allMet
      ? 'Eine runde Woche. Nimm dir den Sonntag ohne Anspruch.'
      : met.length >= Math.ceil(total * 0.6)
        ? `Solide Woche — ${met.map(row => row.area.name).join(', ')} sitzen. Zwei Tage bleiben noch.`
        : 'Noch zwei Tage. Ein sauberer Tag pro Bereich verändert schon viel.'
    : allMet
      ? 'Eine runde Woche.'
      : met.length > 0
        ? `Gesessen haben: ${met.map(row => row.area.name).join(', ')}.`
        : 'Kein Bereich hat sein Ziel erreicht.';

  return (
    <div className="screen">
      <div className="weekhead">
        <div className="weekhead__text">
          <div className="kicker">{formatWeekRange(week.days[0], week.days[6])}</div>
          <h1 className="screen__title">{title}</h1>
        </div>
        <div className="weeknav">
          <Tappable
            className="weeknav__btn tap"
            label="Woche zurück"
            onTap={() => onShiftWeek(-1)}
          >
            ‹
          </Tappable>
          <Tappable
            className={`weeknav__btn tap${week.isCurrent ? ' weeknav__btn--off' : ''}`}
            label="Woche vor"
            disabled={week.isCurrent}
            onTap={() => onShiftWeek(1)}
          >
            ›
          </Tappable>
        </div>
      </div>

      <div className="stack">
        {rows.map(({ area, marks, clean, goal, met: rowMet }) => (
          <div className="areacard" key={area.id}>
            <div className="areacard__head">
              <div className="areacard__name">{area.name}</div>
              <div
                className={`areacard__score${rowMet ? ' areacard__score--met' : ''}`}
              >
                {clean} / {goal}
                {rowMet ? ' ✓' : ''}
              </div>
            </div>
            <div className="areacard__days">
              {marks.map((mark, index) => {
                const future = index > week.todayIndex;
                return (
                  <Tappable
                    key={week.keys[index]}
                    className={[
                      'daycell tap',
                      markClass(mark),
                      future ? 'daycell--future' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={future}
                    label={`${area.name} — ${formatDayLabel(week.days[index])}`}
                    onTap={() => onPickDay(index)}
                  >
                    <div className="daycell__box">
                      <span>{MARK_META[mark].glyph}</span>
                    </div>
                    <div className="daycell__letter">{DAY_LETTERS[index]}</div>
                  </Tappable>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="verdict">
        <div className="verdict__kicker">Auswertung</div>
        <h2 className="verdict__title">{verdictTitle}</h2>
        <p className="verdict__body">{verdictBody}</p>
      </div>

      <div className="notecard">
        <div className="notecard__label">Notiz zur Woche</div>
        <textarea
          className="notecard__input"
          value={data.weekNotes[week.key] ?? ''}
          onChange={event => actions.setWeekNote(week.key, event.target.value)}
          placeholder="Was nimmst du mit?"
        />
      </div>

      <div className="legend">
        <span>
          <span className="legend__swatch legend__swatch--clean" />
          erledigt
        </span>
        <span>
          <span className="legend__swatch legend__swatch--miss" />
          Fehltag
        </span>
      </div>
    </div>
  );
}
