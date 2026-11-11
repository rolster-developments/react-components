import { KeyboardEventHandler, memo, MouseEventHandler, Ref } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithRlsSize } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface ButtonIconProps extends PropsWithRlsSize {
  icon: string;
  className?: string;
  disabled?: boolean;
  expanded?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLButtonElement>;
  skeleton?: boolean;
}

function RlsButtonIconComponent({
  icon,
  className,
  disabled,
  expanded,
  rlsSize,
  onClick,
  onKeyDown,
  ref,
  skeleton
}: ButtonIconProps) {
  const classNameButton = renderClassStatus(
    'rls-button-icon',
    { skeleton },
    className
  );

  return (
    <button
      ref={ref}
      type="button"
      className={classNameButton}
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : 'listbox'}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      rls-size={rlsSize}
    >
      {!skeleton && <RlsIcon value={icon} />}
    </button>
  );
}

export const RlsButtonIcon = memo(RlsButtonIconComponent);
