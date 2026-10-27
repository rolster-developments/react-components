import { memo, useCallback, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithRlsSize } from '../../definitions';
import { RolsterReactInputControl } from '../../types';
import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RlsInput } from '../Input/Input';

interface InputSearchProps extends PropsWithRlsSize {
  disabled?: boolean;
  formControl?: RolsterReactInputControl<string>;
  identifier?: string;
  onEnter?: () => void;
  onSearch?: () => void;
  placeholder?: string;
}

function RlsInputSearchComponent({
  formControl,
  disabled,
  identifier,
  rlsSize,
  onEnter,
  onSearch,
  placeholder
}: InputSearchProps) {
  const [value, setValue] = useState('');

  const className = renderClassStatus('rls-input-search', { disabled });

  const onValue = useCallback(
    (value: string) => {
      if (!formControl) {
        setValue(() => value);
      }
    },
    [formControl]
  );

  return (
    <div id={identifier} className={className} rls-size={rlsSize}>
      <RlsInput
        formControl={formControl}
        placeholder={placeholder}
        rlsSize={rlsSize}
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

export const RlsInputSearch = memo(RlsInputSearchComponent);
