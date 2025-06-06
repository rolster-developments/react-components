import { useCallback, useState } from 'react';
import { RolsterReactInputControl } from '../../types';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';
import './InputSearch.css';

interface InputSearchProps {
  formControl?: RolsterReactInputControl<string>;
  identifier?: string;
  onEnter?: () => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function RlsInputSearch({
  formControl,
  identifier,
  onEnter,
  onSearch,
  placeholder
}: InputSearchProps) {
  const [value, setValue] = useState('');

  const onValue = useCallback(
    (value: string) => {
      !formControl && setValue(() => value);
    },
    [formControl]
  );

  return (
    <div id={identifier} className="rls-input-search">
      <RlsInput
        formControl={formControl}
        placeholder={placeholder}
        onEnter={onEnter}
        onValue={onValue}
      >
        {formControl?.value ?? value}
      </RlsInput>

      {onSearch && <RlsButtonAction icon="search" onClick={onSearch} />}
    </div>
  );
}
