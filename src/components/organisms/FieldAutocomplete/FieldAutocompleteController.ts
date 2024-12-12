import {
  AbstractAutocompleteElement as Element,
  AutocompleteStore,
  createAutocompleteStore
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState
} from 'react';
import { ListController, useListController } from '../../../controllers';

const DURATION_ANIMATION = 240;
const MAX_ELEMENTS = 6;

export interface FieldAutocompleteControl<
  T = any,
  E extends Element<T> = Element<T>
> {
  coincidences: E[];
  controller: ListController<T>;
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickControl: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
  pattern: string;
  setPattern: (value: string) => void;
}

interface FieldAutocompleteProps<T = any, E extends Element<T> = Element<T>> {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  value?: T;
}

interface FieldValueProps<T = any, E extends Element<T> = Element<T>>
  extends FieldAutocompleteProps<T, E> {
  value: NonUndefined<T>;
}

interface FieldUndefinedProps<T = any, E extends Element<T> = Element<T>>
  extends FieldAutocompleteProps<T | undefined, E> {
  value: undefined;
}

type FieldVoidProps<T = any, E extends Element<T> = Element<T>> = Omit<
  FieldUndefinedProps<T | undefined, E>,
  'value'
>;

export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldVoidProps<T, E>): FieldAutocompleteControl<T | undefined, E>;
export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldUndefinedProps<T, E>): FieldAutocompleteControl<T | undefined, E>;
export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldValueProps<T, E>): FieldAutocompleteControl<T, E>;
export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldAutocompleteProps<T, E>): FieldAutocompleteControl<T, E>;
export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldAutocompleteProps<T, E>): FieldAutocompleteControl<T, E> {
  const controller = useListController(props);

  const [pattern, setPattern] = useState('');
  const [coincidences, setCoincidences] = useState<E[]>([]);
  const currentStore = useRef<AutocompleteStore<T, E>>({
    coincidences: [],
    pattern: '',
    previous: null
  });

  const disabled = props.formControl?.disabled || props.disabled;

  useEffect(() => {
    refreshCoincidences(pattern, true);
  }, [props.suggestions]);

  useEffect(() => {
    refreshCoincidences(pattern);
  }, [pattern]);

  function onClickControl(): void {
    if (!disabled) {
      controller.setState({ listIsVisible: true });

      setTimeout(() => {
        controller.inputRef?.current?.focus();
      }, DURATION_ANIMATION);
    }
  }

  function onFocusInput(): void {
    controller.setState({ focused: true });
  }

  function onBlurInput(): void {
    controller.setState({ focused: false });
  }

  function onKeydownInput(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Escape':
      case 'Tab':
        controller.setState({ listIsVisible: false });
        break;

      default:
        controller.navigationInput(event);
        break;
    }
  }

  function onClickAction(): void {
    controller.setState({ listIsVisible: false, value: '' });
    controller.setFormValue(props.value);
    props.onValue && props.onValue(props.value as T);
  }

  function onClickBackdrop(): void {
    controller.setState({ listIsVisible: false });
  }

  function onClickElement(element: Element<T>): MouseEventHandler {
    return () => {
      onChange(element);
    };
  }

  function onKeydownElement(element: Element<T>): KeyboardEventHandler {
    return (event) => {
      event.code === 'Enter'
        ? onChange(element)
        : controller.navigationElement(event);
    };
  }

  function onChange({ description, value }: Element<T>): void {
    if (props.onSelect) {
      controller.setState({ listIsVisible: false });
      value && props.onSelect(value);
    } else {
      controller.setState({ listIsVisible: false, value: description });
      controller.setFormValue(value);
    }

    props.onValue && props.onValue(value);
  }

  function refreshCoincidences(pattern: string | null, reboot = false): void {
    const { collection, store } = createAutocompleteStore({
      pattern,
      suggestions: props.suggestions,
      reboot,
      store: currentStore.current
    });

    currentStore.current = store;
    setCoincidences(collection.slice(0, MAX_ELEMENTS));
  }

  return {
    coincidences,
    controller,
    onBlurInput,
    onClickAction,
    onClickBackdrop,
    onClickControl,
    onClickElement,
    onFocusInput,
    onKeydownElement,
    onKeydownInput,
    pattern,
    setPattern
  };
}
