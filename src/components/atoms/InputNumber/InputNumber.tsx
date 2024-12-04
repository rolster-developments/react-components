import { useState } from 'react';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

export function RlsInputNumber({
  disabled,
  formControl,
  onValue,
  placeholder,
  value
}: InputProps<number>) {
  const [valueInput, setValueInput] = useState(value ?? 0);

  function onChange(value: number): void {
    !formControl && setValueInput(value);
    onValue && onValue(value);
  }

  return (
    <div className="rls-input-number">
      <RlsInput
        formControl={formControl}
        type="number"
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
