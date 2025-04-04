import { useCallback, useState } from 'react';
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
  identifier,
  onValue,
  placeholder,
  symbol,
  value
}: InputMoneyProps) {
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
    <div id={identifier} className="rls-input-money">
      <RlsInput
        formControl={formControl}
        type="number"
        value={valueInput}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onValueInput}
      >
        <RlsAmount
          value={formControl?.value ?? valueInput}
          symbol={symbol}
          decimals={decimals}
        />
      </RlsInput>
    </div>
  );
}
