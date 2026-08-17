import { useMemo, useState } from 'react';
import { IOSFrame } from './components/IOSFrame';
import { MarkSheet } from './components/MarkSheet';
import { TabBar, type Screen } from './components/TabBar';
import { TurtleMark } from './components/icons';
import { AREAS, type AreaId } from './lib/areas';
import { buildWeek } from './lib/week';
import { DayScreen } from './screens/DayScreen';
import { GoalsScreen } from './screens/GoalsScreen';
import { WeekScreen } from './screens/WeekScreen';
import { markNoteKey, useHabitStore } from './state/useHabitStore';

export default function App() {
  const { data, actions } = useHabitStore();
  const week = useMemo(() => buildWeek(new Date()), []);

  const [screen, setScreen] = useState<Screen>('day');
  const [selected, setSelected] = useState(week.todayIndex);
  const [sheetArea, setSheetArea] = useState<AreaId | null>(null);
  const [editAreas, setEditAreas] = useState(false);

  const dayKey = week.keys[selected];
  const openArea = AREAS.find(area => area.id === sheetArea) ?? null;

  const pickDayFromWeek = (index: number) => {
    setSelected(index);
    setScreen('day');
  };

  const selectDay = (index: number) => {
    setSelected(index);
    setSheetArea(null);
  };

  return (
    <div className="stage">
      <IOSFrame>
        <div className="app">
          <div className="app__brand">
            <TurtleMark />
            <span className="app__brand-word">turtle</span>
          </div>

          <div className="app__scroll">
            {screen === 'day' && (
              <DayScreen
                week={week}
                selected={selected}
                onSelectDay={selectDay}
                onOpenSheet={setSheetArea}
                data={data}
                actions={actions}
              />
            )}
            {screen === 'week' && (
              <WeekScreen
                week={week}
                onPickDay={pickDayFromWeek}
                data={data}
                actions={actions}
              />
            )}
            {screen === 'goals' && (
              <GoalsScreen
                editAreas={editAreas}
                onToggleEdit={() => setEditAreas(edit => !edit)}
                data={data}
                actions={actions}
              />
            )}
          </div>

          <TabBar screen={screen} onChange={setScreen} />

          {openArea && (
            <MarkSheet
              area={openArea}
              current={data.marks[dayKey]?.[openArea.id] ?? 'open'}
              note={data.markNotes[markNoteKey(dayKey, openArea.id)] ?? ''}
              onPick={mark => actions.setMark(dayKey, openArea.id, mark)}
              onNote={note => actions.setMarkNote(dayKey, openArea.id, note)}
              onClose={() => setSheetArea(null)}
            />
          )}
        </div>
      </IOSFrame>
    </div>
  );
}
