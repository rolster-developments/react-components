import {
  AbstractListElement,
  ListCollection,
  navigationListFromElement,
  navigationListFromInput,
  locationListCanTop
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';

interface ListControllerState {
  focused: boolean;
  higher: boolean;
  listIsVisible: boolean;
  value: string;
}

export interface ListController<T = any> extends ListControllerState {
  contentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFormValue(value: Undefined<T>): void;
  setState: (state: Partial<ListControllerState>) => void;
}

interface ListControllerProps<T = any> {
  suggestions: AbstractListElement<T>[];
  formControl?: ReactControl<HTMLElement, T>;
  value?: T;
}

interface ValueControllerProps<T = any> extends ListControllerProps<T> {
  value: NonUndefined<T>;
}

interface UndefinedControllerProps<T = any>
  extends ListControllerProps<T | undefined> {
  value: undefined;
}

type VoidControllerProps<T = any> = Omit<
  UndefinedControllerProps<T | undefined>,
  'value'
>;

export function useListController<T = any>(
  props: VoidControllerProps<T>
): ListController<T | undefined>;
export function useListController<T = any>(
  props: UndefinedControllerProps<T>
): ListController<T | undefined>;
export function useListController<T = any>(
  props: ValueControllerProps<T>
): ListController<T>;
export function useListController<T = any>(
  props: ListControllerProps<T>
): ListController<T>;
export function useListController<T = any>(
  props: ListControllerProps<T>
): ListController<T> {
  const { suggestions, formControl, value } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listIsOpen = useRef(false);

  const [state, setState] = useState<ListControllerState>({
    focused: false,
    higher: false,
    value: '',
    listIsVisible: false
  });

  const collection = useRef(new ListCollection<T>([]));
  const position = useRef(0);
  const protectedValue = useRef<T>();

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      !contentRef?.current?.contains(target as any) &&
        setState((state) => ({ ...state, listIsVisible: false }));
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    if (!listIsOpen.current && state.listIsVisible) {
      listIsOpen.current = true;
    }

    if (listIsOpen.current && !state.listIsVisible) {
      formControl?.touch();
    }

    setState((state) => ({
      ...state,
      higher: locationListCanTop(contentRef.current, listRef.current)
    }));
  }, [state.listIsVisible]);

  useEffect(() => {
    collection.current = new ListCollection(suggestions);
    refresh(collection.current, formControl?.value);
  }, [suggestions, formControl?.value]);

  function refresh(collection: ListCollection<T>, state?: T): void {
    if (!state) {
      return refreshProtected(collection)
        ? undefined
        : refreshState({ value: '' });
    }

    const element = collection.find(state);

    if (element) {
      protectedValue.current = undefined;
      return refreshState({ value: element.description });
    }

    if (!refreshProtected(collection)) {
      protectedValue.current = state;
      setFormValue(value as T);
      refreshState({ value: '' });
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

  function refreshState(state: Partial<ListControllerState>): void {
    setState((currentState) => ({ ...currentState, ...state }));
  }

  function setFormValue(value: T): void {
    formControl?.setValue(value);
  }

  function navigationInput(event: KeyboardEvent): void {
    if (state.listIsVisible) {
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
