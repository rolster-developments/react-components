import { ReactControl } from '@rolster/react-forms';
import { memo, ReactNode } from 'react';
import { useFormSingleSelectionController } from '../../../controllers/FormSingleSelectionController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsRadioButton } from '../../atoms/RadioButton/RadioButton';
import { RlsComponent } from '../../definitions';

interface LabelRadioButtonProps<T = any> extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, T>;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  reverse?: boolean;
  value?: T;
}

interface LabelRadioButtonDefinedProps<T> extends LabelRadioButtonProps<T> {
  formControl: ReactControl<HTMLElement, T>;
  value: T;
  onValue?: (value: T) => void;
}

function RlsLabelRadioButtonComponent<T>(
  props: LabelRadioButtonDefinedProps<T>
): ReactNode;
function RlsLabelRadioButtonComponent<T = any>(
  props: LabelRadioButtonProps<T>
): ReactNode;
function RlsLabelRadioButtonComponent<T = any>({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  onValue,
  reverse,
  rlsTheme,
  value
}: LabelRadioButtonProps<T>) {
  const { checked, onSelect } = useFormSingleSelectionController<T>({
    disabled,
    formControl,
    onValue,
    value
  });

  const className = renderClassStatus('rls-label-radiobutton', {
    disabled,
    extended,
    reverse
  });

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-radiobutton__component" onClick={onSelect}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>

      <div className="rls-label-radiobutton__text">{children}</div>
    </div>
  );
}

export const RlsLabelRadioButton = memo(
  RlsLabelRadioButtonComponent
) as typeof RlsLabelRadioButtonComponent;
