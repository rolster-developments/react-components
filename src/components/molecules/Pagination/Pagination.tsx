import {
  FilterCriteria,
  PageState,
  Pagination,
  PaginationController,
  PaginationTemplate
} from '@rolster/components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsIcon } from '../../atoms/Icon/Icon';
import './Pagination.css';

interface PaginationEvent<T> {
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

export function RlsPagination<T>({
  suggestions,
  count,
  filter,
  onPagination
}: PaginationProps<T>) {
  const controller = useRef(new PaginationController({ suggestions, count }));
  const [template, setTemplate] = useState(controller.current.template);

  const refreshTemplate = useCallback(
    (template: PaginationTemplate, suggestions: T[]) => {
      const { firstPage, lastPage } = template;

      onPagination && onPagination({ firstPage, lastPage, suggestions });

      setTemplate(template);
    },
    [onPagination]
  );

  useEffect(() => {
    controller.current = new PaginationController({
      suggestions,
      count,
      position: template.currentPage.value
    });

    refreshTemplate(
      controller.current.template,
      controller.current.page.collection
    );
  }, [suggestions, count]);

  useEffect(() => {
    refreshPagination(controller.current.filtrable(filter));
  }, [filter]);

  const refreshPagination = useCallback((pagination?: Pagination<T>) => {
    if (pagination) {
      refreshTemplate(pagination.template, pagination.page.collection);
    }
  }, []);

  const goToPagination = useCallback((page: PageState) => {
    refreshPagination(controller.current.goToPage(page));
  }, []);

  const goFirstPagination = useCallback(() => {
    refreshPagination(controller.current.goFirstPage());
  }, []);

  const goPreviousPagination = useCallback(() => {
    refreshPagination(controller.current.goPreviousPage());
  }, []);

  const goNextPagination = useCallback(() => {
    refreshPagination(controller.current.goNextPage());
  }, []);

  const goLastPagination = useCallback(() => {
    refreshPagination(controller.current.goLastPage());
  }, []);

  return (
    <div className="rls-pagination">
      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goFirstPagination}
          disabled={template.firstPage}
        >
          <RlsIcon value="arrowhead-left" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goPreviousPagination}
          disabled={template.firstPage}
        >
          <RlsIcon value="arrow-ios-left" />
        </button>
      </div>

      <div className="rls-pagination__pages">
        {template.pages.map((page, index) => {
          return (
            <div
              key={index}
              className={renderClassStatus('rls-pagination__page', {
                active: page.active
              })}
              onClick={() => {
                goToPagination(page);
              }}
            >
              {page.label}
            </div>
          );
        })}
      </div>

      <div className="rls-pagination__description">{template.description}</div>

      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goNextPagination}
          disabled={template.lastPage}
        >
          <RlsIcon value="arrow-ios-right" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goLastPagination}
          disabled={template.lastPage}
        >
          <RlsIcon value="arrowhead-right" />
        </button>
      </div>
    </div>
  );
}
