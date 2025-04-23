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
  setFormValue(element?: AbstractListElement<T>): void;
  setState: (state: Partial<ListControllerState>) => void;
}

interface ListControllerProps<T = any, K = string> {
  suggestions: AbstractListElement<T>[];
  automatic?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  reference?: (value: T) => K;
  value?: T;
}

export function useListController<T = any, K = string>(
  props: ListControllerProps<T, K>
): ListController<T> {
  const { suggestions, automatic, formControl, reference } = props;

  const listIsOpen = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [collection, setCollection] = useState(
    new ListCollection<T, K>(suggestions)
  );

  const [state, refreshState] = useState<ListControllerState>({
    focused: false,
    higher: false,
    value: '',
    modalIsVisible: false
  });

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
  }, [state.modalIsVisible]);

  useEffect(() => {
    setCollection(new ListCollection(suggestions, reference));
  }, [suggestions]);

  useEffect(() => {
    if (!changeValueInternal.current) {
      if (formControl?.value) {
        const element = collection.find(formControl.value);

        if (!element) {
          valueProtected.current = formControl.value;

          automatic
            ? setFormValue(collection.value[0], true)
            : setFormValue(undefined);
        } else {
          refreshState((state) => ({ ...state, value: element.description }));
        }
      } else if (valueProtected.current) {
        const element = collection.find(valueProtected.current);

        element ? setFormValue(element) : refreshState({ ...state, value: '' });
      } else {
        automatic
          ? setFormValue(collection.value[0], true)
          : refreshState({ ...state, value: '' });
      }
    }

    changeValueInternal.current = false;
  }, [collection, formControl?.value]);

  const setState = useCallback((state: Partial<ListControllerState>) => {
    const length = suggestions.length > 6 ? 6 : suggestions.length;

    const _state = state.modalIsVisible
      ? {
          ...state,
          higher: locationListCanTop(
            contentRef.current,
            listRef.current,
            length * 48
          )
        }
      : state;

    refreshState((state) => ({ ...state, ..._state }));
  }, []);

  const setFormValue = useCallback(
    (element?: AbstractListElement<any>, initialValue = false) => {
      refreshState((state) => ({
        ...state,
        value: element?.description || ''
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
