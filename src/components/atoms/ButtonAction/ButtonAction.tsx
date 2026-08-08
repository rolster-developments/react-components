import { memo, MouseEventHandler } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonType } from '../../../types';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface ButtonActionProps extends RlsComponent {
  icon: string;
  badge?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
  type?: RlsButtonType;
}

function RlsButtonActionComponent({
  icon,
  badge,
  disabled,
  identifier,
  onClick,
  rlsTheme,
  tooltip,
  type
}: ButtonActionProps) {
  const className = renderClassStatus('rls-button-action', { type });

  return (
    <button
      id={identifier}
      className={className}
      onClick={onClick}
      disabled={disabled}
      rls-theme={rlsTheme}
    >
      <div className="rls-button-action__content">
        <RlsIcon value={icon} />

        {badge && <span className="rls-button-action__badge">{badge}</span>}
      </div>
      {tooltip && (
        <div className="rls-button-action__tooltip rls-overline-font-medium">
          <span>{tooltip}</span>
        </div>
      )}
    </button>
  );
}

export const RlsButtonAction = memo(RlsButtonActionComponent);
