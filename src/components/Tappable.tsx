import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

interface TappableProps {
  onTap: (event: MouseEvent | KeyboardEvent) => void;
  className?: string;
  /** Dims and unfocuses the control without changing the layout. */
  disabled?: boolean;
  label?: string;
  children?: ReactNode;
}

/**
 * The design's tap target: a plain box with the press animation, driven by
 * click or by Enter/Space so the role="button" is honest about its keyboard
 * behaviour. A <button> would fight the styling — several of these nest.
 */
export function Tappable({
  onTap,
  className,
  disabled = false,
  label,
  children,
}: TappableProps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onTap(event);
  };

  return (
    <div
      className={className}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={label}
      onClick={event => {
        if (!disabled) onTap(event);
      }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
