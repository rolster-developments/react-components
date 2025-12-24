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
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFormValue(element?: AbstractListElement<T>): void;
  refContent: RefObject<HTMLDivElement | null>;
  refInput: RefObject<HTMLInputElement | null>;
  refList: RefObject<HTMLUListElement | null>;
  setState: (state: Partial<ListControllerState>) => void;
}

interface ListControllerProps<T = any, K = string> {
  count: number;
  suggestions: AbstractListElement<T>[];
  automatic?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  lineHeight?: number;
  reference?: (value: T) => K;
  value?: T;
}

function calculateMinHeightList(count: number, height: number): number {
  return count <= 0 ? 160 : (count < 6 ? count : 6) * height;
}

export function useListController<T = any, K = string>(
  props: ListControllerProps<T, K>
): ListController<T> {
  const { count, suggestions, automatic, formControl, lineHeight, reference } =
    props;

  const refContent = useRef<HTMLDivElement>(null);
  const refList = useRef<HTMLUListElement>(null);
  const refInput = useRef<HTMLInputElement>(null);

  const listIsOpen = useRef(false);
  const [collection, setCollection] = useState(
    new ListCollection<T, K>(suggestions)
  );

  const [state, refreshState] = useState<ListControllerState>({
    focused: false,
    higher: false,
    modalIsVisible: false,
    value: ''
  });

  const changeValueInternal = useRef(false);
  const position = useRef(0);
  const valueProtected = useRef<T>(undefined);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      !refContent?.current?.contains(target as any) &&
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

  const setState = useCallback(
    (state: Partial<ListControllerState>) => {
      const minHeightList = calculateMinHeightList(count, lineHeight ?? 48);

      const _state = state.modalIsVisible
        ? {
            ...state,
            higher: locationListCanTop(
              refContent.current,
              refList.current,
              minHeightList
            )
          }
        : state;

      refreshState((state) => ({ ...state, ..._state }));
    },
    [count]
  );

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
          content: refContent.current,
          event: event as any,
          list: refList.current
        });

        position.current = _position ?? 0;
      }
    },
    [state.modalIsVisible]
  );

  const navigationElement = useCallback(
    (event: KeyboardEvent) => {
      position.current = navigationListFromElement({
        content: refContent.current,
        event: event as any,
        input: refInput.current,
        list: refList.current,
        position: position.current
      });
    },
    [state.modalIsVisible]
  );

  return {
    ...state,
    navigationElement,
    navigationInput,
    refContent,
    refInput,
    refList,
    setFormValue,
    setState
  };
}
