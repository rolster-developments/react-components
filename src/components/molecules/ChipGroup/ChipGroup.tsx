import { ReactControl } from '@rolster/react-forms';
import { memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsChip } from '../../atoms/Chip/Chip';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';
import { RolsterReactHtmlControl } from '../../types';

interface ChipGroupProps<T = any, K = any>
  extends PropsWithRlsTheme, PropsWithClassName {
  options: T[];
  disabled?: boolean;
  formControl?: RolsterReactHtmlControl<T>;
  identifier?: string;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  reference?: (option: T) => K;
  render?: (option: T) => ReactNode;
  value?: T;
}

interface ChipGroupDefinedProps<T = any, K = any> extends ChipGroupProps<T, K> {
  formControl: ReactControl<HTMLElement, T>;
  value: T;
  onValue?: (value: T) => void;
}

interface ChipGroupVoidProps<T = any, K = any> extends Omit<
  ChipGroupProps<T, K>,
  'value'
> {
  formControl: ReactControl<HTMLElement, T | undefined>;
  onValue?: (value?: T) => void;
}

interface ChipGroupEmptyProps<T = any, K = any> extends Omit<
  ChipGroupProps<T, K>,
  'formControl'
> {
  onValue?: (value?: T) => void;
}

function RlsChipGroupComponent<T = any, K = any>(
  props: ChipGroupDefinedProps<T, K>
): ReactNode;
function RlsChipGroupComponent<T = any, K = any>(
  props: ChipGroupVoidProps<T, K>
): ReactNode;
function RlsChipGroupComponent<T = any, K = any>(
  props: ChipGroupEmptyProps<T, K>
): ReactNode;
function RlsChipGroupComponent<T = any, K = any>({
  className,
  disabled: disabledProps,
  formControl,
  identifier,
  onValue,
  options,
  reference,
  render,
  rlsTheme,
  value: valueInitial
}: ChipGroupProps<T, K>) {
  const [value, setValue] = useState(formControl?.value ?? valueInitial);

  const selected = useMemo(() => {
    return formControl ? formControl.value : value;
  }, [formControl?.value, value]);

  const disabled = useMemo(() => {
    return formControl?.disabled || disabledProps;
  }, [formControl?.disabled, disabledProps]);

  const classNameGroup = renderClassStatus(
    'rls-chip-group',
    { disabled },
    className
  );

  const isSelected = useCallback(
    (option: T) => {
      if (selected === undefined || selected === null) {
        return false;
      }

      return reference
        ? reference(option) === reference(selected)
        : option === selected;
    },
    [reference, selected]
  );

  const onSelect = useCallback(
    (option: T) => () => {
      if (disabled) {
        return;
      }

      setValue(option);
      formControl?.setValue(option);
      formControl?.touch();
      onValue?.(option);
    },
    [disabled, formControl, onValue]
  );

  return (
    <div id={identifier} className={classNameGroup} rls-theme={rlsTheme}>
      {options.map((option, index) => (
        <RlsChip
          key={index}
          disabled={disabled}
          selected={isSelected(option)}
          onClick={onSelect(option)}
        >
          {render ? render(option) : String(option)}
        </RlsChip>
      ))}
    </div>
  );
}

export const RlsChipGroup = memo(
  RlsChipGroupComponent
) as typeof RlsChipGroupComponent;
