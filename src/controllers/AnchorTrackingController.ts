import { useEffect } from 'react';
import { useEventCallback } from './EventCallbackController';

export function useAnchorTracking(
  visible: boolean,
  reposition: () => void
): void {
  const callback = useEventCallback(reposition);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let frame = 0;

    const schedule = () => {
      if (frame) {
        return;
      }

      frame = requestAnimationFrame(() => {
        frame = 0;
        callback();
      });
    };

    document.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      document.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [visible, callback]);
}
