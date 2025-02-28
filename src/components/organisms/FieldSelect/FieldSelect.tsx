import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import { reactI18n } from '../../../i18n';
import { useRenderClassStatus } from '../../../controllers';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot, RlsMessageFormError } from '../../molecules';
import { useFieldSelect } from './FieldSelectController';
import './FieldSelect.css';

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

  const _disabled = formControl?.disabled || props.disabled;

  const className = useRenderClassStatus(
    'rls-field-box',
    {
      focused: select.focused && !_disabled,
      error: formControl?.wrong,
      disabled: _disabled
    },
    'rls-field-list rls-field-select'
  );

  return (
    <div
      id={props.identifier}
      ref={select.contentRef}
      className={className}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            ref={select.inputRef}
            className="rls-field-list__control"
            readOnly={true}
            disabled={_disabled}
            placeholder={placeholder}
            value={select.value}
            onFocus={select.onFocusInput}
            onBlur={select.onBlurInput}
            onClick={select.onClickInput}
            onKeyDown={select.onKeydownInput}
          />
          <button
            className={'rls-field-list__action'}
            disabled={_disabled}
            onClick={select.onClickAction}
          >
            <RlsIcon
              value={
                !unremovable && !!select.value ? 'close' : 'arrow-ios-down'
              }
            />
          </button>
        </div>
      </div>

      {!msgErrorDisabled && (
        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      )}

      <div
        className={useRenderClassStatus('rls-field-list__suggestions', {
          visible: select.modalIsVisible,
          higher: select.higher,
          hide: !select.modalIsVisible
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul ref={select.listRef} className="rls-field-list__ul">
            {suggestions.map((element, index) => (
              <li
                key={index}
                className="rls-field-list__element"
                tabIndex={-1}
                onClick={select.onClickElement(element)}
                onKeyDown={select.onKeydownElement(element)}
              >
                {render(element)}
              </li>
            ))}

            {!suggestions.length && (
              <li className="rls-field-list__empty">
                <div className="rls-field-list__empty__description">
                  <label className="rls-label-bold truncate">
                    {reactI18n('listEmptyTitle')}
                  </label>
                  <p className="rls-caption-regular">
                    {reactI18n('listEmptyDescription')}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div
          className="rls-field-list__backdrop"
          onClick={select.onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}

interface FormControlDefinedProps<T = any>
  extends FieldSelectProps<T, ListElement<T>> {
  formControl: ReactControl<HTMLElement, NonNullable<T>>;
  value: NonNullable<T>;
  onValue?: (value: T) => void;
}

interface FormControlUndefinedProps<T = any>
  extends FieldSelectProps<T, ListElement<T>> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  value: undefined;
  onValue?: (value?: T) => void;
}

interface FormControlVoidProps<T = any>
  extends Omit<FieldSelectProps<T, ListElement<T>>, 'value'> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  onValue?: (value?: T) => void;
}

interface FormControlEmptyProps<T = any>
  extends Omit<FieldSelectProps<T, ListElement<T>>, 'formControl' | 'value'> {
  onValue?: (value?: T) => void;
}

export function RlsFieldSelect<T = any>(
  props: FormControlUndefinedProps<T>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FormControlDefinedProps<T>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FormControlVoidProps<T>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FormControlEmptyProps<T>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FieldSelectProps<T, ListElement<T>>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FieldSelectProps<T, ListElement<T>>
) {
  return (
    <RlsFieldSelectTemplate
      {...props}
      render={(element) => (
        <RlsBallot
          subtitle={element.subtitle}
          img={element.img}
          initials={element.initials}
        >
          <span>{element.title}</span>
        </RlsBallot>
      )}
    />
  );
}
