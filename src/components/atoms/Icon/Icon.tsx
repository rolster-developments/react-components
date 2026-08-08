import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';

interface IconProps extends PropsWithClassName, PropsWithRlsTheme {
  value: string;
  skeleton?: boolean;
}

function RlsIconComponent({ value, className, rlsTheme, skeleton }: IconProps) {
  const classNameIcon = renderClassStatus('rls-icon', { skeleton }, className);

  return (
    <div className={classNameIcon} rls-theme={rlsTheme}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}

export const RlsIcon = memo(RlsIconComponent);
