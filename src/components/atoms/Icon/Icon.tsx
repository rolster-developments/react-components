import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import {
  PropsWithClassName,
  PropsWithRlsSize,
  PropsWithRlsTheme
} from '../../definitions';

interface IconProps
  extends PropsWithClassName, PropsWithRlsTheme, PropsWithRlsSize {
  value: string;
  skeleton?: boolean;
}

function RlsIconComponent({
  value,
  className,
  rlsSize,
  rlsTheme,
  skeleton
}: IconProps) {
  const classNameIcon = renderClassStatus('rls-icon', { skeleton }, className);

  return (
    <div className={classNameIcon} rls-size={rlsSize} rls-theme={rlsTheme}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}

export const RlsIcon = memo(RlsIconComponent);
