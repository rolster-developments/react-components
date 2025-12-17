import { ReactNode, useMemo } from 'react';
import { useDatatable } from '../../../controllers/DatatableController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Datatable.css';

interface DatatableProps extends RlsComponent {
  footer?: ReactNode;
  header?: ReactNode;
  resizable?: boolean;
  summary?: ReactNode;
  table?: HTMLTableSectionElement;
  toolbar?: ReactNode;
}

interface DatatableSubheaderProps extends RlsComponent {
  className?: string;
}

interface DatatableRecordProps extends RlsComponent {
  className?: string;
  contained?: boolean;
  error?: boolean;
  info?: boolean;
  success?: boolean;
  warning?: boolean;
}

interface DatatableCellProps extends RlsComponent {
  className?: string;
  contained?: boolean;
  control?: boolean;
}

interface DatatableFloatingProps extends RlsComponent {
  className?: string;
  invested?: boolean;
}

export function RlsDatatable({
  children,
  footer,
  header,
  identifier,
  rlsTheme,
  resizable,
  summary,
  table,
  toolbar
}: DatatableProps) {
  const datatable = useDatatable(table);

  const className = useMemo(() => {
    return renderClassStatus('rls-datatable', {
      resizable,
      scrolleable: resizable && datatable?.scrolleable
    });
  }, [resizable, datatable.scrolleable]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {toolbar && <div className="rls-datatable__toolbar">{toolbar}</div>}

      <div className="rls-datatable__table">
        <table id={identifier}>
          {header && <thead className="rls-datatable__head">{header}</thead>}

          <tbody ref={datatable?.refTable} className="rls-datatable__body">
            {children}
          </tbody>
        </table>
      </div>

      {summary && <div className="rls-datatable__summary">{summary}</div>}

      {footer && <div className="rls-datatable__footer">{footer}</div>}
    </div>
  );
}

export function RlsDatatableHeader({
  children,
  identifier,
  rlsTheme
}: RlsComponent) {
  return (
    <tr id={identifier} className="rls-datatable__header" rls-theme={rlsTheme}>
      {children}
    </tr>
  );
}

export function RlsDatatableTitle({
  children,
  className,
  control,
  identifier,
  rlsTheme
}: DatatableCellProps) {
  const classNameTitle = useMemo(() => {
    return renderClassStatus('rls-datatable__title', { control }, className);
  }, [className, control]);

  return (
    <th id={identifier} className={classNameTitle} rls-theme={rlsTheme}>
      {children}
    </th>
  );
}

export function RlsDatatableSubheader({
  children,
  className,
  identifier,
  rlsTheme
}: DatatableSubheaderProps) {
  const classNameSubheader = useMemo(() => {
    return renderClassStatus('rls-datatable__subheader', {}, className);
  }, [className]);

  return (
    <tr id={identifier} className={classNameSubheader} rls-theme={rlsTheme}>
      {children}
    </tr>
  );
}

export function RlsDatatableRecord({
  children,
  className,
  contained,
  error,
  identifier,
  info,
  success,
  warning,
  rlsTheme
}: DatatableRecordProps) {
  const classNameRecord = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__record',
      { error, info, contained, success, warning },
      className
    );
  }, [className, error, info, contained, success, warning]);

  return (
    <tr id={identifier} className={classNameRecord} rls-theme={rlsTheme}>
      {children}
    </tr>
  );
}

export function RlsDatatableTotals({
  children,
  className,
  contained,
  error,
  identifier,
  info,
  success,
  warning,
  rlsTheme
}: DatatableRecordProps) {
  const classNameTotals = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__totals',
      { error, info, contained, success, warning },
      className
    );
  }, [className, error, info, contained, success, warning]);

  return (
    <div id={identifier} className={classNameTotals} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}

export function RlsDatatableCell({
  children,
  className,
  contained,
  control,
  identifier,
  rlsTheme
}: DatatableCellProps) {
  const classNameCell = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__cell',
      { control, contained },
      className
    );
  }, [className, control, contained]);

  return (
    <td id={identifier} className={classNameCell} rls-theme={rlsTheme}>
      {children}
    </td>
  );
}

export function RlsDatatableData({
  children,
  className,
  contained,
  control,
  identifier
}: DatatableCellProps) {
  const classNameData = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__data',
      { control, contained },
      className
    );
  }, [className, contained, control]);

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
  invested,
  rlsTheme
}: DatatableFloatingProps) {
  const classNameFloating = useMemo(() => {
    return renderClassStatus(
      'rls-datatable__floating',
      { invested },
      className
    );
  }, [className, invested]);

  return (
    <td id={identifier} className={classNameFloating} rls-theme={rlsTheme}>
      {children}
    </td>
  );
}
