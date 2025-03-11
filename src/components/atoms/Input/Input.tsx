import { ReactControl } from '@rolster/react-forms';
import { HTMLInputTypeAttribute, useCallback, useMemo, useState } from 'react';
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
  const [focused, setFocused] = useState(false);

  const onChange = useCallback(
    (event: any) => {
      const value =
        type === 'number' ? +event.target.value : event.target.value;

      onValue && onValue(value);
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
        value={formControl?.value || value || ''}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}
