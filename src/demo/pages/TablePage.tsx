import { useCallback, useState } from 'react';
import {
  PaginationEvent,
  RlsBallot,
  RlsButton,
  RlsButtonAction,
  RlsButtonIcon,
  RlsChip,
  RlsDatatable,
  RlsDatatableCell,
  RlsDatatableFloating,
  RlsDatatableHeader,
  RlsDatatableRecord,
  RlsDatatableTitle,
  RlsPagination
} from '../../index';
import { BudgetCard } from '../components/BudgetCard/BudgetCard';
import { BUDGETS, Employee, EMPLOYEES } from '../data/employees';
import {
  employeeInitials,
  employeeStatusLabel,
  employeeStatusTheme
} from '../helpers/employee';

import './TablePage.scss';

const PAGE_SIZE = 5;

export function TablePage() {
  const [page, setPage] = useState<Employee[]>(() =>
    EMPLOYEES.slice(0, PAGE_SIZE)
  );

  const onPagination = useCallback(
    ({ suggestions }: PaginationEvent<Employee>) => {
      setPage(suggestions);
    },
    []
  );

  return (
    <section className="table-page">
      <div className="table-page__toolbar">
        <RlsBallot
          subtitle={
            <span className="rls-caption-font">
              {EMPLOYEES.length} results found
            </span>
          }
        >
          <span className="rls-subtitle-font">Employees</span>
        </RlsBallot>

        <div className="table-page__toolbar__actions">
          <RlsButtonAction icon="options" type="ghost" tooltip="Filtros" />

          <RlsButton type="ghost" prefixIcon="swap">
            Sort: Chronological
          </RlsButton>

          <div className="table-page__pager">
            <RlsButtonIcon icon="chevron-left" />

            <span className="rls-label-font">August, 2021</span>

            <RlsButtonIcon icon="chevron-right" />
          </div>
        </div>
      </div>

      <div className="rls-flex-xs-grid-16 rls-flex-xs-grid-col-4">
        {BUDGETS.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      <RlsDatatable
        header={
          <RlsDatatableHeader>
            <RlsDatatableTitle className="rls-width-xs-30">
              <span>NAME</span>
            </RlsDatatableTitle>
            <RlsDatatableTitle className="rls-width-xs-35">
              <span>EMAIL</span>
            </RlsDatatableTitle>
            <RlsDatatableTitle className="rls-width-xs-15">
              <span>STATUS</span>
            </RlsDatatableTitle>
            <RlsDatatableTitle className="rls-width-xs-20">
              <span>ROLE</span>
            </RlsDatatableTitle>
          </RlsDatatableHeader>
        }
        footer={
          <RlsPagination
            suggestions={EMPLOYEES}
            count={PAGE_SIZE}
            onPagination={onPagination}
          />
        }
      >
        {page.map(({ email, id, name, role, status }) => (
          <RlsDatatableRecord key={id} truncated={true}>
            <RlsDatatableCell className="rls-width-xs-30">
              <RlsBallot initials={employeeInitials(name)}>
                <p className="rls-truncate">{name}</p>
              </RlsBallot>
            </RlsDatatableCell>

            <RlsDatatableCell className="rls-width-xs-35">
              <p className="rls-truncate">{email}</p>
            </RlsDatatableCell>

            <RlsDatatableCell className="rls-width-xs-15">
              <RlsChip rlsTheme={employeeStatusTheme(status)}>
                {employeeStatusLabel(status)}
              </RlsChip>
            </RlsDatatableCell>

            <RlsDatatableCell className="rls-width-xs-20">
              <p className="rls-truncate">{role}</p>
            </RlsDatatableCell>

            <RlsDatatableFloating>
              <RlsButtonAction icon="edit" tooltip="Editar" />
              <RlsButtonAction icon="trash" tooltip="Eliminar" />
            </RlsDatatableFloating>
          </RlsDatatableRecord>
        ))}
      </RlsDatatable>
    </section>
  );
}
