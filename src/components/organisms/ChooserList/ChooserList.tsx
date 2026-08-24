import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, memo, ReactNode, useCallback, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsCheckBox } from '../../atoms/CheckBox/CheckBox';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import {
  FieldListAction,
  RlsFieldListSuggestions
} from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import { useFieldList } from '../FieldList/FieldListController';

export interface ChooserListState<T = any, E extends Element<T> = Element<T>> {
  listIsVisible: boolean;
  selected: E[];
}

interface ChooserListProps<T = any, E extends Element<T> = Element<T>>
  extends PropsWithRlsTheme, PropsWithClassName {
  suggestions: E[];
  action?: FieldListAction;
  children?: ReactNode | ((state: ChooserListState<T, E>) => ReactNode);
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T[]>
    | ReactControl<HTMLElement, NonNullable<T>[]>
    | ReactControl<HTMLElement, T[] | undefined>;
  identifier?: string;
  onValue?: (value: T[]) => void;
  value?: T[];
}

interface ChooserListTemplateProps<
  T = any,
  E extends Element<T> = Element<T>
> extends ChooserListProps<T, E> {
  render: (element: E) => ReactNode;
}

function RlsChooserListTemplateComponent<
  T = any,
  E extends Element<T> = Element<T>
>(props: ChooserListTemplateProps<T, E>) {
  const fieldList = useFieldList(props);

  const { render, suggestions, action, children, formControl, rlsTheme } =
    props;

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = renderClassStatus(
    'rls-chooser',
    {
      visible: fieldList.listIsVisible,
      disabled
    },
    `rls-chooser-list ${props.className ?? ''}`
  );

  const onKeydownTrigger = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
        case 'Enter':
          event.preventDefault();
          fieldList.onClickAction();
          break;

        case 'Escape':
          fieldList.onClickBackdrop();
          break;
      }
    },
    [fieldList.onClickAction, fieldList.onClickBackdrop]
  );

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
      <div
        className="rls-chooser__trigger"
        role="combobox"
        aria-expanded={fieldList.listIsVisible}
        aria-haspopup="listbox"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : fieldList.onClickAction}
        onKeyDown={disabled ? undefined : onKeydownTrigger}
      >
        {typeof children === 'function'
          ? children({
              listIsVisible: fieldList.listIsVisible,
              selected: fieldList.selected
            })
          : children}
      </div>

      <RlsFieldListSuggestions
        elements={suggestions}
        visible={fieldList.listIsVisible}
        action={action}
        disabled={disabled}
        higher={fieldList.higher}
        render={renderWithCheckbox}
        refAnchor={fieldList.refContent}
        refList={fieldList.refList}
        refSuggestions={fieldList.refSuggestions}
        onClickElement={fieldList.onClickElement}
        onKeydownElement={fieldList.onKeydownElement}
        onClickBackdrop={fieldList.onClickBackdrop}
        onHiddenAnchor={fieldList.onClickBackdrop}
      />
    </div>
  );
}

export const RlsChooserListTemplate = memo(
  RlsChooserListTemplateComponent
) as typeof RlsChooserListTemplateComponent;

function RlsChooserListComponent<T = any>(
  props: ChooserListProps<T, ListElement<T>>
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

  return <RlsChooserListTemplate {...props} render={render} />;
}

export const RlsChooserList = memo(
  RlsChooserListComponent
) as typeof RlsChooserListComponent;
