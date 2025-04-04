import { useCallback, useState } from 'react';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

export function RlsInputNumber({
  disabled,
  formControl,
  identifier,
  onValue,
  placeholder,
  value
}: InputProps<number>) {
  const [valueInput, setValueInput] = useState(
    formControl?.value ?? value ?? 0
  );

  const onValueInput = useCallback(
    (value: number) => {
      !formControl && setValueInput(value);
      onValue && onValue(value);
    },
    [formControl, onValue]
  );

  return (
    <div id={identifier} className="rls-input-number">
      <RlsInput
        formControl={formControl}
        type="number"
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
