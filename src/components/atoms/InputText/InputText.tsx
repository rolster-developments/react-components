import { memo, useCallback, useState } from 'react';
import { PropsWithRlsSize } from '../../definitions';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';

interface InputTextProps extends InputProps<string>, PropsWithRlsSize {}

function RlsInputTextComponent(props: InputTextProps) {
  const { formControl, identifier, rlsSize, onValue, value } = props;

  const [valueInput, setValueInput] = useState(
    formControl?.value ?? value ?? ''
  );

  const onValueInput = useCallback(
    (value: string) => {
      if (!formControl) {
        setValueInput(value);
      }

      onValue?.(value);
    },
    [formControl, onValue]
  );

  return (
    <div id={identifier} className="rls-input-text" rls-size={rlsSize}>
      <RlsInput
        {...props}
        type="text"
        value={valueInput}
        onValue={onValueInput}
      >
        {formControl?.value ?? valueInput}
      </RlsInput>
    </div>
  );
}

export const RlsInputText = memo(RlsInputTextComponent);
