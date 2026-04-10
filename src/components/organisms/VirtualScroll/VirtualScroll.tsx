import { ReactNode, UIEvent, useCallback, useMemo, useState } from 'react';

interface VirtualScrollProps {
  container: number;
  height: number;
  items: ReactNode[];
}

export function RlsVirtualScroll({
  container,
  height,
  items
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = useMemo(
    () => Math.floor(scrollTop / height),
    [scrollTop, height]
  );

  const endIndex = useMemo(
    () =>
      Math.min(items.length - 1, Math.floor((scrollTop + container) / height)),
    [scrollTop, items.length, height, container]
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  );

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{
        height: `${container}px`,
        overflowY: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: `${items.length * height}px`,
          position: 'relative'
        }}
      >
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;

          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: `${actualIndex * height}px`,
                height: `${height}px`,
                width: '100%'
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
