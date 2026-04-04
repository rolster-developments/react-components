import { RefObject } from 'react';

export interface ListControllerState {
  focused: boolean;
  higher: boolean;
  listIsVisible: boolean;
  refContent: RefObject<HTMLDivElement | null>;
  refInput: RefObject<HTMLInputElement | null>;
  refList: RefObject<HTMLUListElement | null>;
  value: string;
}
