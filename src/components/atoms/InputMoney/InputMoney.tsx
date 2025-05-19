import { useCallback, useState } from 'react';
import { InputProps } from '../../types';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputMoney.css';

interface InputMoneyProps extends InputProps<number> {
  decimals?: boolean;
  symbol?: string;
}

export function RlsInputMoney(props: InputMoneyProps) {
  const { decimals, formControl, identifier, onValue, symbol, value } = props;

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
        {...props}
        type="number"
        value={valueInput}
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
