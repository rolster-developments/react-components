import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers';
import { reactI18n } from '../../../i18n';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsProgressBar } from '../../atoms/ProgressBar/ProgressBar';
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
  lineHeight?: number;
  msgErrorDisabled?: boolean;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  placeholder?: string;
  reference?: (value: T) => K;
  searching?: boolean;
  selectionContinuos?: boolean;
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

  const [labels, setLabels] = useState({
    listEmptyDescription: reactI18n('listEmptyDescription'),
    listEmptyTitle: reactI18n('listEmptyTitle'),
    listInputPlaceholder: reactI18n('listInputPlaceholder')
  });

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabels({
        listEmptyDescription: reactI18n('listEmptyDescription'),
        listEmptyTitle: reactI18n('listEmptyTitle'),
        listInputPlaceholder: reactI18n('listInputPlaceholder')
      });
    });
  }, []);

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
        selected: !!autocomplete.value
      },
      'rls-field-list rls-field-autocomplete'
    );
  }, [formControl?.wrong, autocomplete.value, autocomplete.focused, disabled]);

  const classNameList = useMemo(() => {
    return renderClassStatus('rls-field-list__suggestions', {
      higher: autocomplete.higher,
      visible: autocomplete.modalIsVisible
    });
  }, [autocomplete.higher, autocomplete.modalIsVisible]);

  const onChangePattern = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      autocomplete.setPattern(event.target.value);
    },
    [autocomplete.setPattern]
  );

  const onClickPattern = useCallback(() => {
    onSearch && onSearch(autocomplete.pattern);
  }, [onSearch, autocomplete.pattern]);

  const onKeyDownPattern = useCallback(
    (event: KeyboardEvent) => {
      event.key === 'Enter' && onSearch && onSearch(autocomplete.pattern);

      autocomplete.onKeydownInput(event);
    },
    [autocomplete.onKeydownInput, onSearch, autocomplete.pattern]
  );

  return (
    <div
      id={props.identifier}
      ref={autocomplete.refContent}
      className={className}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

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

          <button
            className="rls-field-list__action"
            disabled={disabled}
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

      <div className={classNameList}>
        <div className="rls-field-list__suggestions__body">
          <ul ref={autocomplete.refList} className="rls-field-list__ul">
            <div className="rls-field-list__ul__search">
              <input
                ref={autocomplete.refInput}
                className="rls-field-list__ul__control"
                type="text"
                placeholder={labels.listInputPlaceholder}
                value={autocomplete.pattern}
                onChange={onChangePattern}
                onFocus={autocomplete.onFocusInput}
                onBlur={autocomplete.onBlurInput}
                onKeyDown={onKeyDownPattern}
                disabled={disabled || searching}
              />

              {onSearch && (
                <button
                  disabled={disabled || searching}
                  onClick={onClickPattern}
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
                  <label className="rls-label-bold rls-truncate">
                    {labels.listEmptyTitle}
                  </label>

                  <p className="rls-caption-regular">
                    {labels.listEmptyDescription}
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
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FormControlDefinedProps<T>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FormControlVoidProps<T>
): ReactNode;
export function RlsFieldAutocomplete<T = any>(
  props: FormControlEmptyProps<T>
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
