import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

interface RelocationOnComponentProps {
  container: MutableRefObject<HTMLElement>;
  element: MutableRefObject<HTMLElement>;
  onDrag?: () => void;
}

export function useRelocationOnComponent({
  container,
  element,
  onDrag
}: RelocationOnComponentProps) {
  const position = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  const getClientX = useCallback((positionX: number) => {
    let clientX = position.current.x + positionX - dragOffset.current.x;

    if (clientX < 0) {
      clientX = 0;
    } else {
      const width = clientX + element.current.offsetWidth;

      if (width > container.current.offsetWidth) {
        clientX = container.current.offsetWidth - element.current.offsetWidth;
      }
    }

    return clientX;
  }, []);

  const getClientY = useCallback((positionY: number) => {
    let clientY = position.current.y + positionY - dragOffset.current.y;

    if (clientY < 0) {
      clientY = 0;
    } else {
      const height = clientY + element.current.offsetHeight;

      if (height > container.current.offsetHeight) {
        clientY = container.current.offsetHeight - element.current.offsetHeight;
      }
    }

    return clientY;
  }, []);

  const start = useCallback((positionX: number, positionY: number) => {
    dragOffset.current = {
      x: positionX,
      y: positionY
    };

    position.current = {
      x: element.current.offsetLeft,
      y: element.current.offsetTop
    };

    dragging.current = true;
  }, []);

  const relocation = useCallback((positionX: number, positionY: number) => {
    const clientX = getClientX(positionX);
    const clientY = getClientY(positionY);

    element.current.style.top = `${clientY}px`;
    element.current.style.left = `${clientX}px`;

    onDrag?.();
  }, []);

  useEffect(() => {
    const mousedown = (event: MouseEvent) => {
      start(event.clientX, event.clientY);
    };

    const mousemove = (event: MouseEvent) => {
      if (dragging.current) {
        relocation(event.clientX, event.clientY);
        event.preventDefault();
      }
    };

    const mouseup = () => {
      dragging.current = false;
    };

    const touchstart = (event: TouchEvent) => {
      if (event.touches[0]) {
        start(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const touchmove = (event: TouchEvent) => {
      if (event.touches[0] && dragging.current) {
        relocation(event.touches[0].clientX, event.touches[0].clientY);
        event.preventDefault();
      }
    };

    const touchend = () => {
      dragging.current = false;
    };

    element.current.addEventListener('mousedown', mousedown);
    element.current.addEventListener('mousemove', mousemove);
    element.current.addEventListener('mouseup', mouseup);
    element.current.addEventListener('touchstart', touchstart);
    element.current.addEventListener('touchmove', touchmove);
    element.current.addEventListener('touchend', touchend);

    return () => {
      element.current?.removeEventListener('mousedown', mousedown);
      element.current?.removeEventListener('mousemove', mousemove);
      element.current?.removeEventListener('mouseup', mouseup);
      element.current?.removeEventListener('touchstart', touchstart);
      element.current?.removeEventListener('touchmove', touchmove);
      element.current?.removeEventListener('touchend', touchend);
    };
  }, []);
}
