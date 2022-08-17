import React, { useState } from 'react';
import { Table as ReactBootstrapTable } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { MetaData } from '../../models';
import Icon from '../icon';
import { formatStr } from './formats';
import Pagination from './pagination';

export interface TableSpec {
  id: string;
  name?: string;

  format?(val: any): JSX.Element | string;

  getValue?(row: any): any;

  getFooterValue?(): any;

}

export interface ActionSpec {
  id: string;
  icon?: string;
  onClick?(row: any): void;
  showAction?(row: any): boolean;
  renderAction?(row: any): JSX.Element;
}

export interface TableProps {
  name: string;
  specs: TableSpec[];
  data: Record<string, any>[];
  metadata: MetaData<any>;
  className?: string;
  emptyMessage?: string;
  disableSorting?: string[];
  editIcon?: string;
  deleteIcon?: string;
  extraActions?: ActionSpec[];
  actionIconsClass?: string;
  showFooter?: boolean;

  renderColumn?(column: string): boolean;

  updateFilter?(param: Partial<MetaData<any>>): void;

  canDelete?(param: any): boolean;

  onDelete?(param: any): void;

  getId?(param: Record<string, any>): any;

  canEdit?(param: any): boolean;

  onEditClick?(url: string, param: any): void;

  getEditUrl?(param: any): string;

  openInNextPage?: boolean;
  pageSize?: number;
  onSelectedPageNumber?(param: any):void
  selectedPage?:string|number;

}
export interface Required {
  name: string;
  specs: TableSpec[];
  data: Record<string, any>[];
  metadata: MetaData<any>;

}
export interface Optional{
  className?: string;
  emptyMessage?: string;
  disableSorting?: string[];
  editIcon?: string;
  deleteIcon?: string;
  extraActions?: ActionSpec[];
  actionIconsClass?: string;
  showFooter?: boolean;

  renderColumn?(column: string): boolean;

  updateFilter?(param: Partial<MetaData<any>>): void;

  canDelete?(param: any): boolean;

  onDelete?(param: any): void;

  getId?(param: Record<string, any>): any;

  canEdit?(param: any): boolean;

  onEditClick?(url: string, param: any): void;

  getEditUrl?(param: any): string;

  openInNextPage?: boolean;
  pageSize?: number;
  onSelectedPageNumber?(param: any):void
  selectedPage?:string|number;
}

interface Props
  extends Required,
  Optional {

  }

const defaultProps: Optional = {
  className: undefined,
  emptyMessage: undefined,
  disableSorting: undefined,
  editIcon: undefined,
  deleteIcon: undefined,
  extraActions: undefined,
  actionIconsClass: undefined,
  showFooter: undefined,

  renderColumn: undefined,

  updateFilter: undefined,

  canDelete: undefined,

  onDelete: undefined,

  getId: undefined,

  canEdit: undefined,

  onEditClick: undefined,

  getEditUrl: undefined,

  openInNextPage: undefined,
  pageSize: undefined,
  onSelectedPageNumber: undefined,
  selectedPage: undefined,
};
export const formatAmount = (value?: (number | string)) => {
  if (value === null || value === undefined) return '';

  return `$${formatNumber(value)}`;
};

export const formatNumber = (value?: (number | string)) => {
  if (value === null || value === undefined) return '';

  return value === 0 ? '0' : value.toLocaleString();
};

