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

import { useListController } from '../../../controllers/ListController';
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
  keepOpen?: boolean;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  readOnly?: boolean;
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

  const _store = useRef<AutocompleteStore<T, E>>({
    coincidences: [],
    pattern: '',
    previous: null
  });

  const focusTimeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const rebootIsRequired = useRef(true);
  const prevSuggestions = useRef(props.suggestions);

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
    },
    []
  );

  useEffect(() => {
    const reboot =
      rebootIsRequired.current || prevSuggestions.current !== props.suggestions;

    rebootIsRequired.current = false;
    prevSuggestions.current = props.suggestions;

    refreshCoincidences(props.suggestions, pattern, reboot);
  }, [props.suggestions, pattern]);

  useEffect(() => {
    props.disabled && controller.setState({ focused: false });
  }, [props.disabled, controller.setState]);

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
          controller.setState({ listIsVisible: false });
          break;

        default:
          controller.navigationInput(event);
          break;
      }
    },
    [controller.setState, controller.navigationInput]
  );

  const onClickControl = useCallback(() => {
    if (!props.readOnly) {
      controller.setState({ listIsVisible: true });

      clearTimeout(focusTimeoutId.current);

      focusTimeoutId.current = setTimeout(() => {
        controller.refInput?.current?.focus();
      }, DURATION_ANIMATION);
    }
  }, [controller.setState, props.readOnly]);

  useEffect(() => {
    return () => {
      clearTimeout(focusTimeoutId.current);
    };
  }, []);

  const onClickAction = useCallback(() => {
    if (controller.value) {
      controller.setState({ listIsVisible: false });
      controller.setFormValue(undefined);
      props.onValue?.(props.value as T);
    } else {
      onClickControl();
    }
  }, [
    controller.value,
    controller.setState,
    controller.setFormValue,
    props.onValue,
    props.value,
    onClickControl
  ]);

  const onClickBackdrop = useCallback(() => {
    controller.setState({ listIsVisible: false });
  }, [controller.setState]);

  const onChange = useCallback(
    (element: Element<T>) => {
      if (props.onSelect) {
        element.value && props.onSelect(element.value);
      } else {
        controller.setFormValue(element);
      }

      if (props.keepOpen) {
        setPattern('');
        controller.refInput?.current?.focus();
      } else {
        controller.setState({ listIsVisible: false });
      }

      props.onValue?.(element.value);
    },
    [
      controller.setState,
      controller.setFormValue,
      setPattern,
      props.keepOpen,
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
