import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import { reactI18n } from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot, RlsMessageFormError } from '../../molecules';
import { useFieldSelect } from './FieldSelectController';
import './FieldSelect.css';

interface FieldSelectProps<T = any, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  msgErrorDisabled?: boolean;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value: T) => void;
  placeholder?: string;
  value?: T;
}

interface FieldSelectTemplateProps<T = any, E extends Element<T> = Element<T>>
  extends FieldSelectProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsFieldSelectTemplate<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldSelectTemplateProps<T, E>) {
  const select = useFieldSelect(props);

  const { controller } = select;

  const {
    render,
    suggestions,
    children,
    formControl,
    msgErrorDisabled,
    placeholder,
    rlsTheme
  } = props;

  const disabled = formControl?.disabled || props.disabled;

  const className = renderClassStatus(
    'rls-field-box',
    {
      focused: controller.focused,
      disabled,
      error: formControl?.wrong
    },
    'rls-field-list rls-field-select'
  );

  return (
    <div ref={controller.contentRef} className={className} rls-theme={rlsTheme}>
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            ref={controller.inputRef}
            className="rls-field-list__control"
            readOnly={true}
            disabled={disabled}
            placeholder={placeholder}
            value={controller.value}
            onFocus={select.onFocusInput}
            onBlur={select.onBlurInput}
            onClick={select.onClickInput}
            onKeyDown={select.onKeydownInput}
          />
          <button
            className={renderClassStatus('rls-field-list__action', {
              visible: controller.listIsVisible
            })}
            disabled={disabled}
            onClick={select.onClickAction}
          >
            <RlsIcon value="arrow-ios-down" />
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
        className={renderClassStatus('rls-field-list__suggestions', {
          visible: controller.listIsVisible,
          higher: controller.higher,
          hide: !controller.listIsVisible
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul ref={controller.listRef} className="rls-field-list__ul">
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

interface FieldValueProps<T = any, E extends Element<T> = Element<T>>
  extends FieldSelectProps<T, E> {
  value: NonUndefined<T>;
}

interface FieldUndefinedProps<T = any, E extends Element<T> = Element<T>>
  extends FieldSelectProps<T, E> {
  value: undefined;
}

type FieldVoidProps<T = any, E extends Element<T> = Element<T>> = Omit<
  FieldValueProps<T, E>,
  'value'
>;

export function RlsFieldSelect<T = any>(
  props: FieldVoidProps<T, ListElement<T>>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FieldUndefinedProps<T, ListElement<T>>
): JSX.Element;
export function RlsFieldSelect<T = any>(
  props: FieldValueProps<T, ListElement<T>>
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
