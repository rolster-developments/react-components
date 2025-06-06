import { useState, useRef, useEffect, UIEvent } from 'react';

export function RlsVirtualScroll({ items, itemHeight, containerHeight }: any) {
  const [visibleItems, setVisibleItems] = useState([]);
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        items.length - 1,
        Math.floor((scrollTop + containerHeight) / itemHeight)
      );

      setVisibleItems(items.slice(startIndex, endIndex + 1));
    };

    calculateVisibleItems();
  }, [scrollTop, items, itemHeight, containerHeight]);

  const handleScroll = (e: UIEvent) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: `${containerHeight}px`,
        overflowY: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: `${items.length * itemHeight}px`,
          position: 'relative'
        }}
      >
        {visibleItems.map((item, index) => {
          const actualIndex = Math.floor(scrollTop / itemHeight) + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: `${actualIndex * itemHeight}px`,
                height: `${itemHeight}px`,
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
