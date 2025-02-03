import { ReactControl } from '@rolster/react-forms';
import { RlsComponent } from './definitions';

export type RolsterControl<T = any> =
  | ReactControl<HTMLInputElement, T>
  | ReactControl<HTMLInputElement, T | undefined>;

export interface InputProps<T = any> {
  disabled?: boolean;
  formControl?: RolsterControl<T>;
  identifier?: string;
  onValue?: (value: T) => void;
  placeholder?: string;
  value?: T;
}

export interface FieldBoxProps<T = any> extends InputProps<T>, RlsComponent {
  msgErrorDisabled?: boolean;
}
