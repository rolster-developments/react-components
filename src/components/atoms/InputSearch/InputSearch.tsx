import { useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RolsterReactInputControl } from '../../types';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';
import './InputSearch.css';

interface InputSearchProps {
  formControl?: RolsterReactInputControl<string>;
  disabled?: boolean;
  identifier?: string;
  onEnter?: () => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function RlsInputSearch({
  formControl,
  disabled,
  identifier,
  onEnter,
  onSearch,
  placeholder
}: InputSearchProps) {
  const [value, setValue] = useState('');

  const className = useMemo(() => {
    return renderClassStatus('rls-input-search', { disabled });
  }, [disabled]);

  const onValue = useCallback(
    (value: string) => {
      !formControl && setValue(() => value);
    },
    [formControl]
  );

  return (
    <div id={identifier} className={className}>
      <RlsInput
        formControl={formControl}
        placeholder={placeholder}
        onEnter={onEnter}
        onValue={onValue}
        disabled={disabled}
      >
        {formControl?.value ?? value}
      </RlsInput>

      {onSearch && (
        <RlsButtonAction icon="search" onClick={onSearch} disabled={disabled} />
      )}
    </div>
  );
}
