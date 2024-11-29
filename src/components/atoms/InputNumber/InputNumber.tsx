import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

interface InputNumberProps {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsInputNumber({
  disabled,
  formControl,
  placeholder,
  value,
  onValue
}: InputNumberProps) {
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
