import { useEffect, useState } from 'react';
import { ClassStatus, renderClassStatus } from '../helpers';

export function useRenderClassStatus(
  base: string,
  status: ClassStatus = {},
  additionals?: string
) {
  const [className, setClassName] = useState('');

  useEffect(() => {
    setClassName(renderClassStatus(base, status, additionals));
  }, [base, Object.values(status), additionals]);

  return className;
}
