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
  ChooserSelectState,
  RlsChooserSelectTemplate
} from '../ChooserSelect/ChooserSelect';

interface FilterSelectProps<
  T = any,
  E extends ListElement<T> = ListElement<T>,
  K = string
>
  extends PropsWithRlsTheme, PropsWithRlsSize, PropsWithClassName {
  suggestions: E[];
  action?: FieldListAction;
  children?: ReactNode;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, NonNullable<T>>;
  header?: ReactNode;
  identifier?: string;
  onSelect?: (value: NonNullable<T>) => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  placeholder?: string;
  reference?: (value: T) => K;
  render?: (element: E) => ReactNode;
  searchable?: boolean;
  value?: T;
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

function RlsFilterSelectComponent<
  T = any,
  E extends ListElement<T> = ListElement<T>,
  K = string
>({
  children,
  className,
  placeholder,
  render,
  searchable = true,
  header,
  ...props
}: FilterSelectProps<T, E, K>) {
  const disabled = props.formControl?.disabled || props.disabled;

  const renderHeader = useCallback(
    ({ clear, value }: ChooserSelectState<T>) => (
      <div className="rls-filter__header">
        <span className="rls-filter__header__title">{header ?? children}</span>

        <RlsButtonAction
          icon="close"
          disabled={disabled || value === undefined || value === null}
          onClick={clear}
        />
      </div>
    ),
    [children, disabled, header]
  );

  const renderTrigger = useCallback(
    ({ description, listIsVisible, value }: ChooserSelectState<T>) => {
      const active = value !== undefined && value !== null;

      const classNameTrigger = renderClassStatus('rls-filter__trigger', {
        active,
        disabled,
        visible: listIsVisible
      });

      return (
        <div className={classNameTrigger}>
          <span className="rls-filter__label">{children}</span>

          {active && <span className="rls-filter__value">{description}</span>}

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
    <RlsChooserSelectTemplate
      {...props}
      className={renderClassStatus('rls-filter', { select: true }, className)}
      header={renderHeader}
      panelClassName="rls-filter__panel"
      render={render ?? renderBallot}
      searchable={searchable}
      searchPlaceholder={placeholder}
    >
      {renderTrigger}
    </RlsChooserSelectTemplate>
  );
}

export const RlsFilterSelect = memo(
  RlsFilterSelectComponent
) as typeof RlsFilterSelectComponent;
