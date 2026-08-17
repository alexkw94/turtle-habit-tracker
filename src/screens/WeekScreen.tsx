import { Tappable } from '../components/Tappable';
import { AREAS, MARK_META, markClass, type MarkState } from '../lib/areas';
import { DAY_LETTERS, formatDayLabel, formatWeekRange } from '../lib/date';
import type { WeekContext } from '../lib/week';
import type { HabitActions, HabitData } from '../state/useHabitStore';

interface WeekScreenProps {
  week: WeekContext;
  onPickDay: (index: number) => void;
  data: HabitData;
  actions: HabitActions;
}

export function WeekScreen({ week, onPickDay, data, actions }: WeekScreenProps) {
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

  const verdictTitle = allMet
    ? 'Alle Ziele erreicht.'
    : `${met.length} von ${total} Zielen erreicht`;

  const verdictBody = allMet
    ? 'Eine runde Woche. Nimm dir den Sonntag ohne Anspruch.'
    : met.length >= Math.ceil(total * 0.6)
      ? `Solide Woche — ${met.map(row => row.area.name).join(', ')} sitzen. Zwei Tage bleiben noch.`
      : 'Noch zwei Tage. Ein sauberer Tag pro Bereich verändert schon viel.';

  return (
    <div className="screen">
      <div>
        <div className="kicker">{formatWeekRange(week.days[0], week.days[6])}</div>
        <h1 className="screen__title">Diese Woche</h1>
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
