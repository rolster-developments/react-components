import { KeyboardEvent, useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { InputProps } from '../../types';
import './InputPassword.css';

type InputPasswordType = 'password' | 'text';

interface InputPasswordProps extends InputProps<string>, RlsComponent {
  type?: InputPasswordType;
}

export function RlsInputPassword({
  disabled,
  formControl,
  identifier,
  onEnter,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  type
}: InputPasswordProps) {
  const [focused, setFocused] = useState(false);

  const _onChange = useCallback(
    (event: any) => {
      formControl?.setValue(event.target.value);
      onValue && onValue(event.target.value);
    },
    [formControl, onValue]
  );

  const _onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown && onKeyDown(event);

      event.code === 'NumpadEnter' && onEnter && onEnter();
    },
    [onKeyDown, onEnter]
  );

  const _onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyUp && onKeyUp(event);
    },
    [onKeyUp]
  );

  const _onFocus = useCallback(() => {
    formControl?.focus();
    setFocused(() => true);
  }, [formControl]);

  const _onBlur = useCallback(() => {
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
        onFocus={_onFocus}
        onBlur={_onBlur}
        onChange={_onChange}
        onKeyDown={_onKeyDown}
        onKeyUp={_onKeyUp}
      />
    </div>
  );
}
