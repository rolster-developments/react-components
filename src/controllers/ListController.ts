import {
  AbstractListElement,
  ListCollection,
  locationListCanTop,
  navigationListFromElement,
  navigationListFromInput
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

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
  setFormValue(element?: AbstractListElement<T>, initialValue?: boolean): void;
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
  const { suggestions, automatic, formControl } = props;

  const listIsOpen = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, refreshState] = useState<ListControllerState>({
    focused: false,
    higher: false,
    value: '',
    modalIsVisible: false
  });

  const collection = useRef(new ListCollection<T>([]));
  const position = useRef(0);
  const valueProtected = useRef<T>();
  const changeValueInternal = useRef(false);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      !contentRef?.current?.contains(target as any) &&
        refreshState((state) => ({ ...state, modalIsVisible: false }));
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

    refreshState((state) => ({
      ...state,
      higher: locationListCanTop(contentRef.current, listRef.current)
    }));
  }, [state.modalIsVisible]);

  useEffect(() => {
    collection.current = new ListCollection(suggestions);

    if (formControl?.value) {
      const element = collection.current.find(formControl.value);

      if (!element) {
        valueProtected.current = formControl.value;

        automatic
          ? setFormValue(collection.current.value[0], true)
          : setFormValue(undefined);
      }
    } else if (valueProtected.current) {
      const element = collection.current.find(valueProtected.current);

      element && setFormValue(element);
    } else {
      automatic && setFormValue(collection.current.value[0], true);
    }
  }, [suggestions]);

  useEffect(() => {
    if (!changeValueInternal.current) {
      //
    }

    changeValueInternal.current = false;
  }, [formControl?.value]);

  const setState = useCallback((state: Partial<ListControllerState>) => {
    refreshState((_state) => ({ ..._state, ...state }));
  }, []);

  const setFormValue = useCallback(
    (element?: AbstractListElement<any>, initialValue = false) => {
      refreshState((_state) => ({
        ..._state,
        value: element?.description ?? ''
      }));

      changeValueInternal.current = true;

      initialValue
        ? formControl?.setInitialValue(element?.value)
        : formControl?.setValue(element?.value);
    },
    [formControl]
  );

  const navigationInput = useCallback(
    (event: KeyboardEvent) => {
      if (state.modalIsVisible) {
        const _position = navigationListFromInput({
          content: contentRef.current,
          event: event as any,
          list: listRef.current
        });

        position.current = _position ?? 0;
      }
    },
    [state.modalIsVisible]
  );

  const navigationElement = useCallback(
    (event: KeyboardEvent) => {
      position.current = navigationListFromElement({
        content: contentRef.current,
        event: event as any,
        input: inputRef.current,
        list: listRef.current,
        position: position.current
      });
    },
    [state.modalIsVisible]
  );

  return {
    ...state,
    contentRef,
    inputRef,
    listRef,
    navigationElement,
    navigationInput,
    setFormValue,
    setState
  };
}
