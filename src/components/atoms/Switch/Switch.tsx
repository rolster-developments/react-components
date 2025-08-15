import { ReactControl } from '@rolster/react-forms';
import { useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Switch.css';

interface SwitchProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface Props extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitch({
  checked,
  disabled,
  identifier,
  onClick,
  rlsTheme
}: SwitchProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-switch', { checked, disabled });
  }, [checked, disabled]);

  return (
    <div
      id={identifier}
      className={className}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch__component">
        <div className="rls-switch__component__element"></div>
        <div className="rls-switch__component__bar"></div>
      </div>
    </div>
  );
}

export function RlsSwitchControl({
  formControl,
  disabled,
  identifier,
  rlsTheme
}: Props) {
  const onClick = useCallback(() => {
    formControl.setValue(!formControl.value);
  }, [formControl.value]);

  return (
    <RlsSwitch
      identifier={identifier}
      checked={formControl.value || false}
      disabled={disabled}
      onClick={onClick}
      rlsTheme={rlsTheme}
    />
  );
}
