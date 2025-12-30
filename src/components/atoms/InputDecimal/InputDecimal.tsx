import { BigDecimal } from '@rolster/commons';
import { useCallback, useMemo, useState } from 'react';
import { InputProps } from '../../types';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputDecimal.css';

interface InputDecimalProps extends InputProps<BigDecimal> {
  decimals?: number;
  symbol?: string;
}

export function RlsInputDecimal(props: InputDecimalProps) {
  const { decimals, formControl, identifier, onValue, symbol, value } = props;

  const [valueInput, setValueInput] = useState(
    (formControl?.value ?? value ?? BigDecimal.zero()).rounded
  );

  const amount = useMemo(() => {
    return formControl?.value?.rounded ?? valueInput;
  }, [formControl?.value, valueInput]);

  const onValueInput = useCallback(
    (value: number) => {
      const valueDecimal = BigDecimal.create(value);

      formControl ? formControl.setValue(valueDecimal) : setValueInput(value);

      onValue?.(valueDecimal);
    },
    [formControl, onValue]
  );

  const decimalProps = { ...props, formControl: undefined };

  return (
    <div id={identifier} className="rls-input-decimal">
      <RlsInput
        {...decimalProps}
        type="number"
        value={valueInput}
        onValue={onValueInput}
      >
        <RlsAmount value={amount} symbol={symbol} decimals={decimals} />
      </RlsInput>
    </div>
  );
}
