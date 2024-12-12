import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import { reactI18n } from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon, RlsProgressBar } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot, RlsMessageFormError } from '../../molecules';
import { useFieldAutocomplete } from './FieldAutocompleteController';
import './FieldAutocomplete.css';

interface FieldAutocompleteProps<T = any, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  hiddenIcon?: boolean;
  msgErrorDisabled?: boolean;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: (value?: T) => void;
  placeholder?: string;
  searching?: boolean;
  value?: T;
}

interface FieldAutocompleteTemplateProps<
  T = any,
  E extends Element<T> = Element<T>
> extends FieldAutocompleteProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsFieldAutocompleteTemplate<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldAutocompleteTemplateProps<T, E>) {
  const autocomplete = useFieldAutocomplete(props);

  const { controller } = autocomplete;

  const {
    render,
    children,
    formControl,
    hiddenIcon,
    msgErrorDisabled,
    onSearch,
    placeholder,
    rlsTheme,
    searching
  } = props;

  const disabled = formControl?.disabled || props.disabled;

  const className = renderClassStatus(
    'rls-field-box',
    {
      focused: controller.focused,
      disabled,
      error: formControl?.wrong,
      selected: !!controller.value
    },
    'rls-field-list rls-field-autocomplete'
  );

  return (
    <div ref={controller.contentRef} className={className} rls-theme={rlsTheme}>
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            className="rls-field-list__control"
            readOnly={true}
            disabled={disabled}
            placeholder={placeholder}
            value={controller.value}
            onClick={autocomplete.onClickControl}
          />

          {!hiddenIcon && controller.value && (
            <button
              className="rls-field-list__action"
              disabled={disabled}
              onClick={autocomplete.onClickAction}
            >
              <RlsIcon value="trash-2" />
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

      <div
        className={renderClassStatus('rls-field-list__suggestions', {
          visible: controller.listIsVisible,
          higher: controller.higher,
          hide: !controller.listIsVisible
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul ref={controller.listRef} className="rls-field-list__ul">
            <div className="rls-field-list__ul__search">
              <input
                ref={controller.inputRef}
                className="rls-field-list__ul__control"
                type="text"
                placeholder={reactI18n('listInputPlaceholder')}
                value={autocomplete.pattern}
                onChange={({ target: { value } }) => {
                  autocomplete.setPattern(value);
                }}
                disabled={disabled || searching}
                onFocus={autocomplete.onFocusInput}
                onBlur={autocomplete.onBlurInput}
                onKeyDown={autocomplete.onKeydownInput}
              />

              {onSearch && (
                <button
                  disabled={disabled || searching}
                  onClick={() => {
                    onSearch(autocomplete.pattern);
                  }}
                >
                  <RlsIcon value="search" />
                </button>
              )}
            </div>

            {searching && <RlsProgressBar indeterminate={true} />}

            {autocomplete.coincidences.map((element, index) => (
              <li
                key={index}
                className="rls-field-list__element"
                tabIndex={-1}
                onClick={autocomplete.onClickElement(element)}
                onKeyDown={autocomplete.onKeydownElement(element)}
              >
                {render(element)}
              </li>
            ))}

            {!autocomplete.coincidences.length && (
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
          onClick={autocomplete.onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}

interface FieldValueProps<T = any, E extends Element<T> = Element<T>>
  extends FieldAutocompleteProps<T, E> {
  value: NonUndefined<T>;
}

interface FieldUndefinedProps<T = any, E extends Element<T> = Element<T>>
  extends FieldAutocompleteProps<T, E> {
  value: undefined;
}

type FieldVoidProps<T = any, E extends Element<T> = Element<T>> = Omit<
  FieldValueProps<T, E>,
  'value'
>;

export function RlsFieldAutocomplete<T = any>(
  props: FieldVoidProps<T, AutocompleteElement<T>>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FieldUndefinedProps<T, AutocompleteElement<T>>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FieldValueProps<T, AutocompleteElement<T>>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteProps<T, AutocompleteElement<T>>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteProps<T, AutocompleteElement<T>>
) {
  return (
    <RlsFieldAutocompleteTemplate
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
