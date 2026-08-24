import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { reactI18n } from '../../../i18n';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import {
  FieldListAction,
  FieldListSearchControl,
  RlsFieldListSuggestions
} from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import { useFieldAutocomplete } from '../FieldAutocomplete/FieldAutocompleteController';

export interface ChooserAutocompleteState<T = any> {
  description: string;
  listIsVisible: boolean;
  pattern: string;
  value?: T;
}

interface ChooserAutocompleteProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>
  extends PropsWithRlsTheme, PropsWithClassName {
  suggestions: E[];
  action?: FieldListAction;
  automatic?: boolean;
  children?: ReactNode | ((state: ChooserAutocompleteState<T>) => ReactNode);
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  identifier?: string;
  keepOpen?: boolean;
  onInput?: (value: string) => void;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  reference?: (value: T) => K;
  searching?: boolean;
  value?: T;
}

interface ChooserAutocompleteTemplateProps<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
> extends ChooserAutocompleteProps<T, E, K> {
  render: (element: E) => ReactNode;
}

function RlsChooserAutocompleteTemplateComponent<
  T = any,
  E extends Element<T> = Element<T>,
  K = string
>(props: ChooserAutocompleteTemplateProps<T, E, K>) {
  const autocomplete = useFieldAutocomplete(props);

  const {
    render,
    action,
    children,
    formControl,
    onSearch,
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
    props.onInput?.(autocomplete.pattern);
  }, [autocomplete.pattern, props.onInput]);

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = renderClassStatus(
    'rls-chooser',
    {
      focused: autocomplete.focused && !disabled,
      visible: autocomplete.listIsVisible,
      disabled
    },
    `rls-chooser-autocomplete ${props.className ?? ''}`
  );

  const onClickPattern = useCallback(() => {
    onSearch?.(autocomplete.pattern);
  }, [onSearch, autocomplete.pattern]);

  const onKeyDownPattern = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onSearch?.(autocomplete.pattern);
      }

      autocomplete.onKeydownInput(event);
    },
    [autocomplete.onKeydownInput, onSearch, autocomplete.pattern]
  );

  const onKeydownTrigger = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
        case 'Enter':
          event.preventDefault();
          autocomplete.onClickControl();
          break;

        case 'Escape':
          autocomplete.onClickBackdrop();
          break;
      }
    },
    [autocomplete.onClickControl, autocomplete.onClickBackdrop]
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
      <div
        className="rls-chooser__trigger"
        role="combobox"
        aria-expanded={autocomplete.listIsVisible}
        aria-haspopup="listbox"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : autocomplete.onClickControl}
        onKeyDown={disabled ? undefined : onKeydownTrigger}
      >
        {typeof children === 'function'
          ? children({
              description: autocomplete.value,
              listIsVisible: autocomplete.listIsVisible,
              pattern: autocomplete.pattern,
              value: formControl?.value ?? props.value
            })
          : children}
      </div>

      <RlsFieldListSuggestions
        elements={autocomplete.coincidences}
        visible={autocomplete.listIsVisible}
        action={action}
        disabled={disabled}
        higher={autocomplete.higher}
        render={render}
        refAnchor={autocomplete.refContent}
        refList={autocomplete.refList}
        refSuggestions={autocomplete.refSuggestions}
        searchControl={searchControl}
        onClickElement={autocomplete.onClickElement}
        onKeydownElement={autocomplete.onKeydownElement}
        onClickBackdrop={autocomplete.onClickBackdrop}
        onHiddenAnchor={autocomplete.onClickBackdrop}
      />
    </div>
  );
}

export const RlsChooserAutocompleteTemplate = memo(
  RlsChooserAutocompleteTemplateComponent
) as typeof RlsChooserAutocompleteTemplateComponent;

function RlsChooserAutocompleteComponent<T = any>(
  props: ChooserAutocompleteProps<T, AutocompleteElement<T>>
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

  return <RlsChooserAutocompleteTemplate {...props} render={render} />;
}

export const RlsChooserAutocomplete = memo(
  RlsChooserAutocompleteComponent
) as typeof RlsChooserAutocompleteComponent;
