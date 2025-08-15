import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import './Icon.css';

interface IconProps {
  value: string;
  skeleton?: boolean;
}

export function RlsIcon({ value, skeleton }: IconProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-icon', { skeleton });
  }, [skeleton]);

  return (
    <div className={className}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}
