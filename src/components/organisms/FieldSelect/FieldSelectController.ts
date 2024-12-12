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
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  value?: T;
}

interface FieldValueProps<T = any, E extends Element<T> = Element<T>>
  extends FieldSelectProps<T, E> {
  value: NonUndefined<T>;
}

interface FieldUndefinedProps<T = any, E extends Element<T> = Element<T>>
  extends FieldSelectProps<T | undefined, E> {
  value: undefined;
}

type FieldVoidProps<T = any, E extends Element<T> = Element<T>> = Omit<
  FieldValueProps<T | undefined, E>,
  'value'
>;

export function useFieldSelect<T = any, E extends Element<T> = Element<T>>(
  props: FieldVoidProps<T, E>
): FieldSelectControl<T | undefined, E>;
export function useFieldSelect<T = any, E extends Element<T> = Element<T>>(
  props: FieldUndefinedProps<T, E>
): FieldSelectControl<T | undefined, E>;
export function useFieldSelect<T = any, E extends Element<T> = Element<T>>(
  props: FieldValueProps<T, E>
): FieldSelectControl<T, E>;
export function useFieldSelect<T = any, E extends Element<T> = Element<T>>(
  props: FieldSelectProps<T, E>
): FieldSelectControl<T, E>;
export function useFieldSelect<T = any, E extends Element<T> = Element<T>>(
  props: FieldSelectProps<T, E>
): FieldSelectControl<T, E> {
  const controller = useListController(props);

  function onFocusInput(): void {
    controller.setState({ focused: true });
  }

  function onBlurInput(): void {
    controller.setState({ focused: false });
  }

  function onClickInput(): void {
    controller.setState({ listIsVisible: true });
  }

  function onKeydownInput(event: KeyboardEvent): void {
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
  }

  function onClickAction(): void {
    controller.setState({ listIsVisible: !controller.listIsVisible });
    !controller.listIsVisible && controller.inputRef?.current?.focus();
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
    controller.inputRef?.current?.focus();

    if (props.onSelect) {
      controller.setState({ listIsVisible: false });
      value && props.onSelect(value);
    } else {
      controller.setFormValue(value);
      controller.setState({ listIsVisible: false, value: description });
    }

    props.onValue && props.onValue(value);
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
