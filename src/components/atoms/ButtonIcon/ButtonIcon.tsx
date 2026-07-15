import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../Icon/Icon';

interface ButtonIconProps {
  icon: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  skeleton?: boolean;
}

export function RlsButtonIcon({
  icon,
  className,
  disabled,
  onClick,
  skeleton
}: ButtonIconProps) {
  const classNameButton = useMemo(() => {
    return renderClassStatus('rls-button-icon', { skeleton }, className);
  }, [className, skeleton]);

  return (
    <button className={classNameButton} onClick={onClick} disabled={disabled}>
      {!skeleton && <RlsIcon value={icon} />}
    </button>
  );
}
