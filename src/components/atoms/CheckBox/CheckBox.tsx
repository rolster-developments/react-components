import { ReactControl } from '@rolster/react-forms';
import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
import { useFormToggleController } from '../../../controllers/FormToggleController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface CheckBoxProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  labelledBy?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface CheckBoxControlProps extends RlsComponent {
  formControl: ReactControl<HTMLElement, boolean>;
  disabled?: boolean;
  labelledBy?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function RlsCheckBoxComponent({
  checked,
  disabled,
  identifier,
  labelledBy,
  rlsSize,
  onClick,
  rlsTheme
}: CheckBoxProps) {
  const className = renderClassStatus('rls-checkbox', { checked, disabled });

  if (!onClick) {
    return (
      <span
        id={identifier}
        className={className}
        aria-hidden="true"
        rls-size={rlsSize}
        rls-theme={rlsTheme}
      >
        <RlsIcon value="checkmark" />
      </span>
    );
  }

  return (
    <button
      id={identifier}
      type="button"
      role="checkbox"
      className={className}
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onClick}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <RlsIcon value="checkmark" />
    </button>
  );
}

export const RlsCheckBox = memo(RlsCheckBoxComponent);

function RlsCheckBoxControlComponent({
  formControl,
  disabled,
  identifier,
  labelledBy,
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
    (event: MouseEvent<HTMLButtonElement>) => {
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
      labelledBy={labelledBy}
      onClick={_onClick}
      rlsSize={rlsSize}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsCheckBoxControl = memo(RlsCheckBoxControlComponent);
