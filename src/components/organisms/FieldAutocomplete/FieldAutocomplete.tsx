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

interface FieldAutocompleteProps<
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
  onSearch?: (pattern: string) => void;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  placeholder?: string;
  reference?: (value: T) => K;
  searching?: boolean;
  value?: T;
}

interface FieldAutocompleteTemplateProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
> extends FieldAutocompleteProps<T, E, K> {
  render: (element: E) => ReactNode;
}

export function RlsFieldAutocompleteTemplate<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>(props: FieldAutocompleteTemplateProps<T, E, K>) {
  const autocomplete = useFieldAutocomplete(props);

  const {
    render,
    children,
    formControl,
    msgErrorDisabled,
    onSearch,
    placeholder,
    rlsTheme,
    searching
  } = props;

  const _disabled = formControl?.disabled || props.disabled;

  const className = renderClassStatus(
    'rls-field-box',
    {
      focused: autocomplete.focused && !_disabled,
      error: formControl?.wrong,
      disabled: _disabled,
      selected: !!autocomplete.value
    },
    'rls-field-list rls-field-autocomplete'
  );

  return (
    <div
      id={props.identifier}
      ref={autocomplete.contentRef}
      className={className}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            className="rls-field-list__control"
            readOnly={true}
            disabled={_disabled}
            placeholder={placeholder}
            value={autocomplete.value}
            onClick={autocomplete.onClickControl}
          />

          <button
            className="rls-field-list__action"
            disabled={_disabled}
            onClick={autocomplete.onClickAction}
          >
            <RlsIcon
              value={autocomplete.value ? 'trash-2' : 'arrow-ios-down'}
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
        className={renderClassStatus('rls-field-list__suggestions', {
          visible: autocomplete.modalIsVisible,
          higher: autocomplete.higher,
          hide: !autocomplete.modalIsVisible
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul ref={autocomplete.listRef} className="rls-field-list__ul">
            <div className="rls-field-list__ul__search">
              <input
                ref={autocomplete.inputRef}
                className="rls-field-list__ul__control"
                type="text"
                placeholder={reactI18n('listInputPlaceholder')}
                value={autocomplete.pattern}
                onChange={(event) => {
                  autocomplete.setPattern(event.target.value);
                }}
                disabled={_disabled || searching}
                onFocus={autocomplete.onFocusInput}
                onBlur={autocomplete.onBlurInput}
                onKeyDown={autocomplete.onKeydownInput}
              />

              {onSearch && (
                <button
                  disabled={_disabled || searching}
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

interface FormControlDefinedProps<T = any>
  extends FieldAutocompleteProps<T, AutocompleteElement<T>> {
  formControl: ReactControl<HTMLElement, NonNullable<T>>;
  value: NonNullable<T>;
  onValue?: (value: T) => void;
}

interface FormControlUndefinedProps<T = any>
  extends FieldAutocompleteProps<T, AutocompleteElement<T>> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  value: undefined;
  onValue?: (value?: T) => void;
}

interface FormControlVoidProps<T = any>
  extends Omit<FieldAutocompleteProps<T, AutocompleteElement<T>>, 'value'> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  onValue?: (value: T) => void;
}

interface FormControlEmptyProps<T = any>
  extends Omit<
    FieldAutocompleteProps<T, AutocompleteElement<T>>,
    'formControl' | 'value'
  > {
  onValue?: (value?: T) => void;
}

export function RlsFieldAutocomplete<T = any>(
  props: FormControlUndefinedProps<T>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FormControlDefinedProps<T>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FormControlVoidProps<T>
): JSX.Element;
export function RlsFieldAutocomplete<T = any>(
  props: FormControlEmptyProps<T>
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
