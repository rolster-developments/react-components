import {
  AriaRole,
  KeyboardEventHandler,
  MouseEventHandler,
  useMemo
} from 'react';

interface InteractiveControllerProps<E extends HTMLElement> {
  disabled?: boolean;
  onClick?: MouseEventHandler<E>;
  onKeyDown?: KeyboardEventHandler<E>;
  role?: AriaRole;
  tabIndex?: number;
}

interface InteractiveController<E extends HTMLElement> {
  tabIndex: number;
  'aria-disabled'?: true;
  onClick?: MouseEventHandler<E>;
  onKeyDown?: KeyboardEventHandler<E>;
  role?: AriaRole;
}

export function useInteractiveController<E extends HTMLElement>({
  disabled,
  onClick,
  onKeyDown,
  role,
  tabIndex = 0
}: InteractiveControllerProps<E>): InteractiveController<E> {
  return useMemo(
    () => ({
      'aria-disabled': disabled || undefined,
      onClick: disabled ? undefined : onClick,
      onKeyDown: disabled ? undefined : onKeyDown,
      role,
      tabIndex: disabled ? -1 : tabIndex
    }),
    [disabled, onClick, onKeyDown, role, tabIndex]
  );
}
