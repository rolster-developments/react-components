import { useCallback, useMemo, useState } from 'react';
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
  readOnly?:boolean
  type?: InputPasswordType;
}

export function RlsInputPassword({
  disabled,
  formControl,
  identifier,
  onValue,
  placeholder,
  readOnly,
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

  const className = useMemo(() => {
    return renderClassStatus('rls-input-password', {
      disabled: formControl?.disabled || disabled,
      focused: formControl?.focused ?? focused
    });
  }, [formControl?.focused, formControl?.disabled, focused, disabled]);

  return (
    <div id={identifier} className={className}>
      <input
        className="rls-input-password__component"
        autoComplete="off"
        type={type ?? 'password'}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  );
}
