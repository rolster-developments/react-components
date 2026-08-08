import { RefObject, useCallback, useEffect, useRef } from 'react';

interface ResizeDimensionEvent {
  height: number;
  width: number;
}

interface ResizeEvent {
  current: ResizeDimensionEvent;
  dimension: ResizeDimensionEvent;
}

interface ResizeProps {
  refElement: RefObject<HTMLElement>;
  onResize?: (event: ResizeEvent) => void;
}

export function useResize({ refElement, onResize }: ResizeProps): void {
  const dimension = useRef({ height: 0, width: 0 });

  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const observer = useCallback((entries: ResizeObserverEntry[]) => {
    const { height, width } = entries[0].contentRect;

    onResizeRef.current?.({
      current: dimension.current,
      dimension: {
        height,
        width
      }
    });

    dimension.current = { height, width };
  }, []);

  useEffect(() => {
    dimension.current = {
      height: refElement.current.offsetHeight,
      width: refElement.current.offsetWidth
    };

    const resizeObserver = new ResizeObserver(observer);
    resizeObserver.observe(refElement.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
}
