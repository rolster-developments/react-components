import { useState } from 'react';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';
import './InputText.css';

export function RlsInputText({
  disabled,
  formControl,
  identifier,
  onValue,
  placeholder,
  value
}: InputProps<string>) {
  const [valueInput, setValueInput] = useState(value ?? '');

  function onValueInput(value: string): void {
    !formControl && setValueInput(value);
    onValue && onValue(value);
  }

  return (
    <div id={identifier} className="rls-input-text">
      <RlsInput
        formControl={formControl}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onValueInput}
      >
        {formControl?.value ?? value ?? valueInput}
      </RlsInput>
    </div>
  );
}
