import { useState } from 'react';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';
import './InputText.css';

export function RlsInputText({
  disabled,
  formControl,
  onValue,
  placeholder,
  value
}: InputProps<string>) {
  const [valueInput, setValueInput] = useState(value ?? '');

  function onChange(value: string): void {
    !formControl && setValueInput(value);
    onValue && onValue(value);
  }

  return (
    <div className="rls-input-text">
      <RlsInput
        formControl={formControl}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onChange}
      >
        {formControl?.value ?? value ?? valueInput}
      </RlsInput>
    </div>
  );
}
