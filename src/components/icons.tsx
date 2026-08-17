import type { ReactNode } from 'react';
import type { AreaId } from '../lib/areas';

/** Lucide-style interface icons: stroke 2.75, round joins (see the DS readme). */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function TurtleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="4.4" rx="2.7" ry="3.1" />
      <ellipse cx="12" cy="13.2" rx="6.5" ry="7.2" />
      <ellipse cx="4.8" cy="8.4" rx="2.5" ry="1.7" transform="rotate(-35 4.8 8.4)" />
      <ellipse cx="19.2" cy="8.4" rx="2.5" ry="1.7" transform="rotate(35 19.2 8.4)" />
      <ellipse cx="5.1" cy="18" rx="2.4" ry="1.6" transform="rotate(35 5.1 18)" />
      <ellipse cx="18.9" cy="18" rx="2.4" ry="1.6" transform="rotate(-35 18.9 18)" />
      <path d="M12 20.4l1.5 3.4h-3z" />
    </svg>
  );
}

const AREA_PATHS: Record<AreaId, ReactNode> = {
  med: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M4 20c1.8-3.4 4.6-5 8-5s6.2 1.6 8 5" />
      <path d="M3 12h3M18 12h3" />
    </>
  ),
  food: (
    <>
      <path d="M12 8c0-3 2.2-5 5-5 0 3-2 5-5 5z" />
      <path d="M12 8c-3.9 0-7 2.9-7 6.6C5 18.4 8.1 21 12 21s7-2.6 7-6.4C19 10.9 15.9 8 12 8z" />
    </>
  ),
  sleep: <path d="M20.5 13.3A8.5 8.5 0 1 1 10.7 3.5a6.6 6.6 0 0 0 9.8 9.8z" />,
  sport: <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />,
  focus: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M3 21L21 3" />
    </>
  ),
};

export function AreaIcon({ area }: { area: AreaId }) {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" {...stroke}>
      {AREA_PATHS[area]}
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5" width="18" height="16" rx="4" />
      <path d="M3 10h18M8 3v3M16 3v3" />
    </svg>
  );
}

export function MountainIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" {...stroke}>
      <path d="M2.5 19.5h19L14.2 6.2a2.4 2.4 0 0 0-4.1 0L2.5 19.5z" />
      <path d="M8.6 12.4c1 .9 2.1 1.3 3.4 1.3s2.4-.4 3.4-1.3" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
      <path d="M19.3 14.6a1.5 1.5 0 0 0 .3 1.65l.06.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37V20a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06A1.8 1.8 0 1 1 4.66 16.3l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9H4a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06A1.8 1.8 0 1 1 7.66 4.85l.06.06a1.5 1.5 0 0 0 1.65.3H9.4a1.5 1.5 0 0 0 .9-1.37V4a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.08a1.5 1.5 0 0 0 1.37.9H20a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.37.9z" />
    </svg>
  );
}
