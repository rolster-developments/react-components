import { KeyboardEventHandler, MouseEventHandler, useMemo } from 'react';

interface InteractiveControllerProps<E extends HTMLElement> {
  disabled?: boolean;
  onClick?: MouseEventHandler<E>;
  onKeyDown?: KeyboardEventHandler<E>;
  tabIndex?: number;
}

interface InteractiveController<E extends HTMLElement> {
  tabIndex: number;
  'aria-disabled'?: true;
  onClick?: MouseEventHandler<E>;
  onKeyDown?: KeyboardEventHandler<E>;
}

export function useInteractiveController<E extends HTMLElement>({
  disabled,
  onClick,
  onKeyDown,
  tabIndex = 0
}: InteractiveControllerProps<E>): InteractiveController<E> {
  return useMemo(
    () => ({
      'aria-disabled': disabled || undefined,
      onClick: disabled ? undefined : onClick,
      onKeyDown: disabled ? undefined : onKeyDown,
      tabIndex: disabled ? -1 : tabIndex
    }),
    [disabled, onClick, onKeyDown, tabIndex]
  );
}
