import { RefObject } from 'react';

export interface ListControllerState {
  focused: boolean;
  higher: boolean;
  modalIsVisible: boolean;
  refContent: RefObject<HTMLDivElement>;
  refInput: RefObject<HTMLInputElement>;
  refList: RefObject<HTMLUListElement>;
  value: string;
}
