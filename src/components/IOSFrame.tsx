import type { CSSProperties, ReactNode } from 'react';

/**
 * The iOS 26 device frame the design mounts its screen in: bezel, dynamic
 * island, status bar and home indicator. Ported from the prototype's
 * `ios-frame.jsx` — only the parts the Habit Tracker actually uses (no nav
 * bar, no keyboard), and with its hard-coded values kept as they are, since
 * this is Apple chrome rather than Organic surface.
 *
 * On a real phone the frame is redundant, so app.css drops it and lets the
 * screen fill the viewport. The size travels as custom properties rather than
 * inline width/height so that media query can override it without `!important`.
 */
export function IOSFrame({
  children,
  width = 402,
  height = 874,
  time = '9:41',
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  time?: string;
}) {
  return (
    <div
      className="ios"
      style={{ '--ios-width': `${width}px`, '--ios-height': `${height}px` } as CSSProperties}
    >
      <div className="ios__island" />

      <div className="ios__statusbar">
        <div className="ios__time">
          <span>{time}</span>
        </div>
        <div className="ios__indicators">
          <svg width="19" height="12" viewBox="0 0 19 12">
            <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="#000" />
            <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="#000" />
            <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="#000" />
            <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="#000" />
          </svg>
          <svg width="17" height="12" viewBox="0 0 17 12">
            <path
              d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z"
              fill="#000"
            />
            <path
              d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z"
              fill="#000"
            />
            <circle cx="8.5" cy="10.5" r="1.5" fill="#000" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13">
            <rect
              x="0.5"
              y="0.5"
              width="23"
              height="12"
              rx="3.5"
              stroke="#000"
              strokeOpacity="0.35"
              fill="none"
            />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="#000" />
            <path
              d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z"
              fill="#000"
              fillOpacity="0.4"
            />
          </svg>
        </div>
      </div>

      <div className="ios__body">
        <div className="ios__content">{children}</div>
      </div>

      <div className="ios__home">
        <div className="ios__home-bar" />
      </div>
    </div>
  );
}
