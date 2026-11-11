import {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { getRemSize } from '../helpers/css';
import { resolveParentOffset } from '../helpers/offset';
import {
  PopoverOrientation,
  PopoverPlacement,
  resolvePopoverPosition
} from '../helpers/popover';

export type { PopoverOrientation, PopoverPlacement } from '../helpers/popover';

export interface PopoverControllerOptions {
  orientation?: PopoverOrientation;
}

export interface PopoverController {
  close: () => void;
  component: RefObject<HTMLDivElement>;
  openWithEvent: (event: MouseEvent) => void;
  placement: PopoverPlacement;
  visible: boolean;
}

const MARGIN_REM = 4;
const GAP_REM = 4;
const ARROW_INSET_REM = 8;

export function usePopoverController({
  orientation = 'vertical'
}: PopoverControllerOptions = {}): PopoverController {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom');

  const component = useRef<HTMLDivElement>(null!);

  const openWithEvent = useCallback(
    (event: MouseEvent) => {
      const element = event.currentTarget as HTMLElement;
      const remSize = getRemSize();

      const position = resolvePopoverPosition(
        element.getBoundingClientRect(),
        {
          width: component.current.offsetWidth,
          height: component.current.offsetHeight
        },
        { width: window.innerWidth, height: window.innerHeight },
        {
          arrowInset: ARROW_INSET_REM * remSize,
          gap: GAP_REM * remSize,
          margin: MARGIN_REM * remSize,
          orientation
        }
      );

      const offset = resolveParentOffset(component.current);

      const content = component.current.querySelector(
        '.rls-popover__content'
      ) as HTMLElement;

      content.style.transformOrigin = position.origin;
      component.current.style.top = `${position.y + offset.y}px`;
      component.current.style.left = `${position.x + offset.x}px`;
      component.current.style.setProperty(
        '--rlc-popover-arrow-position',
        `${position.arrow}px`
      );

      setPlacement(position.placement);
      setVisible(true);
      event.stopPropagation();
    },
    [orientation]
  );

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return useMemo(
    () => ({ close, component, openWithEvent, placement, visible }),
    [close, openWithEvent, placement, visible]
  );
}
