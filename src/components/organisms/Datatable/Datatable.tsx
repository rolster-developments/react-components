import {
  DatatableController,
  useRenderClassStatus
} from '../../../controllers';
import { RlsComponent } from '../../definitions';

interface DatatableCellProps extends RlsComponent {
  className?: string;
  control?: boolean;
  overflow?: boolean;
}

interface DatatableRecordProps extends RlsComponent {
  className?: string;
  error?: boolean;
  info?: boolean;
  successs?: boolean;
  warning?: boolean;
}

interface DatatableProps extends RlsComponent {
  datatable?: DatatableController;
  footer?: JSX.Element;
  header?: JSX.Element;
  summary?: JSX.Element;
}

export function RlsDatatableHeader({ children, identifier }: RlsComponent) {
  return (
    <tr id={identifier} className="rls-datatable__header">
      {children}
    </tr>
  );
}

export function RlsDatatableTitle({
  children,
  className,
  control,
  identifier
}: DatatableCellProps) {
  return (
    <th
      id={identifier}
      className={useRenderClassStatus(
        'rls-datatable__title',
        { control },
        className
      ).trim()}
    >
      {children}
    </th>
  );
}

export function RlsDatatableRecord({
  children,
  className,
  error,
  identifier,
  info,
  successs,
  warning
}: DatatableRecordProps) {
  return (
    <tr
      id={identifier}
      className={useRenderClassStatus(
        'rls-datatable__record',
        { error, info, successs, warning },
        className
      ).trim()}
    >
      {children}
    </tr>
  );
}

export function RlsDatatableTotals({
  children,
  className,
  error,
  identifier,
  info,
  successs,
  warning
}: DatatableRecordProps) {
  return (
    <div
      id={identifier}
      className={useRenderClassStatus(
        'rls-datatable__totals',
        { error, info, successs, warning },
        className
      ).trim()}
    >
      {children}
    </div>
  );
}

export function RlsDatatableCell({
  children,
  className,
  control,
  identifier,
  overflow
}: DatatableCellProps) {
  return (
    <th
      id={identifier}
      className={useRenderClassStatus(
        'rls-datatable__cell',
        { control, overflow },
        className
      ).trim()}
    >
      {children}
    </th>
  );
}

export function RlsDatatableData({
  children,
  className,
  control,
  identifier,
  overflow
}: DatatableCellProps) {
  return (
    <div
      id={identifier}
      className={useRenderClassStatus(
        'rls-datatable__data',
        { control, overflow },
        className
      ).trim()}
    >
      {children}
    </div>
  );
}

export function RlsDatatable({
  children,
  datatable,
  footer,
  header,
  identifier,
  rlsTheme,
  summary
}: DatatableProps) {
  return (
    <div
      className={useRenderClassStatus('rls-datatable', {
        scrolleable: datatable?.scrolleable
      })}
      rls-theme={rlsTheme}
    >
      <table id={identifier}>
        {header && <thead className="rls-datatable__thead">{header}</thead>}

        <tbody ref={datatable?.tableRef} className="rls-datatable__tbody">
          {children}
        </tbody>
      </table>

      {summary && <div className="rls-datatable__tsummary">{summary}</div>}

      {footer && <div className="rls-datatable__tfooter">{footer}</div>}
    </div>
  );
}
