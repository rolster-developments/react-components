import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { InputProps as RolsterInputProps } from '../../types';

interface InputProps extends RolsterInputProps<any>, RlsComponent {
  decimals?: number;
  type?: HTMLInputTypeAttribute;
}

export function RlsInput({
  children,
  decimals,
  disabled,
  formControl,
  identifier,
  onBlur,
  onEnter,
  onFocus,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  type,
  value
}: InputProps) {
  const valueInitial = (formControl?.value ?? value) ? String(value) : '';

  const [valueInput, setValueInput] = useState(valueInitial);
  const [focused, setFocused] = useState(false);

  const changeIsInternal = useRef(false);

  useEffect(() => {
    if (!changeIsInternal.current && formControl) {
      const valueControl = formControl.value ? String(formControl.value) : '';

      if (valueInput !== valueControl) {
        setValueInput(valueControl);
      }
    }

    changeIsInternal.current = false;
  }, [formControl?.value]);

  const onChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const valueInput = event.target.value;

      const value =
        type === 'number'
          ? parseFloat((+valueInput).toFixed(decimals))
          : valueInput;

      changeIsInternal.current = true;

      onValue?.(value);
      setValueInput(valueInput);
      formControl?.setValue(value);
    },
    [formControl, onValue, type, decimals]
  );

  const onKeyDownInput = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.key === 'Enter') {
        onEnter?.();
      }
    },
    [onKeyDown, onEnter]
  );

  const onKeyUpInput = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(event);
    },
    [onKeyUp]
  );

  const onFocusInput = useCallback(() => {
    formControl?.focus();
    setFocused(() => true);
    onFocus?.();
  }, [formControl, onFocus]);

  const onBlurInput = useCallback(() => {
    formControl?.blur();
    setFocused(() => false);
    onBlur?.();
  }, [formControl, onBlur]);

  const className = useMemo(() => {
    return renderClassStatus('rls-input', {
      disabled: formControl?.disabled || disabled,
      focused: formControl?.focused ?? focused
    });
  }, [formControl?.focused, formControl?.disabled, focused, disabled]);

  return (
    <div id={identifier} className={className}>
      <input
        ref={formControl?.elementRef}
        className="rls-input__component"
        autoComplete="off"
        type={type ?? 'text'}
        placeholder={placeholder}
        disabled={formControl?.disabled || disabled}
        readOnly={readOnly}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
        onChange={onChangeInput}
        onKeyDown={onKeyDownInput}
        onKeyUp={onKeyUpInput}
        value={valueInput}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}
