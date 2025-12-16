import { RefObject, useEffect, useRef, useState } from 'react';

export interface DatatableController {
  refTable: RefObject<HTMLTableSectionElement>;
  scrolleable: boolean;
}

interface CreateObserverOptions {
  setScrolleable: (value: boolean) => void;
  table: HTMLTableSectionElement;
}

function createObserver(options: CreateObserverOptions): ResizeObserver {
  const { setScrolleable, table } = options;

  const observer = new ResizeObserver(() => {
    const scrollHeight = table.scrollHeight || 0;
    const clientHeight = table.clientHeight || 0;

    setScrolleable(scrollHeight > clientHeight);
  });

  observer.observe(table);

  return observer;
}

export function useDatatable(
  table?: HTMLTableSectionElement
): DatatableController {
  const [scrolleable, setScrolleable] = useState(false);
  const refTable = useRef<HTMLTableSectionElement>(table ? table : null);

  useEffect(() => {
    const observer =
      refTable.current &&
      createObserver({ setScrolleable, table: refTable.current });

    return () => {
      observer?.disconnect();
    };
  }, []);

  return { refTable, scrolleable };
}
