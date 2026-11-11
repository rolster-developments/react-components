import { ReactControl } from '@rolster/react-forms';
import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
import { useFormToggleController } from '../../../controllers/FormToggleController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface SwitchProps extends RlsComponent {
  checked: boolean;
  capsule?: boolean;
  disabled?: boolean;
  labelledBy?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface SwitchControlProps extends RlsComponent {
  formControl: ReactControl<HTMLElement, boolean>;
  disabled?: boolean;
  labelledBy?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function RlsSwitchComponent({
  checked,
  capsule,
  disabled,
  identifier,
  labelledBy,
  rlsSize,
  onClick,
  rlsTheme
}: SwitchProps) {
  const className = renderClassStatus('rls-switch', {
    checked,
    capsule,
    disabled
  });

  return (
    <button
      id={identifier}
      type="button"
      role="switch"
      className={className}
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onClick}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <span className="rls-switch__component">
        <span className="rls-switch__component__element"></span>
      </span>
    </button>
  );
}

export const RlsSwitch = memo(RlsSwitchComponent);

function RlsSwitchControlComponent({
  formControl,
  disabled,
  identifier,
  labelledBy,
  onClick,
  rlsSize,
  rlsTheme
}: SwitchControlProps) {
  const disabledControl = formControl.disabled || disabled;

  const { checked, onToggle } = useFormToggleController({
    disabled: disabledControl,
    formControl
  });

  const _onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onToggle();

      onClick?.(event);
    },
    [onToggle, onClick]
  );

  return (
    <RlsSwitch
      identifier={identifier}
      checked={checked}
      disabled={disabledControl}
      labelledBy={labelledBy}
      onClick={_onClick}
      rlsSize={rlsSize}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsSwitchControl = memo(RlsSwitchControlComponent);
