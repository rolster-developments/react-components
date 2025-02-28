import { useCallback, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RolsterControl } from '../../types';
import './InputPassword.css';

type InputPasswordType = 'password' | 'text';

interface InputPasswordProps extends RlsComponent {
  disabled?: boolean;
  formControl?: RolsterControl<string>;
  onValue?: (value: string) => void;
  placeholder?: string;
  type?: InputPasswordType;
}

export function RlsInputPassword({
  disabled,
  formControl,
  identifier,
  onValue,
  placeholder,
  type
}: InputPasswordProps) {
  const [focused, setFocused] = useState(false);

  const onChange = useCallback(
    (event: any) => {
      formControl?.setValue(event.target.value);
      onValue && onValue(event.target.value);
    },
    [formControl, onValue]
  );

  const onFocus = useCallback(() => {
    formControl?.focus();
    setFocused(() => true);
  }, [formControl]);

  const onBlur = useCallback(() => {
    formControl?.blur();
    setFocused(() => false);
  }, [formControl]);

  return (
    <div
      id={identifier}
      className={renderClassStatus('rls-input-password', {
        focused: formControl?.focused ?? focused,
        disabled: formControl?.disabled || disabled
      })}
    >
      <input
        className="rls-input-password__component"
        autoComplete="off"
        type={type ?? 'password'}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  );
}
