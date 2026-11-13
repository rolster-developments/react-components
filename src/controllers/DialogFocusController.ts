import { RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

interface DialogFocusControllerProps {
  visible: boolean;
  onEscape?: () => void;
}

interface DialogFocusController {
  refDialog: RefObject<HTMLDivElement | null>;
}

function pointerIsCoarse(): boolean {
  return !!window.matchMedia?.('(pointer: coarse)').matches;
}

function focusableElements(dialog: HTMLElement): HTMLElement[] {
  return [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (element) => element.offsetParent !== null
  );
}

function trapTab(dialog: HTMLElement, event: KeyboardEvent): void {
  const elements = focusableElements(dialog);

  if (!elements.length) {
    event.preventDefault();
    dialog.focus();

    return;
  }

  const first = elements[0];
  const last = elements[elements.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || active === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function useDialogFocusController({
  visible,
  onEscape
}: DialogFocusControllerProps): DialogFocusController {
  const refDialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const escape = useRef(onEscape);

  escape.current = onEscape;

  useEffect(() => {
    const dialog = refDialog.current;

    if (!dialog) {
      return;
    }

    if (!visible) {
      const target = opener.current;

      opener.current = null;

      if (target?.isConnected) {
        target.focus();
      }

      return;
    }

    opener.current = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      const target = pointerIsCoarse()
        ? dialog
        : (focusableElements(dialog)[0] ?? dialog);

      target.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        escape.current?.();
      } else if (event.key === 'Tab') {
        trapTab(dialog, event);
      }
    };

    dialog.addEventListener('keydown', onKeyDown);

    return () => {
      dialog.removeEventListener('keydown', onKeyDown);
    };
  }, [visible]);

  return { refDialog };
}
