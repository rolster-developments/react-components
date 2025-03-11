import { ReactControl } from '@rolster/react-forms';
import { useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './CheckBox.css';

interface CheckBoxProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface CheckBoxControlProps extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsCheckBox({
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
      <div className="rls-checkbox__component"></div>
    </div>
  );
}

export function RlsCheckBoxControl({
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
