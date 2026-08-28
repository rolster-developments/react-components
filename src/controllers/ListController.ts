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
  useMemo,
  useRef,
  useState
} from 'react';
import { getRemSize } from '../helpers/css';
import { useEventCallback } from './EventCallbackController';

const MAX_LIST_HEIGHT_REM = 90;
const VIEWPORT_GAP_REM = 8;

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
  refSuggestions: RefObject<HTMLDivElement | null>;
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

function suggestionsShallowEqual<T>(
  a: AbstractListElement<T>[],
  b: AbstractListElement<T>[]
): boolean {
  return (
    a === b ||
    (a.length === b.length && a.every((element, index) => element === b[index]))
  );
}

function useStableSuggestions<T>(
  suggestions: AbstractListElement<T>[]
): AbstractListElement<T>[] {
  const suggestionsRef = useRef(suggestions);

  if (!suggestionsShallowEqual(suggestionsRef.current, suggestions)) {
    suggestionsRef.current = suggestions;
  }

  return suggestionsRef.current;
}

function shouldDisplayHigher(
  content: HTMLElement | null,
  list: HTMLElement | null
): boolean {
  if (!content) {
    return false;
  }

  const remSize = getRemSize();
  const gap = VIEWPORT_GAP_REM * remSize;

  const { top, bottom } = content.getBoundingClientRect();
  const spaceAbove = top - gap;
  const spaceBelow = window.innerHeight - bottom - gap;

  const maxHeight = MAX_LIST_HEIGHT_REM * remSize;
  const desiredHeight = Math.min(list?.scrollHeight || maxHeight, maxHeight);

  if (spaceBelow >= desiredHeight) {
    return false;
  }

  if (spaceAbove >= desiredHeight) {
    return true;
  }

  return spaceAbove > spaceBelow;
}

export function useListController<T = any, K = string>({
  suggestions,
  automatic,
  formControl,
  reference
}: ListControllerProps<T, K>): ListController<T> {
  const refContent = useRef<HTMLDivElement>(null);
  const refList = useRef<HTMLUListElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const refSuggestions = useRef<HTMLDivElement>(null);

  const listIsOpen = useRef(false);

  const stableSuggestions = useStableSuggestions(suggestions);

  const collection = useMemo(
    () => new ListCollection<T, K>(stableSuggestions, reference),
    [stableSuggestions, reference]
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
      if (
        !refContent?.current?.contains(target as any) &&
        !refSuggestions?.current?.contains(target as any)
      ) {
        refreshState((state) => ({ ...state, listIsVisible: false }));
      }
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

  const setState = useCallback((state: Partial<ListControllerState>) => {
    const newState = state.listIsVisible
      ? {
          ...state,
          higher: shouldDisplayHigher(refContent.current, refList.current)
        }
      : state;

    refreshState((currentState) => ({ ...currentState, ...newState }));
  }, []);

  const setFormValue = useCallback(
    (element?: AbstractListElement<any>, valueIsDefault = false) => {
      refreshState((state) => ({
        ...state,
        value: element?.description || ''
      }));

      changeValueInternal.current = true;

      if (valueIsDefault) {
        formControl?.setDefaultValue(element?.value);
      } else {
        formControl?.setValue(element?.value);
      }
    },
    [formControl]
  );

  const reconcileFormValue = useEventCallback(() => {
    if (!changeValueInternal.current) {
      if (formControl?.value) {
        const element = collection.find(formControl.value);

        if (!element) {
          valueProtected.current = formControl.value;

          if (automatic) {
            setFormValue(collection.value[0], true);
          } else {
            setFormValue(undefined);
          }
        } else {
          refreshState((state) => ({ ...state, value: element.description }));
        }
      } else if (valueProtected.current) {
        const element = collection.find(valueProtected.current);

        if (element) {
          setFormValue(element);
        } else {
          refreshState((state) => ({ ...state, value: '' }));
        }
      } else {
        if (automatic) {
          setFormValue(collection.value[0], true);
        } else {
          refreshState((state) => ({ ...state, value: '' }));
        }
      }
    }

    changeValueInternal.current = false;
  });

  useEffect(() => {
    reconcileFormValue();
  }, [collection, formControl?.value]);

  const navigationInput = useCallback(
    (event: KeyboardEvent) => {
      if (state.listIsVisible) {
        const newPosition = navigationListFromInput({
          content: refContent.current,
          event: event as any,
          higher: state.higher,
          list: refList.current
        });

        position.current = newPosition ?? 0;
      }
    },
    [state.listIsVisible, state.higher]
  );

  const navigationElement = useCallback(
    (event: KeyboardEvent) => {
      position.current = navigationListFromElement({
        content: refContent.current,
        event: event as any,
        higher: state.higher,
        input: refInput.current,
        list: refList.current,
        position: position.current
      });
    },
    [state.higher]
  );

  return useMemo(
    () => ({
      ...state,
      navigationElement,
      navigationInput,
      refContent,
      refInput,
      refList,
      refSuggestions,
      setFormValue,
      setState
    }),
    [state, navigationElement, navigationInput, setFormValue, setState]
  );
}
