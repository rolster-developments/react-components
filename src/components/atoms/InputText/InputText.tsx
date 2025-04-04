import { useCallback, useState } from 'react';
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
  const [valueInput, setValueInput] = useState(
    formControl?.value ?? value ?? ''
  );

  const onValueInput = useCallback(
    (value: string) => {
      !formControl && setValueInput(value);
      onValue && onValue(value);
    },
    [formControl, onValue]
  );

  return (
    <div id={identifier} className="rls-input-text">
      <RlsInput
        formControl={formControl}
        type="text"
        value={valueInput}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onValueInput}
      >
        {formControl?.value ?? valueInput}
      </RlsInput>
    </div>
  );
}
