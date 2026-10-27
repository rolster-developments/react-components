import { memo, useCallback, useState } from 'react';
import { PropsWithRlsSize } from '../../definitions';
import { InputProps } from '../../types';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';

interface InputMoneyProps extends InputProps<number>, PropsWithRlsSize {
  decimals?: number;
  symbol?: string;
}

function RlsInputMoneyComponent(props: InputMoneyProps) {
  const { decimals, formControl, identifier, rlsSize, onValue, symbol, value } =
    props;

  const [valueInput, setValueInput] = useState(
    formControl?.value ?? value ?? 0
  );

  const onValueInput = useCallback(
    (value: number) => {
      if (!formControl) {
        setValueInput(value);
      }
      onValue?.(value);
    },
    [formControl, onValue]
  );

  return (
    <div id={identifier} className="rls-input-money" rls-size={rlsSize}>
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

export const RlsInputMoney = memo(RlsInputMoneyComponent);
