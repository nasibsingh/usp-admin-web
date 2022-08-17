import React from 'react';
import { usePagination, DOTS } from './usePagination';
import Icon from '../icon';

interface Props{
  onPageChange:(page:any)=>void;
  totalCount:string|number;
  siblingCount?:any;
  currentPage:number;
  pageSize:any;
  className:string;
}

const Pagination: React.FC<Props> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  let paged;
  if (paginationRange) {
    paged = paginationRange;
  }
  if (currentPage === 0 || paged?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paged[paged.length - 1];
  return (
    <ul
      className={`c-pagination ${className || ''}`}
    >
      <li
        className={`c-pagination__pagination-item  ${currentPage === 1 ? 'c-pagination--disabled' : ''}`}
        onClick={onPrevious}
        onKeyDown={onPrevious}
        role="presentation"
      >
        {currentPage === 1 ? <Icon name="disabledbackword" /> : <Icon name="backword" />}
      </li>
      {paged.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <li className="c-pagination__pagination-item dots">&#8230;</li>;
        }
        return (
          <li
            className={`c-pagination__pagination-item ${pageNumber === currentPage ? 'c-pagination--active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
            role="presentation"
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`c-pagination__pagination-item ${currentPage === lastPage ? 'c-pagination--disabled' : ''}`}
        onClick={onNext}
        onKeyPress={onNext}
        role="presentation"
      >
        {currentPage === lastPage ? <Icon name="forworddisabled" /> : <Icon name="forword" />}
      </li>
    </ul>
  );
};

export default Pagination;
