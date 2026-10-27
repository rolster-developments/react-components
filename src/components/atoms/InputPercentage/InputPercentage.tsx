import { memo, useCallback, useState } from 'react';
import { PropsWithRlsSize } from '../../definitions';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';

interface InputPercentageProps extends InputProps<number>, PropsWithRlsSize {
  decimals?: number;
}

function RlsInputPercentageComponent(props: InputPercentageProps) {
  const { formControl, identifier, rlsSize, onValue, value } = props;

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
    <div id={identifier} className="rls-input-percentage" rls-size={rlsSize}>
      <RlsInput
        {...props}
        type="number"
        value={valueInput}
        onValue={onValueInput}
      >
        {formControl?.value ?? valueInput}%
      </RlsInput>
    </div>
  );
}

export const RlsInputPercentage = memo(RlsInputPercentageComponent);
