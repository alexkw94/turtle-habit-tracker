import { Tappable } from '../components/Tappable';
import { GearIcon } from '../components/icons';
import { AREAS } from '../lib/areas';
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
