import { useCallback, useInsertionEffect, useRef } from 'react';

export function useEventCallback<A extends unknown[], R>(
  callback: (...args: A) => R
): (...args: A) => R {
  const refCallback = useRef(callback);

  useInsertionEffect(() => {
    refCallback.current = callback;
  });

  return useCallback((...args: A) => refCallback.current(...args), []);
}
