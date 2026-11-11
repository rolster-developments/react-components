import { memo, MouseEventHandler } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface RadioButtonProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  labelledBy?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function RlsRadioButtonComponent({
  checked,
  disabled,
  identifier,
  labelledBy,
  rlsSize,
  rlsTheme,
  onClick
}: RadioButtonProps) {
  const className = renderClassStatus('rls-radiobutton', { checked, disabled });

  if (!onClick) {
    return (
      <span
        id={identifier}
        className={className}
        aria-hidden="true"
        rls-size={rlsSize}
        rls-theme={rlsTheme}
      >
        <span className="rls-radiobutton__component"></span>
      </span>
    );
  }

  return (
    <button
      id={identifier}
      type="button"
      role="radio"
      className={className}
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onClick}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <span className="rls-radiobutton__component"></span>
    </button>
  );
}

export const RlsRadioButton = memo(RlsRadioButtonComponent);
