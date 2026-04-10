import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { reactI18n } from '../../../i18n';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import {
  FieldListSearchControl,
  RlsFieldListSuggestions
} from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
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
  keepOpen?: boolean;
  lineHeight?: number;
  msgErrorDisabled?: boolean;
  onInput?: (value: string) => void;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  placeholder?: string;
  readOnly?: boolean;
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

  const [listInputPlaceholder, setListInputPlaceholder] = useState(
    reactI18n('listInputPlaceholder')
  );

  useEffect(() => {
    return i18nSubscribe(() => {
      setListInputPlaceholder(reactI18n('listInputPlaceholder'));
    });
  }, []);

  useEffect(() => {
    props.onInput?.(autocomplete.value);
  }, [autocomplete.value, props.onInput]);

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = useMemo(() => {
    return renderClassStatus(
      'rls-field-box',
      {
        focused: autocomplete.focused && !disabled,
        error: formControl?.wrong,
        disabled,
        readonly: props.readOnly,
        selected: !!autocomplete.value
      },
      `rls-field-list rls-field-autocomplete ${props.className ?? ''}`
    );
  }, [
    formControl?.wrong,
    autocomplete.value,
    autocomplete.focused,
    props.className,
    props.readOnly,
    disabled
  ]);

  const onClickPattern = useCallback(() => {
    onSearch?.(autocomplete.pattern);
  }, [onSearch, autocomplete.pattern]);

  const onKeyDownPattern = useCallback(
    (event: KeyboardEvent) => {
      event.key === 'Enter' && onSearch?.(autocomplete.pattern);

      autocomplete.onKeydownInput(event);
    },
    [autocomplete.onKeydownInput, onSearch, autocomplete.pattern]
  );

  const searchControl = useMemo<FieldListSearchControl>(
    () => ({
      pattern: autocomplete.pattern,
      placeholder: listInputPlaceholder,
      searching,
      refInput: autocomplete.refInput,
      onChange: autocomplete.setPattern,
      onFocus: autocomplete.onFocusInput,
      onBlur: autocomplete.onBlurInput,
      onKeyDown: onKeyDownPattern,
      onSearch: onSearch ? onClickPattern : undefined
    }),
    [
      autocomplete.pattern,
      autocomplete.refInput,
      autocomplete.setPattern,
      autocomplete.onFocusInput,
      autocomplete.onBlurInput,
      listInputPlaceholder,
      searching,
      onKeyDownPattern,
      onClickPattern,
      onSearch
    ]
  );

  return (
    <div
      id={props.identifier}
      ref={autocomplete.refContent}
      className={className}
      rls-theme={rlsTheme}
    >
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            className="rls-field-list__control"
            readOnly={true}
            disabled={disabled}
            placeholder={placeholder}
            value={autocomplete.value}
            onClick={autocomplete.onClickControl}
          />

          {!props.readOnly && (
            <button
              className="rls-field-list__action"
              disabled={disabled}
              onClick={autocomplete.onClickAction}
            >
              <RlsIcon
                value={autocomplete.value ? 'trash-2' : 'arrow-ios-down'}
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
        elements={autocomplete.coincidences}
        visible={autocomplete.listIsVisible}
        disabled={disabled}
        higher={autocomplete.higher}
        render={render}
        refList={autocomplete.refList}
        searchControl={searchControl}
        onClickElement={autocomplete.onClickElement}
        onKeydownElement={autocomplete.onKeydownElement}
        onClickBackdrop={autocomplete.onClickBackdrop}
      />
    </div>
  );
}

interface FieldAutocompleteDefinedProps<T = any> extends FieldAutocompleteProps<
  T,
  AutocompleteElement<T>
> {
  formControl: ReactControl<HTMLElement, NonNullable<T>>;
  value: NonNullable<T>;
  onValue?: (value: T) => void;
}

interface FieldAutocompleteUndefinedProps<
  T = any
> extends FieldAutocompleteProps<T, AutocompleteElement<T>> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  value: undefined;
  onValue?: (value?: T) => void;
}

interface FieldAutocompleteVoidProps<T = any> extends Omit<
  FieldAutocompleteProps<T, AutocompleteElement<T>>,
  'value'
> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  onValue?: (value: T) => void;
}

interface FieldAutocompleteEmptyProps<T = any> extends Omit<
  FieldAutocompleteProps<T, AutocompleteElement<T>>,
  'formControl' | 'value'
> {
  onValue?: (value?: T) => void;
}

export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteUndefinedProps<T>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteDefinedProps<T>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteVoidProps<T>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteEmptyProps<T>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteProps<T, AutocompleteElement<T>>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FieldAutocompleteProps<T, AutocompleteElement<T>>
) {
  const render = useCallback(
    (element: AutocompleteElement<T>) => (
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

  return <RlsFieldAutocompleteTemplate {...props} render={render} />;
}
