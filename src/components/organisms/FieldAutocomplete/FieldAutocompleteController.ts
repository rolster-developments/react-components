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
  useCallback,
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
  const limit = useRef(props.suggestions.length);

  const controller = useListController<T, K>({
    ...props,
    limit: limit.current
  });

  const [coincidences, setCoincidences] = useState<E[]>([]);
  const [pattern, setPattern] = useState('');

  const _store = useRef<AutocompleteStore<T, E>>({
    coincidences: [],
    pattern: '',
    previous: null
  });

  const refreshCoincidences = useCallback(
    (suggestions: E[], pattern: string | null, reboot = false) => {
      const { collection, store } = createAutocompleteStore({
        pattern,
        suggestions,
        reboot,
        store: _store.current
      });

      _store.current = store;

      const coincidences = collection.slice(0, MAX_ELEMENTS);

      setCoincidences(coincidences);
      limit.current = coincidences.length;
    },
    []
  );

  useEffect(() => {
    refreshCoincidences(props.suggestions, pattern, true);
  }, [props.suggestions]);

  useEffect(() => {
    refreshCoincidences(props.suggestions, pattern);
  }, [pattern]);

  const onFocusInput = useCallback(() => {
    controller.setState({ focused: true });
  }, [controller.setState]);

  const onBlurInput = useCallback(() => {
    controller.setState({ focused: false });
  }, [controller.setState]);

  const onKeydownInput = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Escape':
        case 'Tab':
          controller.setState({ modalIsVisible: false });
          break;

        default:
          controller.navigationInput(event);
          break;
      }
    },
    [controller.setState, controller.navigationInput]
  );

  const onClickControl = useCallback(() => {
    controller.setState({ modalIsVisible: true });

    setTimeout(() => {
      controller.inputRef?.current?.focus();
    }, DURATION_ANIMATION);
  }, [controller.setState]);

  const onClickAction = useCallback(() => {
    if (controller.value) {
      controller.setState({ modalIsVisible: false });
      controller.setFormValue(undefined);
      props.onValue && props.onValue(props.value as T);
    } else {
      onClickControl();
    }
  }, [
    controller.value,
    controller.setState,
    controller.setFormValue,
    props.onValue
  ]);

  const onClickBackdrop = useCallback(() => {
    controller.setState({ modalIsVisible: false });
  }, [controller.setState]);

  const onChange = useCallback(
    (element: Element<T>) => {
      if (props.onSelect) {
        controller.setState({ modalIsVisible: false });
        element.value && props.onSelect(element.value);
      } else {
        controller.setState({ modalIsVisible: false });
        controller.setFormValue(element);
      }

      props.onValue && props.onValue(element.value);
    },
    [
      controller.setState,
      controller.setFormValue,
      props.onSelect,
      props.onValue
    ]
  );

  const onClickElement = useCallback(
    (element: Element<T>) => {
      return () => {
        onChange(element);
      };
    },
    [onChange]
  );

  const onKeydownElement = useCallback(
    (element: Element<T>) => {
      return (event: KeyboardEvent) => {
        event.code === 'Enter'
          ? onChange(element)
          : controller.navigationElement(event);
      };
    },
    [onChange, controller.navigationElement]
  );

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
