import { useCallback, useState } from 'react';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

interface InputNumberProps extends InputProps<number> {
  decimals?: number;
}

export function RlsInputNumber(props: InputNumberProps) {
  const { formControl, identifier, onValue, value } = props;

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
        {...props}
        type="number"
        value={valueInput}
        onValue={onValueInput}
      >
        {formControl?.value ?? valueInput}
      </RlsInput>
    </div>
  );
}
