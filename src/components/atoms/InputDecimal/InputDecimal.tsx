import { BigDecimal } from '@rolster/commons';
import { memo, useCallback, useMemo, useState } from 'react';
import { PropsWithRlsSize } from '../../definitions';
import { InputProps } from '../../types';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';

interface InputDecimalProps extends InputProps<BigDecimal>, PropsWithRlsSize {
  decimals?: number;
  symbol?: string;
}

function RlsInputDecimalComponent(props: InputDecimalProps) {
  const { decimals, formControl, identifier, rlsSize, onValue, symbol, value } =
    props;

  const [valueInput, setValueInput] = useState(
    (formControl?.value ?? value ?? BigDecimal.zero()).rounded
  );

  const amount = useMemo(() => {
    return formControl?.value?.rounded ?? valueInput;
  }, [formControl?.value, valueInput]);

  const onValueInput = useCallback(
    (value: number) => {
      const valueDecimal = BigDecimal.create(value);

      if (formControl) {
        formControl.setValue(valueDecimal);
      } else {
        setValueInput(value);
      }

      onValue?.(valueDecimal);
    },
    [formControl, onValue]
  );

  const decimalProps = { ...props, formControl: undefined };

  return (
    <div id={identifier} className="rls-input-decimal" rls-size={rlsSize}>
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

export const RlsInputDecimal = memo(RlsInputDecimalComponent);
