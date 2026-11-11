import {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  DropdownOptions,
  DropdownOrigin,
  resolveDropdownPosition
} from '../helpers/dropdown';

export type { DropdownOptions, DropdownOrigin } from '../helpers/dropdown';

export interface DropdownController {
  close: () => void;
  component: RefObject<HTMLDivElement>;
  open: (positionX?: number, positionY?: number) => void;
  openWithEvent: (event: MouseEvent, options?: DropdownOptions) => void;
  visible: boolean;
}

interface DropdownOffset {
  x: number;
  y: number;
}

function resolveParentOffset(component: HTMLElement): DropdownOffset {
  const parent = component.offsetParent as HTMLElement | null;

  if (!parent) {
    return { x: 0, y: 0 };
  }

  if (parent === document.body) {
    return { x: window.scrollX, y: window.scrollY };
  }

  const rect = parent.getBoundingClientRect();

  return {
    x: parent.scrollLeft - rect.left - parent.clientLeft,
    y: parent.scrollTop - rect.top - parent.clientTop
  };
}

export function useDropdownController(
  effect: DropdownOrigin = '0% 0%'
): DropdownController {
  const [visible, setVisible] = useState(false);

  const component = useRef<HTMLDivElement>(null!);

  const setPosition = useCallback(
    (positionX: number, positionY: number, origin: DropdownOrigin) => {
      const content = component.current.querySelector(
        '.rls-dropdown__content'
      ) as HTMLElement;

      content.style.transformOrigin = origin;
      component.current.style.top = `${positionY}px`;
      component.current.style.left = `${positionX}px`;

      setVisible(true);
    },
    []
  );

  const open = useCallback(
    (positionX = 0, positionY = 0) => {
      setPosition(positionX, positionY, effect);
    },
    [effect, setPosition]
  );

  const openWithEvent = useCallback(
    (event: MouseEvent, options?: DropdownOptions) => {
      const element = event.currentTarget as HTMLElement;

      const trigger = element.getBoundingClientRect();

      const position = resolveDropdownPosition(
        trigger,
        {
          width: component.current.offsetWidth,
          height: component.current.offsetHeight
        },
        { width: window.innerWidth, height: window.innerHeight },
        options
      );

      const offset = resolveParentOffset(component.current);

      setPosition(
        position.x + offset.x,
        position.y + offset.y,
        position.origin
      );

      event.stopPropagation();
    },
    [setPosition]
  );

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return useMemo(
    () => ({ close, component, open, openWithEvent, visible }),
    [close, open, openWithEvent, visible]
  );
}
