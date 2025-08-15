import { AbstractListElement as Element } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef
} from 'react';
import { useListController } from '../../../controllers/ListController';
import { ListControllerState } from '../../../definitions';

export interface FieldSelectControl<T = any, E extends Element<T> = Element<T>>
  extends ListControllerState {
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onClickInput: () => void;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
}

interface FieldSelectProps<
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
  lineHeight?: number;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  reference?: (value: T) => K;
  unremovable?: boolean;
  value?: T;
}

export function useFieldSelect<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>(props: FieldSelectProps<T, E, K>): FieldSelectControl<T, E> {
  const count = useRef(props.suggestions.length);

  const controller = useListController<T, K>({
    ...props,
    count: count.current
  });

  useEffect(() => {
    count.current = props.suggestions.length;
  }, [props.suggestions]);

  useEffect(() => {
    props.disabled && controller.setState({ focused: false });
  }, [props.disabled]);

  const onFocusInput = useCallback(() => {
    controller.setState({ focused: true });
  }, [controller.setState]);

  const onBlurInput = useCallback(() => {
    controller.setState({ focused: false });
  }, [controller.setState]);

  const onClickInput = useCallback(() => {
    controller.setState({ modalIsVisible: true });
  }, [controller.setState]);

  const onKeydownInput = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
        case 'Enter':
          controller.setState({ modalIsVisible: true });
          break;

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

  const onClickAction = useCallback(() => {
    const removable = !props.unremovable && !!controller.value;

    if (removable) {
      controller.setState({ modalIsVisible: false });
      controller.setFormValue(undefined);
      props.onValue && props.onValue(props.value as T);
    } else {
      const modalIsVisible = !controller.modalIsVisible;
      controller.setState({ modalIsVisible });
      modalIsVisible && controller.refInput?.current?.focus();
    }
  }, [
    controller.modalIsVisible,
    controller.value,
    controller.setState,
    controller.setFormValue,
    props.unremovable,
    props.onValue
  ]);

  const onClickBackdrop = useCallback(() => {
    controller.setState({ modalIsVisible: false });
  }, [controller.setState]);

  const onChange = useCallback(
    (element: Element<T>) => {
      !props.disabled && controller.refInput?.current?.focus();

      if (props.onSelect) {
        controller.setState({ modalIsVisible: false });
        element.value && props.onSelect(element.value);
      } else {
        controller.setFormValue(element);
        controller.setState({ modalIsVisible: false });
      }

      props.onValue && props.onValue(element.value);
    },
    [
      controller.setState,
      controller.setFormValue,
      props.onSelect,
      props.onValue,
      props.disabled
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
    onBlurInput,
    onClickAction,
    onClickBackdrop,
    onClickInput,
    onClickElement,
    onFocusInput,
    onKeydownElement,
    onKeydownInput
  };
}
