import {
  AbstractListElement as Element,
  navigationListFromElement,
  navigationListFromInput
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

const MAX_LIST_HEIGHT_REM = 90;
const FALLBACK_REM_SIZE = 16;

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

interface FieldListControllerState {
  higher: boolean;
  listIsVisible: boolean;
}

export interface FieldListControl<T = any, E extends Element<T> = Element<T>> {
  higher: boolean;
  isSelected: (element: E) => boolean;
  listIsVisible: boolean;
  onClear: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => () => void;
  onClickInput: () => void;
  onKeydownElement: (element: E) => (event: KeyboardEvent) => void;
  onKeydownTrigger: (event: KeyboardEvent) => void;
  onRemoveElement: (element: E) => (event: MouseEvent) => void;
  refContent: React.RefObject<HTMLDivElement | null>;
  refList: React.RefObject<HTMLUListElement | null>;
  refSuggestions: React.RefObject<HTMLDivElement | null>;
  refTrigger: (element: HTMLElement | null) => void;
  selected: E[];
}

interface FieldListControllerProps<T = any, E extends Element<T> = Element<T>> {
  suggestions: E[];
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T[]>
    | ReactControl<HTMLElement, NonNullable<T>[]>
    | ReactControl<HTMLElement, T[] | undefined>;
  onValue?: (value: T[]) => void;
  readOnly?: boolean;
  value?: T[];
}

export function useFieldList<T = any, E extends Element<T> = Element<T>>(
  props: FieldListControllerProps<T, E>
): FieldListControl<T, E> {
  const { suggestions, disabled } = props;

  const refContent = useRef<HTMLDivElement>(null);
  const refList = useRef<HTMLUListElement>(null);
  const refSuggestions = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement>(null);
  const focusListOnOpen = useRef(false);

  const refTrigger = useCallback((element: HTMLElement | null) => {
    trigger.current = element;
  }, []);

  const formControl = props.formControl as
    | ReactControl<HTMLElement, T[]>
    | undefined;

  const [state, setState] = useState<FieldListControllerState>({
    higher: false,
    listIsVisible: false
  });

  const [selected, setSelected] = useState<E[]>([]);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      if (
        !refContent?.current?.contains(target as any) &&
        !refSuggestions?.current?.contains(target as any)
      ) {
        setState((state) => ({ ...state, listIsVisible: false }));
      }
    }

    document.addEventListener('click', onCloseSuggestions as any);

    return () => {
      document.removeEventListener('click', onCloseSuggestions as any);
    };
  }, []);

  useEffect(() => {
    const formValue = formControl?.value;

    if (formValue !== undefined && formValue !== null && formValue.length) {
      setSelected(
        suggestions.filter((state) =>
          formValue.some((value) => state.compareTo(value))
        )
      );
    } else {
      setSelected([]);
    }
  }, [formControl?.value, suggestions]);

  const setListState = useCallback(
    (controllerState: Partial<FieldListControllerState>) => {
      setState((state) => {
        const newState =
          controllerState.listIsVisible !== undefined
            ? {
                ...controllerState,
                ...(controllerState.listIsVisible
                  ? {
                      higher: shouldDisplayHigher(
                        refContent.current,
                        refList.current
                      )
                    }
                  : {})
              }
            : controllerState;

        return { ...state, ...newState };
      });
    },
    []
  );

  const toggleElement = useCallback(
    (element: E) => {
      const alreadySelected = selected.some((state) =>
        state.compareTo(element.value)
      );

      const newSelected = alreadySelected
        ? selected.filter((state) => !state.compareTo(element.value))
        : [...selected, element];

      const newValues = newSelected.map((state) => state.value) as T[];

      setSelected(newSelected);
      formControl?.setValue(newValues);
      props.onValue?.(newValues);
    },
    [selected, formControl, props.onValue]
  );

  const isSelected = useCallback(
    (element: E) => {
      return selected.some((state) => state.compareTo(element.value));
    },
    [selected]
  );

  const onClickInput = useCallback(() => {
    if (!props.readOnly) {
      setListState({ listIsVisible: true });
    }
  }, [setListState, props.readOnly]);

  const onClickBackdrop = useCallback(() => {
    setListState({ listIsVisible: false });
  }, [setListState]);

  useEffect(() => {
    if (state.listIsVisible && focusListOnOpen.current) {
      focusListOnOpen.current = false;

      requestAnimationFrame(() => {
        const elements = refList.current?.querySelectorAll<HTMLElement>(
          '.rls-field-list__element'
        );

        if (elements?.length) {
          elements[state.higher ? elements.length - 1 : 0].focus();
        }
      });
    }
  }, [state.listIsVisible, state.higher]);

  const onKeydownTrigger = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();

          if (disabled || props.readOnly) {
            return;
          }

          if (state.listIsVisible) {
            navigationListFromInput({
              content: refContent.current,
              event: event.nativeEvent,
              higher: state.higher,
              list: refList.current
            });
          } else {
            focusListOnOpen.current = true;
            setListState({ listIsVisible: true });
          }
          break;

        case 'Escape':
          if (state.listIsVisible) {
            event.preventDefault();
            setListState({ listIsVisible: false });
          }
          break;
      }
    },
    [disabled, props.readOnly, state.listIsVisible, state.higher, setListState]
  );

  const onClickAction = useCallback(() => {
    if (!disabled && !props.readOnly) {
      setListState({ listIsVisible: !state.listIsVisible });
    }
  }, [disabled, props.readOnly, setListState, state.listIsVisible]);

  const onClickElement = useCallback(
    (element: E) => {
      return () => {
        toggleElement(element);
      };
    },
    [toggleElement]
  );

  const onClear = useCallback(() => {
    setSelected([]);
    formControl?.setValue([]);
    props.onValue?.([]);
  }, [formControl, props.onValue]);

  const onRemoveElement = useCallback(
    (element: E) => {
      return (event: MouseEvent) => {
        event.stopPropagation();

        const newSelected = selected.filter(
          (state) => !state.compareTo(element.value)
        );

        const newValues = newSelected.map((state) => state.value) as T[];

        setSelected(newSelected);
        formControl?.setValue(newValues);
        props.onValue?.(newValues);
      };
    },
    [selected, formControl, props.onValue]
  );

  const onKeydownElement = useCallback(
    (element: E) => {
      return (event: KeyboardEvent) => {
        switch (event.code) {
          case 'Enter':
          case 'Space':
            event.preventDefault();
            toggleElement(element);
            break;

          case 'Escape':
            event.preventDefault();
            setListState({ listIsVisible: false });
            trigger.current?.focus();
            break;

          case 'Tab':
            setListState({ listIsVisible: false });
            break;

          case 'ArrowDown':
          case 'ArrowUp': {
            event.preventDefault();

            const elements = refList.current?.querySelectorAll(
              '.rls-field-list__element'
            );

            const position = elements
              ? Array.prototype.indexOf.call(elements, event.currentTarget)
              : -1;

            navigationListFromElement({
              content: refContent.current,
              event: event.nativeEvent,
              higher: state.higher,
              input: trigger.current as HTMLInputElement | null,
              list: refList.current,
              position: Math.max(position, 0)
            });
            break;
          }
        }
      };
    },
    [toggleElement, setListState, state.higher]
  );

  return useMemo(
    () => ({
      ...state,
      selected,
      refContent,
      refList,
      refSuggestions,
      isSelected,
      onClear,
      onClickAction,
      onClickBackdrop,
      onClickElement,
      onClickInput,
      onKeydownElement,
      onKeydownTrigger,
      onRemoveElement,
      refTrigger
    }),
    [
      state,
      selected,
      isSelected,
      onClear,
      onClickAction,
      onClickBackdrop,
      onClickElement,
      onClickInput,
      onKeydownElement,
      onKeydownTrigger,
      onRemoveElement,
      refTrigger
    ]
  );
}
