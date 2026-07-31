import {
  memo,
  ReactNode,
  UIEvent,
  useCallback,
  useMemo,
  useState
} from 'react';

interface VirtualScrollProps {
  container: number;
  height: number;
  items: ReactNode[];
}

function RlsVirtualScrollComponent({
  container,
  height,
  items
}: VirtualScrollProps) {
  const [startIndex, setStartIndex] = useState(0);

  const endIndex = Math.min(
    items.length - 1,
    startIndex + Math.ceil(container / height)
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  );

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      setStartIndex(Math.floor(event.currentTarget.scrollTop / height));
    },
    [height]
  );

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

export const RlsVirtualScroll = memo(RlsVirtualScrollComponent);
