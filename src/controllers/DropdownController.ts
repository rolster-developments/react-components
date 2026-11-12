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
import { resolveParentOffset } from '../helpers/offset';
import { useAnchorTracking } from './AnchorTrackingController';
import { useEventCallback } from './EventCallbackController';

export type { DropdownOptions, DropdownOrigin } from '../helpers/dropdown';

export interface DropdownController {
  close: () => void;
  component: RefObject<HTMLDivElement>;
  open: (positionX?: number, positionY?: number) => void;
  openWithEvent: (event: MouseEvent, options?: DropdownOptions) => void;
  visible: boolean;
}

interface DropdownAnchor {
  element: HTMLElement;
  options?: DropdownOptions;
}

export function useDropdownController(
  effect: DropdownOrigin = '0% 0%'
): DropdownController {
  const [visible, setVisible] = useState(false);

  const component = useRef<HTMLDivElement>(null!);
  const anchor = useRef<DropdownAnchor | undefined>(undefined);

  const setPosition = useCallback(
    (positionX: number, positionY: number, origin: DropdownOrigin) => {
      const content = component.current.querySelector(
        '.rls-dropdown__content'
      ) as HTMLElement;

      content.style.transformOrigin = origin;
      component.current.style.top = `${positionY}px`;
      component.current.style.left = `${positionX}px`;
    },
    []
  );

  const reposition = useEventCallback(() => {
    if (!anchor.current) {
      return;
    }

    const position = resolveDropdownPosition(
      anchor.current.element.getBoundingClientRect(),
      {
        width: component.current.offsetWidth,
        height: component.current.offsetHeight
      },
      { width: window.innerWidth, height: window.innerHeight },
      anchor.current.options
    );

    const offset = resolveParentOffset(component.current);

    setPosition(position.x + offset.x, position.y + offset.y, position.origin);
  });

  useAnchorTracking(visible, reposition);

  const open = useCallback(
    (positionX = 0, positionY = 0) => {
      anchor.current = undefined;
      setPosition(positionX, positionY, effect);
      setVisible(true);
    },
    [effect, setPosition]
  );

  const openWithEvent = useCallback(
    (event: MouseEvent, options?: DropdownOptions) => {
      anchor.current = {
        element: event.currentTarget as HTMLElement,
        options
      };

      reposition();
      setVisible(true);
      event.stopPropagation();
    },
    [reposition]
  );

  const close = useCallback(() => {
    anchor.current = undefined;
    setVisible(false);
  }, []);

  return useMemo(
    () => ({ close, component, open, openWithEvent, visible }),
    [close, open, openWithEvent, visible]
  );
}
