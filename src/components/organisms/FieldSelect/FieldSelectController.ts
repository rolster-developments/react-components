import { AbstractListElement as Element } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, KeyboardEventHandler, MouseEventHandler } from 'react';
import { ListController, useListController } from '../../../controllers';

export interface FieldSelectControl<
  T = any,
  E extends Element<T> = Element<T>
> {
  controller: ListController<T>;
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onClickInput: () => void;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
}

interface FieldSelectProps<T = any, E extends Element<T> = Element<T>> {
  suggestions: E[];
  automatic?: boolean;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  value?: T;
}

export function useFieldSelect<T = any, E extends Element<T> = Element<T>>(
  props: FieldSelectProps<T, E>
): FieldSelectControl<T, E> {
  const controller = useListController<T>(props);

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
    const modalIsVisible = !controller.modalIsVisible;

    controller.setState({ modalIsVisible });
    modalIsVisible && controller.inputRef?.current?.focus();
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

  function onChange({ description, value }: Element<T>): void {
    const { onSelect, onValue } = props;

    controller.inputRef?.current?.focus();

    if (onSelect) {
      controller.setState({ modalIsVisible: false });
      value && onSelect(value);
    } else {
      controller.setFormValue(value);
      controller.setState({ modalIsVisible: false, value: description });
    }

    onValue && onValue(value);
  }

  return {
    controller,
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
