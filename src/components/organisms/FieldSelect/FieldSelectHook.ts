import { AbstractListElement as Element } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, KeyboardEventHandler, MouseEventHandler } from 'react';
import { ListControl, useListControl } from '../../../hooks';

export interface FieldSelectControl<
  T = unknown,
  E extends Element<T> = Element<T>
> {
  listControl: ListControl<T>;
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onClickInput: () => void;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
}

interface FieldSelectProps<T = unknown, E extends Element<T> = Element<T>> {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T | undefined>;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

export function useFieldSelect<T = unknown, E extends Element<T> = Element<T>>({
  suggestions,
  formControl,
  onSelect,
  onValue
}: FieldSelectProps<T, E>): FieldSelectControl<T, E> {
  const listControl = useListControl({ suggestions, formControl });

  const {
    inputRef,
    listIsVisible,
    navigationElement,
    navigationInput,
    setFormValue,
    setState
  } = listControl;

  function onFocusInput(): void {
    setState({ focused: true });
  }

  function onBlurInput(): void {
    setState({ focused: false });
  }

  function onClickInput(): void {
    setState({ listIsVisible: true });
  }

  function onKeydownInput(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
      case 'Enter':
        setState({ listIsVisible: true });
        break;

      case 'Escape':
      case 'Tab':
        setState({ listIsVisible: false });
        break;

      default:
        navigationInput(event);
        break;
    }
  }

  function onClickAction(): void {
    setState({ listIsVisible: !listIsVisible });
    !listIsVisible && inputRef?.current?.focus();
  }

  function onClickBackdrop(): void {
    setState({ listIsVisible: false });
  }

  function onClickElement(element: Element<T>): MouseEventHandler {
    return () => {
      onChange(element);
    };
  }

  function onKeydownElement(element: Element<T>): KeyboardEventHandler {
    return (event) => {
      event.code === 'Enter' ? onChange(element) : navigationElement(event);
    };
  }

  function onChange({ description, value }: Element<T>): void {
    inputRef?.current?.focus();

    if (onSelect) {
      setState({ listIsVisible: false });
      onSelect(value);
    } else {
      setFormValue(value);
      setState({ listIsVisible: false, value: description });
    }

    onValue && onValue(value);
  }

  return {
    listControl,
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
