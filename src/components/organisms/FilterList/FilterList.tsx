import { ListElement } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { memo, ReactNode, useCallback } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsIcon } from '../../atoms/Icon/Icon';
import {
  PropsWithClassName,
  PropsWithRlsSize,
  PropsWithRlsTheme
} from '../../definitions';
import { RlsBallot } from '../../molecules/Ballot/Ballot';
import { FieldListAction } from '../../molecules/FieldListSuggestions/FieldListSuggestions';
import {
  ChooserListState,
  RlsChooserListTemplate
} from '../ChooserList/ChooserList';

interface FilterListProps<T = any, E extends ListElement<T> = ListElement<T>>
  extends PropsWithRlsTheme, PropsWithRlsSize, PropsWithClassName {
  suggestions: E[];
  action?: FieldListAction;
  children?: ReactNode;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T[]>
    | ReactControl<HTMLElement, NonNullable<T>[]>
    | ReactControl<HTMLElement, T[] | undefined>;
  header?: ReactNode;
  identifier?: string;
  onValue?: (value: T[]) => void;
  placeholder?: string;
  render?: (element: E) => ReactNode;
  searchable?: boolean;
  value?: T[];
}

function renderBallot<T, E extends ListElement<T>>(element: E): ReactNode {
  return (
    <RlsBallot
      className="rls-field-list__ballot"
      subtitle={element.subtitle}
      img={element.img}
      initials={element.initials}
    >
      <span>{element.title}</span>
    </RlsBallot>
  );
}

function RlsFilterListComponent<
  T = any,
  E extends ListElement<T> = ListElement<T>
>({
  children,
  className,
  placeholder,
  render,
  searchable = true,
  header,
  ...props
}: FilterListProps<T, E>) {
  const disabled = props.formControl?.disabled || props.disabled;

  const renderHeader = useCallback(
    ({ clear, selected }: ChooserListState<T, E>) => (
      <div className="rls-filter__header">
        <span className="rls-filter__header__title">{header ?? children}</span>

        <RlsButtonAction
          icon="close"
          disabled={disabled || !selected.length}
          onClick={clear}
        />
      </div>
    ),
    [children, disabled, header]
  );

  const renderTrigger = useCallback(
    ({ listIsVisible, selected }: ChooserListState<T, E>) => {
      const classNameTrigger = renderClassStatus('rls-filter__trigger', {
        active: selected.length > 0,
        disabled,
        visible: listIsVisible
      });

      return (
        <div className={classNameTrigger}>
          <span className="rls-filter__label">{children}</span>

          {selected.length > 0 && (
            <span className="rls-filter__counter">{selected.length}</span>
          )}

          <RlsIcon
            className="rls-filter__caret"
            value={listIsVisible ? 'arrow-ios-up' : 'arrow-ios-down'}
          />
        </div>
      );
    },
    [children, disabled]
  );

  return (
    <RlsChooserListTemplate
      {...props}
      className={renderClassStatus('rls-filter', { list: true }, className)}
      header={renderHeader}
      panelClassName="rls-filter__panel"
      render={render ?? renderBallot}
      searchable={searchable}
      searchPlaceholder={placeholder}
    >
      {renderTrigger}
    </RlsChooserListTemplate>
  );
}

export const RlsFilterList = memo(
  RlsFilterListComponent
) as typeof RlsFilterListComponent;
