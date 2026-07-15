import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent } from 'react';
import { RlsComponent } from './definitions';

export type RolsterReactInputControl<T = any> =
  | ReactControl<HTMLInputElement, T>
  | ReactControl<HTMLInputElement, T | undefined>;

export type RolsterReactHtmlControl<T = any> =
  | ReactControl<HTMLElement, T>
  | ReactControl<HTMLElement, T | undefined>;

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

export interface FieldProps<T = any> extends InputProps<T>, RlsComponent {
  groupModeEnabled?: boolean;
  msgErrorDisabled?: boolean;
}

export type ImageRatio = '1:1' | '3:4' | '4:3' | '3:2' | '8:5' | '16:9';

export type ImageMymeType =
  | 'image/png'
  | 'image/jpg'
  | 'image/jpeg'
  | 'image/bmp'
  | 'image/webp';
