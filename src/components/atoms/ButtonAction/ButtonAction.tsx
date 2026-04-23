import { MouseEventHandler } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface ButtonActionProps extends RlsComponent {
  icon: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
}

export function RlsButtonAction({
  icon,
  disabled,
  identifier,
  onClick,
  tooltip
}: ButtonActionProps) {
  return (
    <button
      id={identifier}
      className="rls-button-action"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="rls-button-action__content">
        <RlsIcon value={icon} />
      </div>
      {tooltip && (
        <div className="rls-button-action__tooltip rls-overline-medium">
          <span>{tooltip}</span>
        </div>
      )}
    </button>
  );
}
