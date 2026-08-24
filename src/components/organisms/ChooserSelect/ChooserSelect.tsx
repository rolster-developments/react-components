import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, memo, ReactNode, useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import {
  FieldListAction,
  RlsFieldListSuggestions
} from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import { useFieldSelect } from '../FieldSelect/FieldSelectController';

export interface ChooserSelectState<T = any> {
  description: string;
  listIsVisible: boolean;
  value?: T;
}

interface ChooserSelectProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>
  extends PropsWithRlsTheme, PropsWithClassName {
  suggestions: E[];
  action?: FieldListAction;
  automatic?: boolean;
  children?: ReactNode | ((state: ChooserSelectState<T>) => ReactNode);
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  identifier?: string;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  reference?: (value: T) => K;
  value?: T;
}

interface ChooserSelectTemplateProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
> extends ChooserSelectProps<T, E, K> {
  render: (element: E) => ReactNode;
}

function RlsChooserSelectTemplateComponent<
  T = any,
  E extends ListElement<T> = ListElement<T>,
  K = string
>(props: ChooserSelectTemplateProps<T, E, K>) {
  const select = useFieldSelect({ ...props, unremovable: true });

  const { render, suggestions, action, children, formControl, rlsTheme } =
    props;

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = renderClassStatus(
    'rls-chooser',
    {
      focused: select.focused && !disabled,
      visible: select.listIsVisible,
      disabled
    },
    `rls-chooser-select ${props.className ?? ''}`
  );

  const onKeydownTrigger = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
      }

      select.onKeydownInput(event);
    },
    [select.onKeydownInput]
  );

  return (
    <div
      id={props.identifier}
      ref={select.refContent}
      className={className}
      rls-theme={rlsTheme}
    >
      <div
        className="rls-chooser__trigger"
        role="combobox"
        aria-expanded={select.listIsVisible}
        aria-haspopup="listbox"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : select.onClickAction}
        onKeyDown={disabled ? undefined : onKeydownTrigger}
        onFocus={select.onFocusInput}
        onBlur={select.onBlurInput}
      >
        {typeof children === 'function'
          ? children({
              description: select.value,
              listIsVisible: select.listIsVisible,
              value: formControl?.value ?? props.value
            })
          : children}
      </div>

      <RlsFieldListSuggestions
        elements={suggestions}
        visible={select.listIsVisible}
        action={action}
        disabled={disabled}
        higher={select.higher}
        render={render}
        refAnchor={select.refContent}
        refList={select.refList}
        refSuggestions={select.refSuggestions}
        onClickElement={select.onClickElement}
        onKeydownElement={select.onKeydownElement}
        onClickBackdrop={select.onClickBackdrop}
        onHiddenAnchor={select.onClickBackdrop}
      />
    </div>
  );
}

export const RlsChooserSelectTemplate = memo(
  RlsChooserSelectTemplateComponent
) as typeof RlsChooserSelectTemplateComponent;

function RlsChooserSelectComponent<T = any>(
  props: ChooserSelectProps<T, ListElement<T>>
) {
  const render = useCallback(
    (element: ListElement<T>) => (
      <RlsBallot
        className="rls-field-list__ballot"
        subtitle={element.subtitle}
        img={element.img}
        initials={element.initials}
      >
        <span>{element.title}</span>
      </RlsBallot>
    ),
    []
  );

  return <RlsChooserSelectTemplate {...props} render={render} />;
}

export const RlsChooserSelect = memo(
  RlsChooserSelectComponent
) as typeof RlsChooserSelectComponent;
