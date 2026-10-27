import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithRlsSize } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface ButtonIconProps extends PropsWithRlsSize {
  icon: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  skeleton?: boolean;
}

function RlsButtonIconComponent({
  icon,
  className,
  disabled,
  rlsSize,
  onClick,
  skeleton
}: ButtonIconProps) {
  const classNameButton = renderClassStatus(
    'rls-button-icon',
    { skeleton },
    className
  );

  return (
    <button
      className={classNameButton}
      onClick={onClick}
      disabled={disabled}
      rls-size={rlsSize}
    >
      {!skeleton && <RlsIcon value={icon} />}
    </button>
  );
}

export const RlsButtonIcon = memo(RlsButtonIconComponent);
