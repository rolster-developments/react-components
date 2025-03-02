import { ReactNode } from 'react';
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

interface DatatableSubheaderProps extends RlsComponent {
  className?: string;
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
  footer?: ReactNode;
  header?: ReactNode;
  summary?: ReactNode;
  toolbar?: ReactNode;
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

export function RlsDatatableSubheader({
  children,
  className,
  identifier
}: DatatableSubheaderProps) {
  return (
    <tr
      id={identifier}
      className={useRenderClassStatus(
        'rls-datatable__subheader',
        {},
        className
      ).trim()}
    >
      {children}
    </tr>
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
  summary,
  toolbar
}: DatatableProps) {
  return (
    <div
      className={useRenderClassStatus('rls-datatable', {
        scrolleable: datatable?.scrolleable
      })}
      rls-theme={rlsTheme}
    >
      {toolbar && <div className="rls-datatable__toolbar">{toolbar}</div>}

      <table id={identifier}>
        {header && <thead className="rls-datatable__head">{header}</thead>}

        <tbody ref={datatable?.tableRef} className="rls-datatable__body">
          {children}
        </tbody>
      </table>

      {summary && <div className="rls-datatable__summary">{summary}</div>}

      {footer && <div className="rls-datatable__footer">{footer}</div>}
    </div>
  );
}
