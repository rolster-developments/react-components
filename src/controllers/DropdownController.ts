import { MouseEvent, RefObject, useCallback, useRef, useState } from 'react';

type DropdownEffect = '0% 0%' | '100% 0%' | '0% 100%' | '100% 100%';

export interface DropdownController {
  close: () => void;
  component: RefObject<HTMLDivElement>;
  open: (positionX?: number, positionY?: number) => void;
  openWithEvent: (event: MouseEvent) => void;
  visible: boolean;
}

export function useDropdownController(): DropdownController {
  const [visible, setVisible] = useState(false);

  const component = useRef<HTMLDivElement>(null!);

  const open = useCallback((positionX?: number, positionY?: number) => {
    component.current.style.transformOrigin = '0% 0%';
    component.current.style.top = `${positionY}px`;
    component.current.style.left = `${positionX}px`;

    setVisible(true);
  }, []);

  const openWithEvent = useCallback((event: MouseEvent) => {
    const rectContent = component.current.getBoundingClientRect();
    const rectElement = (event.target as HTMLElement).getBoundingClientRect();

    let positionX = 0;
    let positionY = 0;
    let effect: DropdownEffect = '0% 0%';
    let transform = 0;

    const elementX = rectElement.x + rectElement.width / 2;
    const elementY = rectElement.y + rectElement.height / 2;

    if (elementX + rectContent.width <= window.innerWidth) {
      positionX = elementX;
      transform += 1;
    } else if (elementX + rectElement.width - rectContent.width > 0) {
      positionX = elementX + rectElement.width - rectContent.width;
      transform += 3;
    } else {
      positionX = window.innerWidth - rectContent.width;
      transform += 1;
    }

    if (elementY + rectContent.height <= window.innerHeight) {
      positionY = elementY;
      transform += 4;
    } else if (elementY + rectElement.height - rectContent.height > 0) {
      positionY = elementY + rectElement.height - rectContent.height;
      transform += 7;
    } else {
      positionY = window.innerHeight - rectContent.height;
      transform += 4;
    }

    switch (transform) {
      case 7:
        effect = '100% 0%';
        break;
      case 8:
        effect = '0% 100%';
        break;
      case 10:
        effect = '100% 100%';
        break;
      default:
        effect = '0% 0%';
        break;
    }

    component.current.style.transformOrigin = effect;
    component.current.style.top = `${positionY}px`;
    component.current.style.left = `${positionX}px`;

    setVisible(true);
    event.stopPropagation();
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    close,
    component,
    open,
    openWithEvent,
    visible
  };
}
