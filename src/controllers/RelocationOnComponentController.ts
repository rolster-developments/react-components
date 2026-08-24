import { RefObject, useEffect, useEffectEvent, useRef } from 'react';

interface RelocationOnComponentProps {
  container: RefObject<HTMLElement>;
  element: RefObject<HTMLElement>;
  onDrag?: () => void;
}

export function useRelocationOnComponent({
  container: containerRef,
  element: elementRef,
  onDrag
}: RelocationOnComponentProps) {
  const position = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  function getClientX(positionX: number): number {
    let clientX = position.current.x + positionX - dragOffset.current.x;

    if (clientX < 0) {
      clientX = 0;
    } else {
      const width = clientX + elementRef.current.offsetWidth;

      if (width > containerRef.current.offsetWidth) {
        clientX =
          containerRef.current.offsetWidth - elementRef.current.offsetWidth;
      }
    }

    return clientX;
  }

  function getClientY(positionY: number): number {
    let clientY = position.current.y + positionY - dragOffset.current.y;

    if (clientY < 0) {
      clientY = 0;
    } else {
      const height = clientY + elementRef.current.offsetHeight;

      if (height > containerRef.current.offsetHeight) {
        clientY =
          containerRef.current.offsetHeight - elementRef.current.offsetHeight;
      }
    }

    return clientY;
  }

  const start = useEffectEvent((positionX: number, positionY: number) => {
    dragOffset.current = {
      x: positionX,
      y: positionY
    };

    position.current = {
      x: elementRef.current.offsetLeft,
      y: elementRef.current.offsetTop
    };

    dragging.current = true;
  });

  const relocation = useEffectEvent((positionX: number, positionY: number) => {
    const clientX = getClientX(positionX);
    const clientY = getClientY(positionY);

    elementRef.current.style.top = `${clientY}px`;
    elementRef.current.style.left = `${clientX}px`;

    onDrag?.();
  });

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

    elementRef.current.addEventListener('mousedown', mousedown);
    elementRef.current.addEventListener('mousemove', mousemove);
    elementRef.current.addEventListener('mouseup', mouseup);
    elementRef.current.addEventListener('touchstart', touchstart);
    elementRef.current.addEventListener('touchmove', touchmove);
    elementRef.current.addEventListener('touchend', touchend);

    return () => {
      elementRef.current?.removeEventListener('mousedown', mousedown);
      elementRef.current?.removeEventListener('mousemove', mousemove);
      elementRef.current?.removeEventListener('mouseup', mouseup);
      elementRef.current?.removeEventListener('touchstart', touchstart);
      elementRef.current?.removeEventListener('touchmove', touchmove);
      elementRef.current?.removeEventListener('touchend', touchend);
    };
  }, []);
}
