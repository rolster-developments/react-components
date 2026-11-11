import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { InputProps } from '../../types';

type InputPasswordType = 'password' | 'text';

interface InputPasswordProps extends InputProps<string>, RlsComponent {
  type?: InputPasswordType;
}

function RlsInputPasswordComponent({
  disabled,
  formControl,
  identifier,
  rlsSize,
  onBlur,
  onEnter,
  onFocus,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  type,
  value: valueProp
}: InputPasswordProps) {
  const [valueInput, setValueInput] = useState(
    () => formControl?.value ?? valueProp ?? ''
  );

  const [focused, setFocused] = useState(false);

  const valueSent = useRef<unknown>(formControl?.value);

  useEffect(() => {
    if (formControl && !Object.is(formControl.value, valueSent.current)) {
      const valueControl = formControl.value ?? '';

      if (valueInput !== valueControl) {
        setValueInput(valueControl);
      }
    }
  }, [formControl?.value]);

  const _onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      valueSent.current = value;

      setValueInput(value);
      onValue?.(value);
      formControl?.setValue(value);
    },
    [formControl, onValue]
  );

  const _onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.key === 'Enter') {
        onEnter?.(event);
      }
    },
    [onKeyDown, onEnter]
  );

  const _onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(event);
    },
    [onKeyUp]
  );

  const _onFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      formControl?.focus();
      setFocused(() => true);
      onFocus?.(event);
    },
    [formControl, onFocus]
  );

  const _onBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      formControl?.blur();
      setFocused(() => false);
      onBlur?.(event);
    },
    [formControl, onBlur]
  );

  const disabledInput = formControl?.disabled || disabled;

  const className = renderClassStatus('rls-input-password', {
    disabled: disabledInput,
    focused: formControl?.focused ?? focused
  });

  return (
    <div id={identifier} className={className} rls-size={rlsSize}>
      <input
        ref={formControl?.elementRef}
        className="rls-input-password__component"
        autoComplete="off"
        type={type ?? 'password'}
        placeholder={placeholder}
        disabled={disabledInput}
        readOnly={readOnly}
        value={valueInput}
        onFocus={_onFocus}
        onBlur={_onBlur}
        onChange={_onChange}
        onKeyDown={_onKeyDown}
        onKeyUp={_onKeyUp}
      />
    </div>
  );
}

export const RlsInputPassword = memo(RlsInputPasswordComponent);
