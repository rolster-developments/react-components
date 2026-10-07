import { memo, MouseEventHandler } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface ChipProps extends RlsComponent {
  contrasted?: boolean;
  disabled?: boolean;
  icon?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
}

function RlsChipComponent({
  children,
  className,
  contrasted,
  disabled,
  icon,
  identifier,
  onClick,
  onRemove,
  rlsTheme,
  selected
}: ChipProps) {
  const classNameChip = renderClassStatus(
    'rls-chip',
    { clickable: !!onClick && !disabled, contrasted, disabled, selected },
    className
  );

  return (
    <div
      id={identifier}
      className={classNameChip}
      rls-theme={rlsTheme}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <RlsIcon className="rls-chip__icon" value={icon} />}

      <span className="rls-chip__description">{children}</span>

      {onRemove && !disabled && (
        <button className="rls-chip__remove" type="button" onClick={onRemove}>
          <RlsIcon value="close" />
        </button>
      )}
    </div>
  );
}

export const RlsChip = memo(RlsChipComponent);
