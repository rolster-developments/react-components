import { ReactControl } from '@rolster/react-forms';
import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
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
  stopPropagation?: boolean;
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
      onClick={onClick}
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
  rlsSize,
  rlsTheme,
  stopPropagation
}: SwitchControlProps) {
  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      formControl.setValue(!formControl.value);

      if (stopPropagation) {
        event.stopPropagation();
      }
    },
    [formControl.value, stopPropagation]
  );

  return (
    <RlsSwitch
      identifier={identifier}
      checked={formControl.value}
      disabled={disabled}
      onClick={onClick}
      rlsSize={rlsSize}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsSwitchControl = memo(RlsSwitchControlComponent);
