import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent } from 'react';
import { RlsComponent } from './definitions';

export type RolsterReactInputControl<T = any> =
  | ReactControl<HTMLInputElement, T>
  | ReactControl<HTMLInputElement, T | undefined>;

export interface InputProps<T = any> {
  disabled?: boolean;
  formControl?: RolsterReactInputControl<T>;
  identifier?: string;
  onBlur?: () => void;
  onEnter?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onValue?: (value: T) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: T;
}

export interface FieldBoxProps<T = any> extends InputProps<T>, RlsComponent {
  msgErrorDisabled?: boolean;
}
