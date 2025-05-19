import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent } from 'react';
import { RlsComponent } from './definitions';

export type RolsterControl<T = any> =
  | ReactControl<HTMLInputElement, T>
  | ReactControl<HTMLInputElement, T | undefined>;

export interface InputProps<T = any> {
  disabled?: boolean;
  formControl?: RolsterControl<T>;
  identifier?: string;
  onEnter?: () => void;
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
