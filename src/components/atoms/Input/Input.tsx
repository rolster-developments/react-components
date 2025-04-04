import { ReactControl } from '@rolster/react-forms';
import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Input.css';

interface InputProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement>;
  onValue?: (value: any) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: any;
}

export function RlsInput({
  children,
  disabled,
  formControl,
  identifier,
  onValue,
  placeholder,
  type,
  value
}: InputProps) {
  const valueInitial = formControl?.value ?? value ? String(value) : '';

  const [valueInput, setValueInput] = useState(valueInitial);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const valueControl = formControl?.value ? String(formControl.value) : '';

    (!focused || valueInput !== valueControl) && setValueInput(valueControl);
  }, [formControl?.value]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const valueInput = event.target.value;
      const value = type === 'number' ? +valueInput : valueInput;

      onValue && onValue(value);
      setValueInput(valueInput);
      formControl?.setValue(value);
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
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        value={valueInput}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}
