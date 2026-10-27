import {
  memo,
  ReactNode,
  UIEvent,
  useCallback,
  useMemo,
  useState
} from 'react';
import { PropsWithRlsSize } from '../../definitions';

interface VirtualScrollProps extends PropsWithRlsSize {
  container: number;
  height: number;
  items: ReactNode[];
}

function RlsVirtualScrollComponent({
  container,
  height,
  items,
  rlsSize
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
      rls-size={rlsSize}
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
