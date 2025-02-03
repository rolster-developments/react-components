import { RlsButtonAction } from '../ButtonAction/ButtonAction';
import { RolsterControl } from '../../types';
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
  return (
    <div id={identifier} className="rls-input-search">
      <RlsInput formControl={formControl} placeholder={placeholder} />
      {onSearch && <RlsButtonAction icon="search" onClick={onSearch} />}
    </div>
  );
}
