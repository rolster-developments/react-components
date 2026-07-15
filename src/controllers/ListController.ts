import {
  AbstractListElement,
  ListCollection,
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

const MAX_LIST_HEIGHT_REM = 90;
const FALLBACK_REM_SIZE = 16;

interface ListControllerState {
  focused: boolean;
  higher: boolean;
  listIsVisible: boolean;
  value: string;
}

export interface ListController<T = any> extends ListControllerState {
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  refContent: RefObject<HTMLDivElement | null>;
  refInput: RefObject<HTMLInputElement | null>;
  refList: RefObject<HTMLUListElement | null>;
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

function getRemSize(): number {
  if (typeof window === 'undefined') {
    return FALLBACK_REM_SIZE;
  }

  const fontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  return fontSize > 0 ? fontSize : FALLBACK_REM_SIZE;
}

function shouldDisplayHigher(
  content: HTMLElement | null,
  list: HTMLElement | null
): boolean {
  if (!content) {
    return false;
  }

  const { top, bottom } = content.getBoundingClientRect();
  const spaceAbove = top;
  const spaceBelow = window.innerHeight - bottom;

  const maxHeight = MAX_LIST_HEIGHT_REM * getRemSize();
  const desiredHeight = Math.min(list?.scrollHeight || maxHeight, maxHeight);

  if (spaceBelow >= desiredHeight) {
    return false;
  }

  if (spaceAbove >= desiredHeight) {
    return true;
  }

  return spaceAbove > spaceBelow;
}

export function useListController<T = any, K = string>(
  props: ListControllerProps<T, K>
): ListController<T> {
  const { suggestions, automatic, formControl, reference } = props;

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
    listIsVisible: false,
    value: ''
  });

  const changeValueInternal = useRef(false);
  const position = useRef(0);
  const valueProtected = useRef<T>(undefined);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      !refContent?.current?.contains(target as any) &&
        refreshState((state) => ({ ...state, listIsVisible: false }));
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
  }, [state.listIsVisible]);

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
    const _state = state.listIsVisible
      ? {
          ...state,
          higher: shouldDisplayHigher(refContent.current, refList.current)
        }
      : state;

    refreshState((state) => ({ ...state, ..._state }));
  }, []);

  const setFormValue = useCallback(
    (element?: AbstractListElement<any>, valueIsDefault = false) => {
      refreshState((state) => ({
        ...state,
        value: element?.description || ''
      }));

      changeValueInternal.current = true;

      valueIsDefault
        ? formControl?.setDefaultValue(element?.value)
        : formControl?.setValue(element?.value);
    },
    [formControl]
  );

  const navigationInput = useCallback(
    (event: KeyboardEvent) => {
      if (state.listIsVisible) {
        const _position = navigationListFromInput({
          content: refContent.current,
          event: event as any,
          list: refList.current
        });

        position.current = _position ?? 0;
      }
    },
    [state.listIsVisible]
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
    [state.listIsVisible]
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
