import { memo, ReactNode } from 'react';
import { useDatatable } from '../../../controllers/DatatableController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface DatatableProps extends RlsComponent {
  footer?: ReactNode;
  header?: ReactNode;
  resizable?: boolean;
  summary?: ReactNode;
  table?: HTMLTableSectionElement;
  toolbar?: ReactNode;
}

type DatatableSubheaderProps = RlsComponent;

interface DatatableRecordProps extends RlsComponent {
  error?: boolean;
  info?: boolean;
  success?: boolean;
  truncated?: boolean;
  warning?: boolean;
}

interface DatatableCellProps extends RlsComponent {
  actions?: boolean;
  control?: boolean;
  truncated?: boolean;
}

interface DatatableFloatingProps extends RlsComponent {
  invested?: boolean;
}

function RlsDatatableComponent({
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

  const className = renderClassStatus('rls-datatable', {
    resizable,
    scrolleable: resizable && datatable?.scrolleable
  });

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

export const RlsDatatable = memo(RlsDatatableComponent);

function RlsDatatableHeaderComponent({
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

export const RlsDatatableHeader = memo(RlsDatatableHeaderComponent);

function RlsDatatableTitleComponent({
  actions,
  children,
  className,
  control,
  identifier,
  rlsTheme,
  truncated
}: DatatableCellProps) {
  const classNameTitle = renderClassStatus(
    'rls-datatable__title',
    { actions, control, truncated },
    className
  );

  return (
    <th id={identifier} className={classNameTitle} rls-theme={rlsTheme}>
      {children}
    </th>
  );
}

export const RlsDatatableTitle = memo(RlsDatatableTitleComponent);

function RlsDatatableSubheaderComponent({
  children,
  className,
  identifier,
  rlsTheme
}: DatatableSubheaderProps) {
  const classNameSubheader = renderClassStatus(
    'rls-datatable__subheader',
    {},
    className
  );

  return (
    <tr id={identifier} className={classNameSubheader} rls-theme={rlsTheme}>
      {children}
    </tr>
  );
}

export const RlsDatatableSubheader = memo(RlsDatatableSubheaderComponent);

function RlsDatatableRecordComponent({
  children,
  className,
  error,
  identifier,
  info,
  rlsTheme,
  success,
  truncated,
  warning
}: DatatableRecordProps) {
  const classNameRecord = renderClassStatus(
    'rls-datatable__record',
    { error, info, truncated, success, warning },
    className
  );

  return (
    <tr id={identifier} className={classNameRecord} rls-theme={rlsTheme}>
      {children}
    </tr>
  );
}

export const RlsDatatableRecord = memo(RlsDatatableRecordComponent);

function RlsDatatableTotalsComponent({
  children,
  className,
  error,
  identifier,
  info,
  rlsTheme,
  success,
  truncated,
  warning
}: DatatableRecordProps) {
  const classNameTotals = renderClassStatus(
    'rls-datatable__totals',
    { error, info, truncated, success, warning },
    className
  );

  return (
    <div id={identifier} className={classNameTotals} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}

export const RlsDatatableTotals = memo(RlsDatatableTotalsComponent);

function RlsDatatableCellComponent({
  actions,
  children,
  className,
  control,
  identifier,
  rlsTheme,
  truncated
}: DatatableCellProps) {
  const classNameCell = renderClassStatus(
    'rls-datatable__cell',
    { actions, control, truncated },
    className
  );

  return (
    <td id={identifier} className={classNameCell} rls-theme={rlsTheme}>
      {children}
    </td>
  );
}

export const RlsDatatableCell = memo(RlsDatatableCellComponent);

function RlsDatatableDataComponent({
  actions,
  children,
  className,
  control,
  identifier,
  truncated
}: DatatableCellProps) {
  const classNameData = renderClassStatus(
    'rls-datatable__data',
    { actions, control, truncated },
    className
  );

  return (
    <div id={identifier} className={classNameData}>
      {children}
    </div>
  );
}

export const RlsDatatableData = memo(RlsDatatableDataComponent);

function RlsDatatableFloatingComponent({
  children,
  className,
  identifier,
  invested,
  rlsTheme
}: DatatableFloatingProps) {
  const classNameFloating = renderClassStatus(
    'rls-datatable__floating',
    { invested },
    className
  );

  return (
    <td id={identifier} className={classNameFloating} rls-theme={rlsTheme}>
      {children}
    </td>
  );
}

export const RlsDatatableFloating = memo(RlsDatatableFloatingComponent);
