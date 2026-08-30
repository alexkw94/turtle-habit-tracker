import { Tappable } from '../components/Tappable';
import { AreaIcon } from '../components/icons';
import {
  AREAS,
  MARK_META,
  markClass,
  nextMark,
  type AreaId,
  type MarkState,
} from '../lib/areas';
import { DAY_LETTERS, DAY_NAMES, formatDate, formatDayLabel } from '../lib/date';
import { markNoteKey, type HabitActions, type HabitData } from '../state/useHabitStore';
import type { WeekContext } from '../lib/week';

interface DayScreenProps {
  week: WeekContext;
  selected: number;
  onSelectDay: (index: number) => void;
  onOpenSheet: (area: AreaId) => void;
  data: HabitData;
  actions: HabitActions;
}

export function DayScreen({
  week,
  selected,
  onSelectDay,
  onOpenSheet,
  data,
  actions,
}: DayScreenProps) {
  const dayKey = week.keys[selected];
  const activeAreas = AREAS.filter(area => data.active[area.id]);
  const markOf = (area: AreaId): MarkState => data.marks[dayKey]?.[area] ?? 'open';
  const cleanCount = activeAreas.filter(area => markOf(area.id) === 'clean').length;

  // 'Heute' and 'Gestern' only mean anything while the running week is shown.
  const isToday = week.isCurrent && selected === week.todayIndex;
  const title = isToday
    ? 'Heute'
    : week.isCurrent && selected === week.todayIndex - 1
      ? 'Gestern'
      : DAY_NAMES[selected];

  const noteLabel = isToday
    ? 'Notiz zum Tag'
    : `Notiz — ${formatDate(week.days[selected])}`;

  return (
    <div className="screen">
      <div className="dayhead">
        <div>
          <div className="kicker">{formatDayLabel(week.days[selected])}</div>
          <h1 className="screen__title">{title}</h1>
        </div>
        <div className="dayhead__score">
          <div className="dayhead__count">
            {cleanCount}
            <span>/{activeAreas.length}</span>
          </div>
          <div className="dayhead__caption">erledigt</div>
        </div>
      </div>

      <div className="strip">
        {week.days.map((day, index) => {
          const future = index > week.todayIndex;
          return (
            <Tappable
              key={week.keys[index]}
              className={[
                'strip__day tap',
                index === selected ? 'strip__day--on' : '',
                future ? 'strip__day--future' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={future}
              label={formatDayLabel(day)}
              onTap={() => onSelectDay(index)}
            >
              <span className="strip__letter">{DAY_LETTERS[index]}</span>
              <span className="strip__num">{day.getDate()}</span>
            </Tappable>
          );
        })}
      </div>

      <div className="stack">
        {activeAreas.map(area => {
          const state = markOf(area.id);
          const note = data.markNotes[markNoteKey(dayKey, area.id)];
          const meta = MARK_META[state];
          return (
            <Tappable
              key={area.id}
              className={`habit tap ${markClass(state)}`}
              label={`${area.name} — ${meta.label}`}
              onTap={() => actions.setMark(dayKey, area.id, nextMark(state))}
            >
              <div className="habit__icon">
                <AreaIcon area={area} />
              </div>
              <div className="habit__body">
                <div className="habit__name">{area.name}</div>
                <div className="habit__label">
                  {note ? `${meta.label} · ${note}` : meta.label}
                </div>
              </div>
              <Tappable
                className="habit__more"
                label={`${area.name} bearbeiten`}
                onTap={event => {
                  event.stopPropagation();
                  onOpenSheet(area.id);
                }}
              >
                ···
              </Tappable>
              <div className="habit__state">
                <span>{meta.glyph}</span>
              </div>
            </Tappable>
          );
        })}
      </div>

      <div className="notecard">
        <div className="notecard__label">{noteLabel}</div>
        <textarea
          className="notecard__input"
          value={data.dayNotes[dayKey] ?? ''}
          onChange={event => actions.setDayNote(dayKey, event.target.value)}
          placeholder="Ein Satz, wie der Tag war …"
        />
      </div>

      <p className="hint">
        Tippen markiert erledigt, nochmal tippen einen Fehltag. Über ··· gibt es
        eine Notiz. Vergangene Tage oben antippen, um sie nachzutragen.
      </p>
    </div>
  );
}
