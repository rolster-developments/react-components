import { Double } from '@rolster/commons';
import { useCallback, useMemo, useState } from 'react';
import { InputProps } from '../../types';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputDouble.css';

interface InputDoubleProps extends InputProps<Double> {
  decimals?: number;
  symbol?: string;
}

export function RlsInputDouble(props: InputDoubleProps) {
  const { decimals, formControl, identifier, onValue, symbol, value } = props;

  const [valueInput, setValueInput] = useState(
    (formControl?.value ?? value ?? Double.zero()).fixed
  );

  const amount = useMemo(() => {
    return formControl?.value?.fixed ?? valueInput;
  }, [formControl?.value, valueInput]);

  const onValueInput = useCallback(
    (value: number) => {
      const valueDouble = Double.create(value);

      formControl ? formControl.setValue(valueDouble) : setValueInput(value);

      onValue && onValue(valueDouble);
    },
    [formControl, onValue]
  );

  const doubleProps = { ...props, formControl: undefined };

  return (
    <div id={identifier} className="rls-input-double">
      <RlsInput
        {...doubleProps}
        type="number"
        value={valueInput}
        onValue={onValueInput}
      >
        <RlsAmount value={amount} symbol={symbol} decimals={decimals} />
      </RlsInput>
    </div>
  );
}
