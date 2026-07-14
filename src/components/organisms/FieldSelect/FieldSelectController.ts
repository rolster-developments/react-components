import { AbstractListElement as Element } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';

import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect
} from 'react';

import { useListController } from '../../../controllers/ListController';
import { ListControllerState } from '../../../definitions';

export interface FieldSelectControl<
  T = any,
  E extends Element<T> = Element<T>
> extends ListControllerState {
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => MouseEventHandler<HTMLElement>;
  onClickInput: () => void;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler<HTMLElement>;
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
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  readOnly?: boolean;
  reference?: (value: T) => K;
  unremovable?: boolean;
  value?: T;
}

export function useFieldSelect<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>(props: FieldSelectProps<T, E, K>): FieldSelectControl<T, E> {
  const controller = useListController<T, K>(props);

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
    !props.readOnly && controller.setState({ listIsVisible: true });
  }, [controller.setState, props.readOnly]);

  const onKeydownInput = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
        case 'Enter':
          controller.setState({ listIsVisible: true });
          break;

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

  const onClickAction = useCallback(() => {
    const removable = !props.unremovable && !!controller.value;

    if (removable) {
      controller.setState({ listIsVisible: false });
      controller.setFormValue(undefined);
      props.onValue?.(props.value as T);
    } else {
      const listIsVisible = !controller.listIsVisible;
      controller.setState({ listIsVisible });
      listIsVisible && controller.refInput?.current?.focus();
    }
  }, [
    controller.listIsVisible,
    controller.value,
    controller.setState,
    controller.setFormValue,
    props.unremovable,
    props.onValue
  ]);

  const onClickBackdrop = useCallback(() => {
    controller.setState({ listIsVisible: false });
  }, [controller.setState]);

  const onChange = useCallback(
    (element: Element<T>) => {
      !props.disabled && controller.refInput?.current?.focus();

      if (props.onSelect) {
        controller.setState({ listIsVisible: false });
        element.value && props.onSelect(element.value);
      } else {
        controller.setFormValue(element);
        controller.setState({ listIsVisible: false });
      }

      props.onValue?.(element.value);
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
