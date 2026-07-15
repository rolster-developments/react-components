import { AbstractListElement as Element } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
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
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => () => void;
  onClickInput: () => void;
  onKeydownElement: (element: E) => (event: KeyboardEvent) => void;
  onRemoveElement: (element: E) => (event: MouseEvent) => void;
  refContent: React.RefObject<HTMLDivElement | null>;
  refList: React.RefObject<HTMLUListElement | null>;
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
      !refContent?.current?.contains(target as any) &&
        setState((state) => ({ ...state, listIsVisible: false }));
    }

    document.addEventListener('click', onCloseSuggestions as any);

    return () => {
      document.removeEventListener('click', onCloseSuggestions as any);
    };
  }, []);

  useEffect(() => {
    const formValue = formControl?.value;

    if (formValue !== undefined && formValue !== null && formValue.length) {
      const selectedElements = suggestions.filter((state) =>
        formValue.some((value) => state.compareTo(value))
      );
      setSelected(selectedElements);
    } else {
      setSelected([]);
    }
  }, [formControl?.value, suggestions]);

  const setListState = useCallback(
    (updates: Partial<FieldListControllerState>) => {
      setState((state) => {
        const _updates =
          updates.listIsVisible !== undefined
            ? {
                ...updates,
                ...(updates.listIsVisible
                  ? {
                      higher: shouldDisplayHigher(
                        refContent.current,
                        refList.current
                      )
                    }
                  : {})
              }
            : updates;

        return { ...state, ..._updates };
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
        event.code === 'Enter' && toggleElement(element);
      };
    },
    [toggleElement]
  );

  return {
    ...state,
    selected,
    refContent,
    refList,
    isSelected,
    onClickAction,
    onClickBackdrop,
    onClickElement,
    onClickInput,
    onKeydownElement,
    onRemoveElement
  };
}
