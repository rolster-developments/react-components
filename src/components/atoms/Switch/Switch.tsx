import { ReactControl } from '@rolster/react-forms';
import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
import { useFormToggleController } from '../../../controllers/FormToggleController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface SwitchProps extends RlsComponent {
  checked: boolean;
  capsule?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface SwitchControlProps extends RlsComponent {
  formControl: ReactControl<HTMLElement, boolean>;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

function RlsSwitchComponent({
  checked,
  capsule,
  disabled,
  identifier,
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
    <div
      id={identifier}
      className={className}
      onClick={disabled ? undefined : onClick}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch__component">
        <div className="rls-switch__component__element"></div>
      </div>
    </div>
  );
}

export const RlsSwitch = memo(RlsSwitchComponent);

function RlsSwitchControlComponent({
  formControl,
  disabled,
  identifier,
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
    (event: MouseEvent<HTMLDivElement>) => {
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
      onClick={_onClick}
      rlsSize={rlsSize}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsSwitchControl = memo(RlsSwitchControlComponent);
