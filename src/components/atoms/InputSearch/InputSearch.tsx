import { useState } from 'react';
import { RolsterControl } from '../../types';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';
import './InputSearch.css';

interface InputSearchProps {
  formControl?: RolsterControl<string>;
  identifier?: string;
  onSearch?: () => void;
  placeholder?: string;
}

export function RlsInputSearch({
  formControl,
  identifier,
  onSearch,
  placeholder
}: InputSearchProps) {
  const [value, setValue] = useState('');

  function onValueInput(value: string): void {
    !formControl && setValue(value);
  }

  return (
    <div id={identifier} className="rls-input-search">
      <RlsInput
        formControl={formControl}
        placeholder={placeholder}
        onValue={onValueInput}
      >
        {formControl?.value ?? value}
      </RlsInput>

      {onSearch && <RlsButtonAction icon="search" onClick={onSearch} />}
    </div>
  );
}
