import type { ComponentType } from 'react';
import { Tappable } from './Tappable';
import { CalendarIcon, MountainIcon, SunIcon } from './icons';

export type Screen = 'day' | 'week' | 'goals';

const TABS: { id: Screen; label: string; icon: ComponentType }[] = [
  { id: 'day', label: 'Tag', icon: SunIcon },
  { id: 'week', label: 'Woche', icon: CalendarIcon },
  { id: 'goals', label: 'Ziele', icon: MountainIcon },
];

export function TabBar({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (screen: Screen) => void;
}) {
  return (
    <div className="tabbar">
      {TABS.map(({ id, label, icon: Icon }) => (
        <Tappable
          key={id}
          className={`tab tap${screen === id ? ' tab--on' : ''}`}
          onTap={() => onChange(id)}
        >
          <Icon />
          <span className="tab__label">{label}</span>
        </Tappable>
      ))}
    </div>
  );
}
