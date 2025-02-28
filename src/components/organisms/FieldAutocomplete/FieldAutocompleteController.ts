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
import { useListController } from '../../../controllers';
import { ListControllerState } from '../../../definitions';

const DURATION_ANIMATION = 240;
const MAX_ELEMENTS = 6;

export interface FieldAutocompleteControl<
  T = any,
  E extends Element<T> = Element<T>
> extends ListControllerState {
  coincidences: E[];
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

interface FieldAutocompleteProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
> {
  suggestions: E[];
  automatic?: boolean;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  reference?: (value: T) => K;
  value?: T;
}

export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>(props: FieldAutocompleteProps<T, E, K>): FieldAutocompleteControl<T, E> {
  const controller = useListController<T, K>(props);

  const [coincidences, setCoincidences] = useState<E[]>([]);
  const [pattern, setPattern] = useState('');

  const currentStore = useRef<AutocompleteStore<T, E>>({
    coincidences: [],
    pattern: '',
    previous: null
  });

  useEffect(() => {
    refreshCoincidences(pattern, true);
  }, [props.suggestions]);

  useEffect(() => {
    refreshCoincidences(pattern);
  }, [pattern]);

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
        controller.setState({ modalIsVisible: false });
        break;

      default:
        controller.navigationInput(event);
        break;
    }
  }

  function onClickControl(): void {
    controller.setState({ modalIsVisible: true });

    setTimeout(() => {
      controller.inputRef?.current?.focus();
    }, DURATION_ANIMATION);
  }

  function onClickAction(): void {
    if (controller.value) {
      controller.setState({ modalIsVisible: false });
      controller.setFormValue(undefined);
      props.onValue && props.onValue(props.value as T);
    } else {
      onClickControl();
    }
  }

  function onClickBackdrop(): void {
    controller.setState({ modalIsVisible: false });
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

  function onChange(element: Element<T>): void {
    const { onSelect, onValue } = props;

    if (onSelect) {
      controller.setState({ modalIsVisible: false });
      element.value && onSelect(element.value);
    } else {
      controller.setState({ modalIsVisible: false });
      controller.setFormValue(element);
    }

    onValue && onValue(element.value);
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
    ...controller,
    coincidences,
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
