import {
  AbstractListElement,
  ListCollection,
  locationListCanTop,
  navigationListFromElement,
  navigationListFromInput
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';

interface ListControllerState {
  focused: boolean;
  higher: boolean;
  modalIsVisible: boolean;
  value: string;
}

export interface ListController<T = any> extends ListControllerState {
  contentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFormValue(value?: T): void;
  setState: (state: Partial<ListControllerState>) => void;
}

interface ListControllerProps<T = any> {
  suggestions: AbstractListElement<T>[];
  automatic?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  value?: T;
}

export function useListController<T = any>(
  props: ListControllerProps<T>
): ListController<T> {
  const { suggestions, automatic, formControl, value } = props;

  const listIsOpen = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ListControllerState>({
    focused: false,
    higher: false,
    value: '',
    modalIsVisible: false
  });

  const collection = useRef(new ListCollection<T>([]));
  const position = useRef(0);
  const _protected = useRef<T>();

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      !contentRef?.current?.contains(target as any) &&
        setState((state) => ({ ...state, modalIsVisible: false }));
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    if (!listIsOpen.current && state.modalIsVisible) {
      listIsOpen.current = true;
    }

    if (listIsOpen.current && !state.modalIsVisible) {
      formControl?.touch();
    }

    setState((state) => ({
      ...state,
      higher: locationListCanTop(contentRef.current, listRef.current)
    }));
  }, [state.modalIsVisible]);

  useEffect(() => {
    collection.current = new ListCollection(suggestions);
    refresh(collection.current, formControl?.value, automatic);
  }, [suggestions]);

  useEffect(() => {
    refresh(collection.current, formControl?.value, automatic);
  }, [formControl?.value]);

  function refresh(
    collection: ListCollection<T>,
    state?: T,
    automatic?: boolean
  ): void {
    if (!state) {
      !refreshWithProtected(collection, automatic) &&
        refreshState({ value: '' });

      return undefined;
    }

    const element = collection.find(state);

    if (element) {
      _protected.current = undefined;
      return refreshState({ value: element.description });
    }

    if (!refreshWithProtected(collection, automatic)) {
      _protected.current = state;
      setFormValue(value as T);
      refreshState({ value: '' });
    }
  }

  function refreshWithProtected(
    collection: ListCollection<T>,
    automatic?: boolean
  ): boolean {
    if (automatic && collection.value[0]) {
      setFormValue(collection.value[0].value);
      return true;
    }

    if (_protected.current) {
      const element = collection.find(_protected.current);

      if (element) {
        formControl?.setValue(_protected.current);
        _protected.current = undefined;
        return true;
      }
    }

    return false;
  }

  function refreshState(state: Partial<ListControllerState>): void {
    setState((currentState) => ({ ...currentState, ...state }));
  }

  function setFormValue(value: any): void {
    formControl?.setValue(value);
  }

  function navigationInput(event: KeyboardEvent): void {
    if (state.modalIsVisible) {
      const newPosition = navigationListFromInput({
        content: contentRef.current,
        event: event as any,
        list: listRef.current
      });

      position.current = newPosition ?? 0;
    }
  }

  function navigationElement(event: KeyboardEvent): void {
    position.current = navigationListFromElement({
      content: contentRef.current,
      event: event as any,
      input: inputRef.current,
      list: listRef.current,
      position: position.current
    });
  }

  return {
    ...state,
    contentRef,
    inputRef,
    listRef,
    navigationElement,
    navigationInput,
    setFormValue,
    setState: refreshState
  };
}
