import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';
import './Icon.css';

interface IconProps extends PropsWithClassName, PropsWithRlsTheme {
  value: string;
  skeleton?: boolean;
}

export function RlsIcon({ value, className, rlsTheme, skeleton }: IconProps) {
  const classNameIcon = useMemo(() => {
    return renderClassStatus('rls-icon', { skeleton }, className);
  }, [className, skeleton]);

  return (
    <div className={classNameIcon} rls-theme={rlsTheme}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}
