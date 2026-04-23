import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import { RlsFieldListSuggestions } from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { useFieldSelect } from './FieldSelectController';

interface FieldSelectProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
> extends RlsComponent {
  suggestions: E[];
  automatic?: boolean;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  msgErrorDisabled?: boolean;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  placeholder?: string;
  readOnly?: boolean;
  reference?: (value: T) => K;
  unremovable?: boolean;
  value?: T;
}

interface FieldSelectTemplateProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
> extends FieldSelectProps<T, E, K> {
  render: (element: E) => ReactNode;
}

export function RlsFieldSelectTemplate<
  T = any,
  E extends ListElement<T> = ListElement<T>,
  K = string
>(props: FieldSelectTemplateProps<T, E, K>) {
  const select = useFieldSelect(props);

  const {
    render,
    suggestions,
    children,
    formControl,
    msgErrorDisabled,
    placeholder,
    rlsTheme,
    unremovable
  } = props;

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = useMemo(() => {
    return renderClassStatus(
      'rls-field-box',
      {
        focused: select.focused && !disabled,
        error: formControl?.wrong,
        disabled: disabled,
        readonly: props.readOnly
      },
      `rls-field-list rls-field-select ${props.className ?? ''}`
    );
  }, [
    formControl?.wrong,
    select.focused,
    props.className,
    props.readOnly,
    disabled
  ]);

  return (
    <div
      id={props.identifier}
      ref={select.refContent}
      className={className}
      rls-theme={rlsTheme}
    >
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            ref={select.refInput}
            className="rls-field-list__control"
            readOnly={true}
            placeholder={placeholder}
            value={select.value}
            onFocus={select.onFocusInput}
            onBlur={select.onBlurInput}
            onClick={select.onClickInput}
            onKeyDown={select.onKeydownInput}
            disabled={disabled}
          />

          {!props.readOnly && (
            <button
              className={'rls-field-list__action'}
              disabled={disabled}
              onClick={select.onClickAction}
            >
              <RlsIcon
                value={
                  !unremovable && !!select.value ? 'close' : 'arrow-ios-down'
                }
              />
            </button>
          )}
        </div>
      </div>

      {!msgErrorDisabled && (
        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      )}

      <RlsFieldListSuggestions
        elements={suggestions}
        visible={select.listIsVisible}
        disabled={disabled}
        higher={select.higher}
        render={render}
        refList={select.refList}
        onClickElement={select.onClickElement}
        onKeydownElement={select.onKeydownElement}
        onClickBackdrop={select.onClickBackdrop}
      />
    </div>
  );
}

interface FieldSelectDefinedProps<T = any> extends FieldSelectProps<
  T,
  ListElement<T>
> {
  formControl: ReactControl<HTMLElement, NonNullable<T>>;
  value: NonNullable<T>;
  onValue?: (value: T) => void;
}

interface FieldSelectUndefinedProps<T = any> extends FieldSelectProps<
  T,
  ListElement<T>
> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  value: undefined;
  onValue?: (value?: T) => void;
}

interface FieldSelectVoidProps<T = any> extends Omit<
  FieldSelectProps<T, ListElement<T>>,
  'value'
> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  onValue?: (value?: T) => void;
}

interface FieldSelectEmptyProps<T = any> extends Omit<
  FieldSelectProps<T, ListElement<T>>,
  'formControl' | 'value'
> {
  onValue?: (value?: T) => void;
}

export function RlsFieldSelect<T = any>(
  props: FieldSelectUndefinedProps<T>
): ReactNode;
export function RlsFieldSelect<T = any>(
  props: FieldSelectDefinedProps<T>
): ReactNode;
export function RlsFieldSelect<T = any>(
  props: FieldSelectVoidProps<T>
): ReactNode;
export function RlsFieldSelect<T = any>(
  props: FieldSelectEmptyProps<T>
): ReactNode;
export function RlsFieldSelect<T = any>(
  props: FieldSelectProps<T, ListElement<T>>
): ReactNode;
export function RlsFieldSelect<T = any>(
  props: FieldSelectProps<T, ListElement<T>>
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

  return <RlsFieldSelectTemplate {...props} render={render} />;
}
