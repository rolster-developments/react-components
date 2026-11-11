import { ReactControl } from '@rolster/react-forms';
import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
import { useFormToggleController } from '../../../controllers/FormToggleController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface CheckBoxProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface CheckBoxControlProps extends RlsComponent {
  formControl: ReactControl<HTMLElement, boolean>;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

function RlsCheckBoxComponent({
  checked,
  disabled,
  identifier,
  rlsSize,
  onClick,
  rlsTheme
}: CheckBoxProps) {
  const className = renderClassStatus('rls-checkbox', { checked, disabled });

  return (
    <div
      id={identifier}
      className={className}
      onClick={disabled ? undefined : onClick}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <RlsIcon value="checkmark" />
    </div>
  );
}

export const RlsCheckBox = memo(RlsCheckBoxComponent);

function RlsCheckBoxControlComponent({
  formControl,
  disabled,
  identifier,
  onClick,
  rlsSize,
  rlsTheme
}: CheckBoxControlProps) {
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
    <RlsCheckBox
      identifier={identifier}
      checked={checked}
      disabled={disabledControl}
      onClick={_onClick}
      rlsSize={rlsSize}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsCheckBoxControl = memo(RlsCheckBoxControlComponent);
