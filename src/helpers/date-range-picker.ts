import { dateFormatTemplate, DateRange } from '@rolster/dates';

import { DATE_RANGE_FORMAT } from '../constants/picker.constant';

export function rangeFormatTemplate({ maxDate, minDate }: DateRange): string {
  const minFormat = dateFormatTemplate(minDate, DATE_RANGE_FORMAT);
  const maxFormat = dateFormatTemplate(maxDate, DATE_RANGE_FORMAT);

  return `${minFormat} - ${maxFormat}`;
}
