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
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import { InputProps as RolsterInputProps } from '../../types';
import './Input.css';

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
  onEnter,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  type,
  value
}: InputProps) {
  const valueInitial = formControl?.value ?? value ? String(value) : '';

  const [valueInput, setValueInput] = useState(valueInitial);
  const [focused, setFocused] = useState(false);

  const isChangeInternal = useRef(false);

  useEffect(() => {
    if (!isChangeInternal.current) {
      const control = formControl?.value ? String(formControl.value) : '';

      valueInput !== control && setValueInput(control);
    }

    isChangeInternal.current = false;
  }, [formControl?.value]);

  const _onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const valueInput = event.target.value;

      const value =
        type === 'number'
          ? parseFloat((+valueInput).toFixed(decimals))
          : valueInput;

      isChangeInternal.current = true;

      onValue && onValue(value);
      setValueInput(valueInput);
      formControl?.setValue(value);
    },
    [formControl, onValue, type, decimals]
  );

  const _onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown && onKeyDown(event);

      event.key === 'Enter' && onEnter && onEnter();
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
        onFocus={_onFocus}
        onBlur={_onBlur}
        onChange={_onChange}
        onKeyDown={_onKeyDown}
        onKeyUp={_onKeyUp}
        value={valueInput}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}
