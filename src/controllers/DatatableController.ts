import { RefObject, useEffect, useRef, useState } from 'react';

export interface DatatableController {
  scrolleable: boolean;
  tableRef: RefObject<HTMLTableSectionElement>;
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

export function useDatatable(): DatatableController {
  const [scrolleable, setScrolleable] = useState(false);
  const tableRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const observer =
      tableRef?.current &&
      createObserver({ setScrolleable, table: tableRef?.current });

    return () => {
      observer?.disconnect();
    };
  }, []);

  return { scrolleable, tableRef };
}
