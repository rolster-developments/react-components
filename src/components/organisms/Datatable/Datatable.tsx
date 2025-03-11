import { ReactNode, useMemo } from 'react';
import { DatatableController } from '../../../controllers';
import { renderClassStatus } from '../../../helpers';
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
  const classDatatableName = useMemo(() => {
    return renderClassStatus('rls-datatable__title', { control }, className);
  }, [control, className]);

  return (
    <th id={identifier} className={classDatatableName}>
      {children}
    </th>
  );
}

export function RlsDatatableSubheader({
  children,
  className,
  identifier
}: DatatableSubheaderProps) {
  const classDatatableName = useMemo(() => {
    return renderClassStatus('rls-datatable__subheader', {}, className);
  }, [className]);

  return (
    <tr id={identifier} className={classDatatableName}>
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
  const classDatatableName = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__record',
      { error, info, successs, warning },
      className
    );
  }, [error, info, successs, warning, className]);

  return (
    <tr id={identifier} className={classDatatableName}>
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
  const classDatatableName = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__totals',
      { error, info, successs, warning },
      className
    );
  }, [error, info, successs, warning, className]);

  return (
    <div id={identifier} className={classDatatableName}>
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
  const classDatatableName = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__cell',
      { control, overflow },
      className
    );
  }, [control, overflow, className]);

  return (
    <th id={identifier} className={classDatatableName}>
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
  const classDatatableName = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__data',
      { control, overflow },
      className
    );
  }, [control, overflow, className]);

  return (
    <div id={identifier} className={classDatatableName}>
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
  const className = useMemo(() => {
    return renderClassStatus('rls-datatable', {
      scrolleable: datatable?.scrolleable
    });
  }, [datatable]);

  return (
    <div className={className} rls-theme={rlsTheme}>
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
