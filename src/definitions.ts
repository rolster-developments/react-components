import { RefObject } from 'react';
import { RlsDesignSystem } from './types';

export const DEFAULT_DESIGN_SYSTEM: RlsDesignSystem = 'bordered';

export interface ListControllerState {
  focused: boolean;
  higher: boolean;
  listIsVisible: boolean;
  refContent: RefObject<HTMLDivElement | null>;
  refInput: RefObject<HTMLInputElement | null>;
  refList: RefObject<HTMLUListElement | null>;
  value: string;
}
