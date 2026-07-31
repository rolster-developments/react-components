import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { DateRange } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { memo, useCallback } from 'react';
import { PortalController } from '../../../controllers/PortalController';
import { RlsComponent } from '../../definitions';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDateRange } from '../PickerDateRange/PickerDateRange';

interface ModalDateRangeProps extends RlsComponent {
  automatic?: boolean;
  controller?: PortalController;
  date?: Date;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, DateRange>
    | ReactControl<HTMLElement, DateRange | undefined>;
  maxDate?: Date;
  minDate?: Date;
  onClose?: (dateRange?: DateRange) => void;
  visible?: boolean;
}

function RlsModalDateRangeComponent({
  automatic,
  controller,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onClose,
  rlsTheme,
  visible
}: ModalDateRangeProps) {
  const onListener = useCallback(
    ({ event, value }: PickerListener<DateRange>) => {
      onClose?.(event !== PickerListenerEvent.Cancel ? value : undefined);
      controller?.close();
    },
    [onClose, controller]
  );

  return (
    <RlsModal
      className="rls-modal-date-range"
      controller={controller}
      visible={visible}
      rlsTheme={rlsTheme}
    >
      <RlsPickerDateRange
        automatic={automatic}
        formControl={formControl}
        date={date}
        disabled={disabled}
        maxDate={maxDate}
        minDate={minDate}
        onListener={onListener}
      />
    </RlsModal>
  );
}

export const RlsModalDateRange = memo(RlsModalDateRangeComponent);
