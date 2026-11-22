import { DateRange, Time } from '@rolster/dates';
import { useFormControl, useInputControl } from '@rolster/react-forms';
import { useCallback } from 'react';
import {
  ButtonToggleOption,
  RlsAccordion,
  RlsAlert,
  RlsButton,
  RlsButtonOption,
  RlsButtonToggle,
  RlsFieldClock,
  RlsFieldColor,
  RlsFieldDate,
  RlsFieldDateRange,
  RlsFieldFile,
  RlsPickerClock,
  RlsPickerColor,
  RlsPickerDateRange,
  RlsPickerDayRange,
  RlsPickerMonth,
  RlsPickerYear,
  RlsPoster,
  useRlsContext
} from '../../index';

import './ComponentsPage.scss';

const TOGGLE_OPTIONS: ButtonToggleOption[] = [
  { label: 'Save', value: 'save' },
  { label: 'Save as draft', value: 'draft' },
  { label: 'Save and close', value: 'close' }
];

export function ComponentsPage() {
  const { confirmation, notify, snackbar } = useRlsContext();

  const rangeControl = useFormControl<DateRange>(DateRange.now());
  const monthControl = useFormControl<number>(new Date().getMonth());
  const yearControl = useFormControl<number>(new Date().getFullYear());
  const dateRangeControl = useFormControl<DateRange>(DateRange.now());
  const timeControl = useFormControl<Time>(new Time(9, 30));
  const colorControl = useFormControl<string>('#4e73f8');

  const fieldDateControl = useFormControl<Date>();
  const fieldRangeControl = useFormControl<DateRange>();
  const fieldTimeControl = useFormControl<Time>();
  const fieldColorControl = useFormControl<string>();
  const fileControl = useInputControl<File>();
  const viewControl = useFormControl<string>('grid');

  const onConfirmation = useCallback(() => {
    confirmation({
      title: 'Delete employee?',
      subtitle: 'This action cannot be undone',
      content: <p>Roman Bellic will be removed from the team.</p>,
      approved: { label: 'Delete', rlsTheme: 'warning' },
      reject: { label: 'Cancel' }
    });
  }, [confirmation]);

  const onNotify = useCallback(() => {
    notify({
      title: 'Changes saved',
      content: <p>The employee profile was updated.</p>,
      icon: 'checkmark',
      rlsTheme: 'success'
    });
  }, [notify]);

  const onSnackbar = useCallback(() => {
    snackbar({
      content: (
        <p>La factura ha sido enviada correctamente por correo electrónico</p>
      ),
      title: 'Facturacion electrónica',
      icon: 'shopping-cart',
      rlsTheme: 'primary'
    });
  }, [snackbar]);

  return (
    <section className="components-page">
      <div className="components-page__group">
        <span className="rls-subtitle-font">Fields</span>

        <div className="components-page__row">
          <RlsFieldDate
            formControl={fieldDateControl}
            placeholder="Select date"
          >
            Date
          </RlsFieldDate>

          <RlsFieldDateRange
            formControl={fieldRangeControl}
            placeholder="Select period"
          >
            Period
          </RlsFieldDateRange>

          <RlsFieldClock formControl={fieldTimeControl} placeholder="Hour">
            Start time
          </RlsFieldClock>

          <RlsFieldColor formControl={fieldColorControl} placeholder="Color">
            Brand color
          </RlsFieldColor>

          <RlsFieldFile
            formControl={fileControl}
            accept="image/*"
            placeholder="Choose a file"
          >
            Attachment
          </RlsFieldFile>
        </div>
      </div>

      <div className="components-page__group">
        <span className="rls-subtitle-font">Feedback</span>

        <div className="components-page__row">
          <RlsAlert icon="info">
            <span className="rls-body-font">
              Your session expires in ten minutes.
            </span>
          </RlsAlert>

          <RlsAlert icon="alert-triangle" rlsTheme="warning">
            <span className="rls-body-font">
              The budget of this month is almost spent.
            </span>
          </RlsAlert>
        </div>

        <div className="components-page__actions">
          <RlsButton type="raised" onClick={onConfirmation}>
            Confirmation
          </RlsButton>

          <RlsButton type="flat" onClick={onNotify}>
            Notification
          </RlsButton>

          <RlsButton type="ghost" onClick={onSnackbar}>
            Snackbar
          </RlsButton>

          <RlsButtonToggle
            type="raised"
            options={TOGGLE_OPTIONS}
            onAction={() => {}}
          />
        </div>

        <div className="components-page__actions">
          <RlsButtonOption icon="grid" value="grid" formControl={viewControl}>
            Grid
          </RlsButtonOption>

          <RlsButtonOption icon="list" value="list" formControl={viewControl}>
            List
          </RlsButtonOption>

          <RlsButtonOption icon="map" value="map" formControl={viewControl}>
            Map
          </RlsButtonOption>

          <RlsPoster>Draft</RlsPoster>

          <RlsPoster rlsTheme="success">Published</RlsPoster>

          <RlsPoster contrasted={true} rlsTheme="warning">
            Pending
          </RlsPoster>
        </div>

        <RlsAccordion title="Job description" opened={true}>
          <p className="rls-body-font">
            Design and ship the dashboard experience with the rest of the team.
          </p>
        </RlsAccordion>
      </div>

      <div className="components-page__group">
        <span className="rls-subtitle-font">Pickers</span>

        <div className="components-page__pickers">
          <RlsPickerDayRange formControl={rangeControl} />
          <RlsPickerMonth formControl={monthControl} />
          <RlsPickerYear formControl={yearControl} />
        </div>

        <div className="components-page__pickers">
          <RlsPickerDateRange formControl={dateRangeControl} />
          <RlsPickerClock formControl={timeControl} />
          <RlsPickerColor formControl={colorControl} />
        </div>
      </div>
    </section>
  );
}
