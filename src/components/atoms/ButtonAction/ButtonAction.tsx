import { MouseEventHandler, useMemo } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import { RlsButtonType } from '../../../types';
import { renderClassStatus } from '../../../helpers/css';

interface ButtonActionProps extends RlsComponent {
  icon: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
  type?: RlsButtonType;
}

export function RlsButtonAction({
  icon,
  disabled,
  identifier,
  onClick,
  rlsTheme,
  tooltip,
  type
}: ButtonActionProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-button-action', { type });
  }, [type]);

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
      </div>
      {tooltip && (
        <div className="rls-button-action__tooltip rls-overline-font-medium">
          <span>{tooltip}</span>
        </div>
      )}
    </button>
  );
}
