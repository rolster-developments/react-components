import { ReactNode, useMemo } from 'react';
import { DatatableController } from '../../../controllers';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';

interface DatatableProps extends RlsComponent {
  datatable?: DatatableController;
  footer?: ReactNode;
  header?: ReactNode;
  summary?: ReactNode;
  toolbar?: ReactNode;
}

interface DatatableSubheaderProps extends RlsComponent {
  className?: string;
}

interface DatatableRecordProps extends RlsComponent {
  className?: string;
  error?: boolean;
  info?: boolean;
  overflow?: boolean;
  successs?: boolean;
  warning?: boolean;
}

interface DatatableCellProps extends RlsComponent {
  className?: string;
  control?: boolean;
  overflow?: boolean;
}

interface DatatableFloatingProps extends RlsComponent {
  className?: string;
  invested?: boolean;
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
  const classNameTitle = useMemo(() => {
    return renderClassStatus('rls-datatable__title', { control }, className);
  }, [className, control]);

  return (
    <th id={identifier} className={classNameTitle}>
      {children}
    </th>
  );
}

export function RlsDatatableSubheader({
  children,
  className,
  identifier
}: DatatableSubheaderProps) {
  const classNameSubheader = useMemo(() => {
    return renderClassStatus('rls-datatable__subheader', {}, className);
  }, [className]);

  return (
    <tr id={identifier} className={classNameSubheader}>
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
  overflow,
  successs,
  warning
}: DatatableRecordProps) {
  const classNameRecord = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__record',
      { error, info, overflow, successs, warning },
      className
    );
  }, [className, error, info, overflow, successs, warning]);

  return (
    <tr id={identifier} className={classNameRecord}>
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
  overflow,
  successs,
  warning
}: DatatableRecordProps) {
  const classNameTotals = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__totals',
      { error, info, overflow, successs, warning },
      className
    );
  }, [className, error, info, overflow, successs, warning]);

  return (
    <div id={identifier} className={classNameTotals}>
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
  const classNameCell = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__cell',
      { control, overflow },
      className
    );
  }, [className, control, overflow]);

  return (
    <td id={identifier} className={classNameCell}>
      {children}
    </td>
  );
}

export function RlsDatatableData({
  children,
  className,
  control,
  identifier,
  overflow
}: DatatableCellProps) {
  const classNameData = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__data',
      { control, overflow },
      className
    );
  }, [className, overflow, control]);

  return (
    <div id={identifier} className={classNameData}>
      {children}
    </div>
  );
}

export function RlsDatatableFloating({
  children,
  className,
  identifier,
  invested
}: DatatableFloatingProps) {
  const classNameFloating = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__floating',
      { invested },
      className
    );
  }, [className, invested]);

  return (
    <td id={identifier} className={classNameFloating}>
      {children}
    </td>
  );
}
