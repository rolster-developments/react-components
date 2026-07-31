import { ReactControl } from '@rolster/react-forms';
import { memo, useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface CheckBoxProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface CheckBoxControlProps extends RlsComponent {
  formControl: ReactControl<HTMLElement, boolean>;
  disabled?: boolean;
}

function RlsCheckBoxComponent({
  checked,
  disabled,
  identifier,
  onClick,
  rlsTheme
}: CheckBoxProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-checkbox', { checked, disabled });
  }, [checked, disabled]);

  return (
    <div
      id={identifier}
      className={className}
      onClick={onClick}
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
  rlsTheme
}: CheckBoxControlProps) {
  const onClick = useCallback(() => {
    formControl.setValue(!formControl.value);
  }, [formControl.value]);

  return (
    <RlsCheckBox
      identifier={identifier}
      checked={!!formControl.value}
      disabled={disabled}
      onClick={onClick}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsCheckBoxControl = memo(RlsCheckBoxControlComponent);
