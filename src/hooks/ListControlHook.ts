import {
  AbstractListElement,
  ListCollection,
  navigationListFromElement,
  navigationListFromInput,
  locationListCanTop
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';

interface ListControlState {
  focused: boolean;
  higher: boolean;
  value: string;
  visible: boolean;
}

export interface ListControl<T = any> extends ListControlState {
  contentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFocused: (focused: boolean) => void;
  setFormValue(value: Undefined<T>): void;
  setValue: (value: string) => void;
  setVisible: (visible: boolean) => void;
}

interface ListControlProps<T = any> {
  suggestions: AbstractListElement<T>[];
  formControl?: ReactControl<HTMLElement, T | undefined>;
}

export function useListControl<T = any>({
  suggestions,
  formControl
}: ListControlProps<T>): ListControl<T> {
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ListControlState>({
    focused: false,
    higher: false,
    value: '',
    visible: false
  });

  const collection = useRef(new ListCollection<T>([]));
  const position = useRef(0);
  const protectedValue = useRef<T>();

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      !contentRef?.current?.contains(target as any) &&
        setState((state) => ({ ...state, visible: false }));
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    state.visible && formControl?.touch();

    setState((state) => ({
      ...state,
      higher: locationListCanTop(contentRef.current, listRef.current)
    }));
  }, [state.visible]);

  useEffect(() => {
    collection.current = new ListCollection(suggestions);
    refresh(collection.current, formControl?.value);
  }, [suggestions, formControl?.value]);

  function refresh(collection: ListCollection<T>, state?: T): void {
    if (!state) {
      return refreshProtected(collection) ? undefined : setValue('');
    }

    const element = collection.find(state);

    if (element) {
      protectedValue.current = undefined;
      return setValue(element.description);
    }

    if (!refreshProtected(collection)) {
      protectedValue.current = state;
      setValue('');
      setFormValue(undefined);
    }
  }

  function refreshProtected(collection: ListCollection<T>): boolean {
    if (protectedValue.current) {
      const element = collection.find(protectedValue.current);

      if (element) {
        formControl?.setValue(protectedValue.current);
        protectedValue.current = undefined;
        return true;
      }
    }

    return false;
  }

  function setFocused(focused: boolean): void {
    setState((state) => ({ ...state, focused }));
  }

  function setValue(value: string): void {
    setState((state) => ({ ...state, value }));
  }

  function setFormValue(value: Undefined<T>): void {
    formControl?.setValue(value);
  }

  function setVisible(visible: boolean): void {
    setState((state) => ({ ...state, visible }));
  }

  function navigationInput(event: KeyboardEvent): void {
    if (state.visible) {
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
    setFocused,
    setFormValue,
    setValue,
    setVisible
  };
}
