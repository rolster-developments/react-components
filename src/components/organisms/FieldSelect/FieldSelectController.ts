import { AbstractListElement as Element } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, KeyboardEventHandler, MouseEventHandler } from 'react';
import { useListController } from '../../../controllers';
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
  const controller = useListController<T, K>(props);

  function onFocusInput(): void {
    controller.setState({ focused: true });
  }

  function onBlurInput(): void {
    controller.setState({ focused: false });
  }

  function onClickInput(): void {
    controller.setState({ modalIsVisible: true });
  }

  function onKeydownInput(event: KeyboardEvent): void {
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
  }

  function onClickAction(): void {
    const removable = !props.unremovable && !!controller.value;

    if (removable) {
      controller.setState({ modalIsVisible: false });
      controller.setFormValue(undefined);
      props.onValue && props.onValue(props.value as T);
    } else {
      const modalIsVisible = !controller.modalIsVisible;
      controller.setState({ modalIsVisible });
      modalIsVisible && controller.inputRef?.current?.focus();
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

    controller.inputRef?.current?.focus();

    if (onSelect) {
      controller.setState({ modalIsVisible: false });
      element.value && onSelect(element.value);
    } else {
      controller.setFormValue(element);
      controller.setState({ modalIsVisible: false });
    }

    onValue && onValue(element.value);
  }

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
