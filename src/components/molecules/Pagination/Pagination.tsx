import {
  FilterCriteria,
  PageState,
  Pagination,
  PaginationController,
  PaginationTemplate
} from '@rolster/components';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';

export interface PaginationEvent<T> {
  firstPage: boolean;
  lastPage: boolean;
  suggestions: T[];
}

interface PaginationProps<T> {
  suggestions: T[];
  count?: number;
  filter?: FilterCriteria<T>;
  onPagination?: (event: PaginationEvent<T>) => void;
}

interface PageButtonProps {
  onSelect: (page: PageState) => void;
  page: PageState;
}

function PageButton({ page, onSelect }: PageButtonProps) {
  const className = useMemo(
    () => renderClassStatus('rls-pagination__page', { active: page.active }),
    [page.active]
  );

  const onClick = useCallback(() => {
    onSelect(page);
  }, [page, onSelect]);

  return (
    <button type="button" className={className} onClick={onClick}>
      {page.label}
    </button>
  );
}

export function RlsPagination<T>({
  suggestions,
  count,
  filter,
  onPagination
}: PaginationProps<T>) {
  const [template, setTemplate] = useState<PaginationTemplate>();
  const controller = useRef<PaginationController>(undefined);

  const refreshTemplate = useCallback(
    (template: PaginationTemplate, suggestions: T[]) => {
      const { firstPage, lastPage } = template;

      onPagination?.({ firstPage, lastPage, suggestions });

      setTemplate(template);
    },
    [onPagination]
  );

  const refreshPagination = useCallback(
    (pagination?: Pagination<T>) => {
      pagination &&
        refreshTemplate(pagination.template, pagination.page.collection);
    },
    [refreshTemplate]
  );

  useEffect(() => {
    const pagination = new PaginationController({
      suggestions,
      count,
      position: template?.currentPage.value
    });

    controller.current = pagination;

    refreshTemplate(pagination.template, pagination.page.collection);
  }, [suggestions, count, refreshTemplate]);

  useEffect(() => {
    refreshPagination(controller.current?.filtrable(filter));
  }, [filter, refreshPagination]);

  const goToPagination = useCallback(
    (page: PageState) => {
      refreshPagination(controller.current?.goToPage(page));
    },
    [refreshPagination]
  );

  const goFirstPagination = useCallback(() => {
    refreshPagination(controller.current?.goFirstPage());
  }, [refreshPagination]);

  const goPreviousPagination = useCallback(() => {
    refreshPagination(controller.current?.goPreviousPage());
  }, [refreshPagination]);

  const goNextPagination = useCallback(() => {
    refreshPagination(controller.current?.goNextPage());
  }, [refreshPagination]);

  const goLastPagination = useCallback(() => {
    refreshPagination(controller.current?.goLastPage());
  }, [refreshPagination]);

  return (
    <div className="rls-pagination">
      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goFirstPagination}
          disabled={template?.firstPage}
        >
          <RlsIcon value="arrowhead-left" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goPreviousPagination}
          disabled={template?.firstPage}
        >
          <RlsIcon value="arrow-ios-left" />
        </button>
      </div>

      <div className="rls-pagination__body">
        <div className="rls-pagination__pages">
          {template?.pages.map((page) => (
            <PageButton
              key={page.value}
              page={page}
              onSelect={goToPagination}
            />
          ))}
        </div>

        <div className="rls-pagination__description">
          {template?.description}
        </div>

        <span className="rls-pagination__count">{suggestions.length}</span>
      </div>

      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goNextPagination}
          disabled={template?.lastPage}
        >
          <RlsIcon value="arrow-ios-right" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goLastPagination}
          disabled={template?.lastPage}
        >
          <RlsIcon value="arrowhead-right" />
        </button>
      </div>
    </div>
  );
}