const Table: React.FC<TableProps> = ({
  data, specs, metadata, name, disableSorting, className, emptyMessage,
  editIcon, extraActions, actionIconsClass, showFooter, updateFilter, renderColumn,
  canEdit, onDelete, getEditUrl, onEditClick, getId, openInNextPage, onSelectedPageNumber, pageSize,
}) => {
  const reduxDispatch = useDispatch();
  const shouldRenderColumn = (column: string): boolean => !renderColumn || renderColumn(column);

  const [currentPage, setCurrentPage] = useState(metadata?.page);

  const hasActions = () => (!!onDelete || !!getEditUrl
    || !!(extraActions && extraActions?.length > 0));

  const getRowId = (row: Record<string, any>) => (getId ? getId(row) : row.id);

  const titles = () => {
    const updatePagination = updateFilter || (() => undefined);

    const clickTitle = (spec: TableSpec) => {
      if (metadata && (!disableSorting || !disableSorting.includes(spec.id))) {
        const toggleOrder = metadata.order === spec.id;
        const newDirection = toggleOrder && metadata.direction === 'asc' ? 'desc' : 'asc';
        updatePagination({
          order: spec.id,
          direction: newDirection,
        });
      }
    };

    return specs.filter((spec) => shouldRenderColumn(spec.id)).map(
      (spec) => {
        const canSort = !disableSorting || !disableSorting.includes(spec.id);
        return (
          <th
            key={spec.name || `_id_${spec.id}`}
            onClick={() => clickTitle(spec)}
            className={canSort ? 'cursor--pointer' : ''}
          >
            {spec.name ? <FormattedMessage id={spec.name} /> : ''}
            {(metadata && canSort) && (
              <Icon
                name="arrow-fill"
                className={`
                sort-icon 
                ${metadata?.direction === 'asc' ? 'sort-icon--down' : ''}
                ${metadata?.order !== spec.id ? 'invisible' : ''}
            `}
              />
            )}
          </th>
        );
      },
    ).concat(hasActions() ? [
      <th key="tableActions" style={{ width: '145px' }}>&nbsp;</th>,
    ] : []);
  };

  const footer = () => specs.filter((spec) => shouldRenderColumn(spec.id)).map(
    (spec) => {
      const formatter = (param: any) => (spec.format
        ? spec.format(param) : formatStr(param));
      return (
        <td
          key={spec.name || `_id_${spec.id}`}
        >
          {spec.getFooterValue ? formatter(spec.getFooterValue()) : ''}

        </td>
      );
    },
  ).concat(hasActions() ? [
    <td key="tableActions" style={{ width: '145px' }}>&nbsp;</td>,
  ] : []);

  const fields = () => {
    let immutableData = [...data];
    specs.forEach((spec) => {
      if (spec.getValue) {
        immutableData = immutableData.map(
          (row: Record<string, any>) => ({
            ...row,
            [spec.id]: (spec.getValue && spec.getValue(row)),
          }),
        );
      }
    });
    Object.freeze(immutableData);
    const getEditUrlRow = getEditUrl || (() => '/');
    const canEditRow = canEdit || (() => true);

    return immutableData.map((row: Record<string, any>) => (
      <tr className="table-row" key={getRowId(row)}>
        {
          specs.filter((spec) => shouldRenderColumn(spec.id)).map(
            (field) => {
              const formatter = (param: any) => (field.format
                ? field.format(param) : formatStr(param));
              return (
                <td key={`${field.name}@${field.id}`}>
                  {formatter(row[field.id])}
                </td>
              );
            },
          )
        }
        {hasActions() && (
          <td
            key="actionButtons"
            className="table-action-buttons"
          >
            <div className={`o-icon ${actionIconsClass ?? ''}`}>
              {!!getEditUrl && canEditRow(row) && (
                <a
                  href={`/#${getEditUrlRow(row)}`}
                  target={openInNextPage ? '_blank' : '_self'}
                  onClick={(e) => {
                    if (!openInNextPage) {
                      e.preventDefault();
                      const url = getEditUrlRow(row);
                      if (onEditClick) {
                        onEditClick(url, row);
                      } else {
                        reduxDispatch(push(url));
                      }
                    }
                  }}
                  rel="noreferrer"
                >
                  <Icon
                    name={editIcon ?? 'edit-icon'}
                  />
                </a>
              )}
              {extraActions && extraActions.map((extraAction: ActionSpec) => {
                const showAction = extraAction.showAction || (() => true);
                return (
                  <React.Fragment key={`extra_action_${extraAction.id}`}>
                    {showAction(row) && (
                    <div>
                        {extraAction.renderAction
                          ? extraAction.renderAction(row)
                          : (
                            <div>
                              {extraAction.icon && (
                              <Icon
                                key={extraAction.id}
                                name={extraAction.icon}
                                onClick={() => {
                                  if (extraAction.onClick) {
                                    extraAction.onClick(row);
                                  }
                                }}
                              />
                              )}
                            </div>

                          )}
                    </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </td>
        )}
      </tr>
    ));
  };

  const noResultsRow = () => {
    const colSpan = (specs.filter((spec) => shouldRenderColumn(spec.id)).length
      + (hasActions() ? 1 : 0));
    return (
      data.length === 0 ? (
        <tr
          key="noResultsRow"
          className="table-row"
          style={{ textAlign: 'center' }}
        >
          <td colSpan={colSpan}>
            <FormattedMessage id={emptyMessage || 'general.noResults'} />
          </td>
        </tr>
      ) : null
    );
  };
  return (
    <div
      key={`${name}_table`}
      className={`c-table ${className ?? ''}`}
    >
      <ReactBootstrapTable responsive>
        <thead>
          <tr>{titles()}</tr>
        </thead>
        <tbody key="tableBody">
          {[fields(), noResultsRow()]}
        </tbody>
        {showFooter && (
          <tfoot>
            <tr>{footer()}</tr>
          </tfoot>
        )}
      </ReactBootstrapTable>
      {(metadata && metadata?.total > data.length) && (
        <div>
          <Pagination
            className="c-pagination"
            currentPage={currentPage}
            totalCount={metadata?.total}
            pageSize={pageSize}
            onPageChange={(page) => {
              if (onSelectedPageNumber) {
                onSelectedPageNumber(page);
              }
              setCurrentPage(page);
            }}
          />
        </div>

      )}

    </div>
  );
};
Table.defaultProps = defaultProps;
export default React.memo(Table);
