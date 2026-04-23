import { ReactControl } from '@rolster/react-forms';
import { useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface SwitchProps extends RlsComponent {
  checked: boolean;
  capsule?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface SwitchControlProps extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitch({
  checked,
  capsule,
  disabled,
  identifier,
  onClick,
  rlsTheme
}: SwitchProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-switch', { checked, capsule, disabled });
  }, [checked, capsule, disabled]);

  return (
    <div
      id={identifier}
      className={className}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch__component">
        <div className="rls-switch__component__element"></div>
      </div>
    </div>
  );
}

export function RlsSwitchControl({
  formControl,
  disabled,
  identifier,
  rlsTheme
}: SwitchControlProps) {
  const onClick = useCallback(() => {
    formControl.setValue(!formControl.value);
  }, [formControl.value]);

  return (
    <RlsSwitch
      identifier={identifier}
      checked={formControl.value}
      disabled={disabled}
      onClick={onClick}
      rlsTheme={rlsTheme}
    />
  );
}
