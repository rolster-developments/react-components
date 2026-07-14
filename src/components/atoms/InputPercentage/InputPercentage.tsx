import { useCallback, useState } from 'react';

import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';

interface InputPercentageProps extends InputProps<number> {
  decimals?: number;
}

export function RlsInputPercentage(props: InputPercentageProps) {
  const { formControl, identifier, onValue, value } = props;

  const [valueInput, setValueInput] = useState(
    formControl?.value ?? value ?? 0
  );

  const onValueInput = useCallback(
    (value: number) => {
      !formControl && setValueInput(value);
      onValue?.(value);
    },
    [formControl, onValue]
  );

  return (
    <div id={identifier} className="rls-input-percentage">
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
