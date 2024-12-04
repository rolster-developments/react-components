import { useState } from 'react';
import { InputProps } from '../../types';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputMoney.css';

interface InputMoneyProps extends InputProps<number> {
  decimals?: boolean;
  symbol?: string;
}

export function RlsInputMoney({
  decimals,
  disabled,
  formControl,
  onValue,
  placeholder,
  symbol,
  value
}: InputMoneyProps) {
  const [valueInput, setValueInput] = useState(value || 0);

  function onChange(value: number): void {
    !formControl && setValueInput(value);
    onValue && onValue(value);
  }

  return (
    <div className="rls-input-money">
      <RlsInput
        formControl={formControl}
        type="number"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onChange}
      >
        <RlsAmount
          value={formControl?.value ?? value ?? valueInput}
          symbol={symbol}
          decimals={decimals}
        />
      </RlsInput>
    </div>
  );
}
