import { useCallback, useState } from 'react';
import { InputProps } from '../../types';
import { RlsInput } from '../Input/Input';
import './InputText.css';

export function RlsInputText(props: InputProps<string>) {
  const { formControl, identifier, onValue, value } = props;

  const [valueInput, setValueInput] = useState(
    formControl?.value ?? value ?? ''
  );

  const onValueInput = useCallback(
    (value: string) => {
      !formControl && setValueInput(value);
      onValue && onValue(value);
    },
    [formControl, onValue]
  );

  return (
    <div id={identifier} className="rls-input-text">
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
