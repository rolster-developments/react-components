import { i18nSubscribe } from '@rolster/i18n';

import {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { reactI18n } from '../../../i18n';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsProgressBar } from '../../atoms/ProgressBar/ProgressBar';
import { PropsWithRlsTheme } from '../../definitions';

export interface FieldListSearchControl {
  onChange: (pattern: string) => void;
  pattern: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onSearch?: () => void;
  placeholder?: string;
  refInput?: RefObject<HTMLInputElement | null>;
  searching?: boolean;
}

export interface FieldListAction {
  description: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
  keepOpen?: boolean;
}

interface FieldListSuggestionsProps<E = any> extends PropsWithRlsTheme {
  elements: E[];
  onClickBackdrop: MouseEventHandler;
  onClickElement: (element: E) => MouseEventHandler;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  render: (element: E) => ReactNode;
  visible: boolean;
  action?: FieldListAction;
  disabled?: boolean;
  higher?: boolean;
  refList?: RefObject<HTMLUListElement | null>;
  renderEmpty?: () => ReactNode;
  searchControl?: FieldListSearchControl;
}

interface FieldListLiProps<E = any> {
  element: E;
  onClickElement: (element: E) => MouseEventHandler;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  render: (element: E) => ReactNode;
}

function RlsFieldListLi<E>({
  element,
  onClickElement,
  onKeydownElement,
  render
}: FieldListLiProps<E>) {
  const onClick = useMemo(() => {
    return onClickElement(element);
  }, [element, onClickElement]);

  const onKeyDown = useMemo(() => {
    return onKeydownElement(element);
  }, [element, onKeydownElement]);

  return (
    <li
      className="rls-field-list__element"
      tabIndex={-1}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {render(element)}
    </li>
  );
}

export function RlsFieldListSuggestions<E = any>({
  elements,
  action,
  disabled,
  higher,
  render,
  renderEmpty,
  searchControl,
  visible,
  onClickBackdrop,
  onClickElement,
  onKeydownElement,
  refList,
  rlsTheme
}: FieldListSuggestionsProps<E>) {
  const [labels, setLabels] = useState({
    listEmptyDescription: reactI18n('listEmptyDescription'),
    listEmptyTitle: reactI18n('listEmptyTitle')
  });

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabels({
        listEmptyDescription: reactI18n('listEmptyDescription'),
        listEmptyTitle: reactI18n('listEmptyTitle')
      });
    });
  }, []);

  const className = useMemo(() => {
    return renderClassStatus('rls-field-list__suggestions', {
      disabled,
      higher,
      visible
    });
  }, [disabled, higher, visible]);

  const onChangePattern = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      searchControl?.onChange(event.target.value);
    },
    [searchControl?.onChange]
  );

  const onClickAction = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      action?.onClick();

      if (!action?.keepOpen) {
        onClickBackdrop(event);
      }
    },
    [action?.onClick, action?.keepOpen, onClickBackdrop]
  );

  const searching = searchControl?.searching ?? false;

  return (
    <div className={className} rls-theme={rlsTheme}>
      <div className="rls-field-list__suggestions__body">
        <ul ref={refList} className="rls-field-list__ul">
          {searchControl && (
            <div className="rls-field-list__ul__search">
              <input
                className="rls-field-list__ul__control"
                ref={searchControl.refInput}
                type="text"
                placeholder={searchControl.placeholder}
                value={searchControl.pattern}
                onChange={onChangePattern}
                onFocus={searchControl.onFocus}
                onBlur={searchControl.onBlur}
                onKeyDown={searchControl.onKeyDown}
                disabled={disabled || searching}
              />

              {searchControl.onSearch && (
                <button
                  disabled={disabled || searching}
                  onClick={searchControl.onSearch}
                >
                  <RlsIcon value="search" />
                </button>
              )}
            </div>
          )}

          {searching && <RlsProgressBar indeterminate={true} />}

          {elements.map((element, index) => (
            <RlsFieldListLi
              key={index}
              element={element}
              onClickElement={onClickElement}
              onKeydownElement={onKeydownElement}
              render={render}
            />
          ))}

          {!elements.length && (
            <li className="rls-field-list__empty">
              {renderEmpty ? (
                renderEmpty()
              ) : (
                <div className="rls-field-list__empty__description">
                  <span className="rls-label-font-bold rls-truncate">
                    {labels.listEmptyTitle}
                  </span>

                  <p className="rls-caption-font-regular">
                    {labels.listEmptyDescription}
                  </p>
                </div>
              )}
            </li>
          )}
        </ul>

        {action && (
          <div className="rls-field-list__action">
            <button
              type="button"
              disabled={disabled || action.disabled}
              onClick={onClickAction}
            >
              {action.icon && <RlsIcon value={action.icon} />}
              <span className="rls-field-list__action__description">
                {action.description}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="rls-field-list__backdrop" onClick={onClickBackdrop}></div>
    </div>
  );
}
