import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsCheckBox } from '../../atoms/CheckBox/CheckBox';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import {
  FieldListAction,
  RlsFieldListSuggestions
} from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { FieldListControl, useFieldList } from './FieldListController';

interface FieldListProps<
  T = any,
  E extends Element<T> = Element<T>
> extends RlsComponent {
  suggestions: E[];
  action?: FieldListAction;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T[]>
    | ReactControl<HTMLElement, NonNullable<T>[]>
    | ReactControl<HTMLElement, T[] | undefined>;
  msgErrorDisabled?: boolean;
  onValue?: (value: T[]) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: T[];
}

interface FieldListTemplateProps<
  T = any,
  E extends Element<T> = Element<T>
> extends FieldListProps<T, E> {
  render: (element: E) => ReactNode;
}

interface FieldListInnerProps<
  T = any,
  E extends Element<T> = Element<T>
> extends FieldListTemplateProps<T, E> {
  fieldList: FieldListControl<T, E>;
}

function RlsFieldListInner<T = any, E extends Element<T> = Element<T>>({
  render,
  suggestions,
  action,
  children,
  formControl,
  fieldList,
  msgErrorDisabled,
  placeholder,
  rlsTheme,
  ...props
}: FieldListInnerProps<T, E>) {
  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = useMemo(() => {
    return renderClassStatus(
      'rls-field-box',
      {
        focused: fieldList.listIsVisible && !disabled,
        error: formControl?.wrong,
        disabled,
        readonly: props.readOnly
      },
      `rls-field-list rls-field-list__multi ${props.className ?? ''}`
    );
  }, [
    formControl?.wrong,
    fieldList.listIsVisible,
    props.className,
    props.readOnly,
    disabled
  ]);

  const renderWithCheckbox = useCallback(
    (element: E) => (
      <div className="rls-field-list__multi__element">
        <RlsCheckBox checked={fieldList.isSelected(element)} />
        {render(element)}
      </div>
    ),
    [fieldList.isSelected, render]
  );

  return (
    <div
      id={props.identifier}
      ref={fieldList.refContent}
      className={className}
      rls-theme={rlsTheme}
    >
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <div
            className="rls-field-list__multi__chips"
            onClick={disabled ? undefined : fieldList.onClickInput}
          >
            {!fieldList.selected.length && placeholder ? (
              <span className="rls-field-list__multi__placeholder">
                {placeholder}
              </span>
            ) : (
              fieldList.selected.map((item, index) => (
                <div key={index} className="rls-field-list__multi__chip">
                  <span className="rls-field-list__multi__chip__description">
                    {item.description}
                  </span>

                  {!props.readOnly && (
                    <button
                      className="rls-field-list__multi__chip__remove"
                      onClick={fieldList.onRemoveElement(item)}
                      disabled={disabled}
                    >
                      <RlsIcon value="close" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {!props.readOnly && (
            <RlsButtonIcon
              icon="arrow-ios-down"
              onClick={fieldList.onClickAction}
              disabled={disabled}
            />
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
        visible={fieldList.listIsVisible}
        action={action}
        disabled={disabled}
        higher={fieldList.higher}
        render={renderWithCheckbox}
        refList={fieldList.refList}
        onClickElement={fieldList.onClickElement}
        onKeydownElement={fieldList.onKeydownElement}
        onClickBackdrop={fieldList.onClickBackdrop}
      />
    </div>
  );
}

export function RlsFieldListTemplate<
  T = any,
  E extends Element<T> = Element<T>
>(props: FieldListTemplateProps<T, E>) {
  const fieldList = useFieldList(props);

  return <RlsFieldListInner {...props} fieldList={fieldList} />;
}

interface FieldListDefinedProps<T = any> extends FieldListProps<
  T,
  ListElement<T>
> {
  formControl: ReactControl<HTMLElement, NonNullable<T>[]>;
  value: NonNullable<T>[];
  onValue?: (value: T[]) => void;
}

interface FieldListUndefinedProps<T = any> extends FieldListProps<
  T,
  ListElement<T>
> {
  formControl: ReactControl<HTMLElement, T[]>;
  value: T[];
  onValue?: (value: T[]) => void;
}

interface FieldListVoidProps<T = any> extends Omit<
  FieldListProps<T, ListElement<T>>,
  'value'
> {
  formControl: ReactControl<HTMLElement, T[] | undefined>;
  onValue?: (value: T[]) => void;
}

interface FieldListEmptyProps<T = any> extends Omit<
  FieldListProps<T, ListElement<T>>,
  'formControl' | 'value'
> {
  onValue?: (value?: T[]) => void;
}

export function RlsFieldList<T = any>(
  props: FieldListUndefinedProps<T>
): ReactNode;
export function RlsFieldList<T = any>(
  props: FieldListDefinedProps<T>
): ReactNode;
export function RlsFieldList<T = any>(props: FieldListVoidProps<T>): ReactNode;
export function RlsFieldList<T = any>(props: FieldListEmptyProps<T>): ReactNode;
export function RlsFieldList<T = any>(
  props: FieldListProps<T, ListElement<T>>
): ReactNode;
export function RlsFieldList<T = any>(
  props: FieldListProps<T, ListElement<T>>
) {
  const fieldList = useFieldList(props);

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

  return <RlsFieldListInner {...props} render={render} fieldList={fieldList} />;
}
