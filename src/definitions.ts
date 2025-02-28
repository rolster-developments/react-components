import { RefObject } from 'react';

export interface ListControllerState {
  contentRef: RefObject<HTMLDivElement>;
  focused: boolean;
  higher: boolean;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  modalIsVisible: boolean;
  value: string;
}
