/**
 * Copyright (c) 2020-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ContextMenu, ExclamationTriangleIcon, clsx } from '@finos/legend-art';
import { observer } from 'mobx-react-lite';
import type { QueryBuilderState } from '../../../stores/QueryBuilderState.js';
import {
  getTDSRowRankByColumnInAsc,
  PRIMITIVE_TYPE,
  TDSExecutionResult,
} from '@finos/legend-graph';
import {
  type DataGridColumnDefinition,
  type DataGridIHeaderParams,
  DataGrid,
} from '@finos/legend-lego/data-grid';
import {
  getRowDataFromExecutionResult,
  QueryBuilderGridResultContextMenu,
  type IQueryRendererParamsWithGridType,
} from './QueryBuilderTDSResultShared.js';
import { QueryBuilderTDSState } from '../../../stores/fetch-structure/tds/QueryBuilderTDSState.js';
import { DEFAULT_LOCALE } from '../../../graph-manager/QueryBuilderConst.js';
import {
  guaranteeNonNullable,
  isBoolean,
  isNumber,
  isString,
  isValidURL,
} from '@finos/legend-shared';
import type {
  QueryBuilderTDSResultCellCoordinate,
  QueryBuilderTDSResultCellData,
  QueryBuilderTDSResultCellDataType,
  QueryBuilderTDSRowDataType,
} from '../../../stores/QueryBuilderResultState.js';
import { QUERY_BUILDER_TEST_ID } from '../../../__lib__/QueryBuilderTesting.js';
import { useRef, useEffect, useState } from 'react';

const CustomHeader: React.FC<DataGridIHeaderParams> = (props) => {
  const {
    displayName,
    enableSorting,
    enableMenu,
    showColumnMenu,
    progressSort,
    column,
  } = props;

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerElement = headerRef.current;

    if (headerElement) {
      // Add your custom icon next to the column header text
      const customIcon = document.createElement('span');
      customIcon.className = 'query-builder__result__stale-status__icon'; // Add your own className
      customIcon.innerHTML =
        '<div className="query-builder__result__stale-status__icon"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg> </div>';

      // Find the header cell label container and append the custom icon
      const labelContainer = headerElement.querySelector(
        '.ag-header-cell-label',
      );
      if (labelContainer) {
        labelContainer.appendChild(customIcon);
      }
    }
  }, []);

  // Handler for sorting click
  const handleSortClick = () => {
    if (enableSorting) {
      progressSort();
    }
  };

  // Manage the sorting state
  const [sortDirection, setSortDirection] = useState<string | null>(null);

  // Effect to sync with the column sort state
  useEffect(() => {
    setSortDirection(column.getColDef().sort || null);
  }, [column]);

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (enableMenu) {
      showColumnMenu(event.currentTarget);
    }
  };

  return (
    <div
      className="ag-header-cell-comp-wrapper"
      role="presentation"
      ref={headerRef}
    >
      <div
        className={`ag-cell-label-container ${
          sortDirection === 'asc'
            ? 'ag-header-cell-sorted-asc'
            : sortDirection === 'desc'
              ? 'ag-header-cell-sorted-desc'
              : 'ag-header-cell-sorted-none'
        }`}
        role="presentation"
      >
        <span
          data-ref="eMenu"
          className="ag-header-icon ag-header-cell-menu-button ag-header-menu-icon ag-header-menu-always-show"
          aria-hidden="true"
          onClick={handleMenuClick}
        >
          <span
            className="ag-icon ag-icon-menu-alt"
            unselectable="on"
            role="presentation"
          ></span>
        </span>
        <div
          data-ref="eLabel"
          className="ag-header-cell-label"
          role="presentation"
        >
          <span
            data-ref="eText"
            className="ag-header-cell-text"
            onClick={handleSortClick}
          >
            {displayName}
          </span>
          <span
            data-ref="eSortIndicator"
            className="ag-sort-indicator-container"
          >
            <span
              data-ref="eSortAsc"
              className={`ag-sort-indicator-icon ag-sort-ascending-icon ${sortDirection === 'asc' ? '' : 'ag-hidden'}`}
              aria-hidden="true"
            >
              <span
                className="ag-icon ag-icon-asc"
                unselectable="on"
                role="presentation"
              ></span>
            </span>
            <span
              data-ref="eSortDesc"
              className={`ag-sort-indicator-icon ag-sort-descending-icon ${sortDirection === 'desc' ? '' : 'ag-hidden'}`}
              aria-hidden="true"
            >
              <span
                className="ag-icon ag-icon-desc"
                unselectable="on"
                role="presentation"
              ></span>
            </span>
          </span>
        </div>
      </div>
    </div>
    // <div classNameName="ag-header-cell" ref={headerRef}>
    //   <div classNameName="ag-header-cell-label">
    //     <span
    //       classNameName="ag-header-cell-text"
    //       onClick={handleSortClick}
    //       style={{ cursor: enableSorting ? 'pointer' : 'default' }}
    //     >
    //       {displayName}
    //     </span>
    //     {enableMenu && (
    //       <div classNameName="ag-header-cell-menu-button" onClick={handleMenuClick}>
    //         <span classNameName="ag-icon ag-icon-menu"></span>
    //       </div>
    //     )}
    //     {/* The built-in sorting icons will be placed here automatically by AG Grid */}
    //   </div>
    // </div>
  );
};

const getTDSColumnCustomizations = (
  result: TDSExecutionResult,
  columnName: string,
): object => {
  const columnType = result.builder.columns.find(
    (col) => col.name === columnName,
  )?.type;
  switch (columnType) {
    case PRIMITIVE_TYPE.FLOAT:
      return {
        headerComponent: 'customHeader',
        headerComponentParams: {
          displayName: columnName,
        },
      };
    default:
      return {};
  }
};

const QueryResultCellRenderer = observer(
  (params: IQueryRendererParamsWithGridType) => {
    const resultState = params.resultState;
    const tdsExecutionResult = params.tdsExecutionResult;
    const fetchStructureImplementation =
      resultState.queryBuilderState.fetchStructureState.implementation;
    const applicationStore = resultState.queryBuilderState.applicationStore;
    const cellValue = params.value as QueryBuilderTDSResultCellDataType;
    const nodeRowIndex = guaranteeNonNullable(params.node.rowIndex);
    const darkMode =
      !applicationStore.layoutService.TEMPORARY__isLightColorThemeEnabled;

    const formattedCellValue = (): QueryBuilderTDSResultCellDataType => {
      if (isNumber(cellValue)) {
        return Intl.NumberFormat(DEFAULT_LOCALE, {
          maximumFractionDigits: 4,
        }).format(Number(cellValue));
      } else if (isBoolean(cellValue)) {
        return String(cellValue);
      }
      return cellValue;
    };
    const cellValueUrlLink =
      isString(cellValue) && isValidURL(cellValue) ? cellValue : undefined;
    const columnName = params.column?.getColId() ?? '';
    const findCoordinatesFromResultValue = (
      colId: string,
      rowNumber: number,
    ): QueryBuilderTDSResultCellCoordinate => {
      const colIndex = tdsExecutionResult.result.columns.findIndex(
        (col) => col === colId,
      );
      return { rowIndex: rowNumber, colIndex: colIndex };
    };

    const currentCellCoordinates = findCoordinatesFromResultValue(
      columnName,
      nodeRowIndex,
    );
    const cellInFilteredResults = resultState.selectedCells.some(
      (result) =>
        result.coordinates.colIndex === currentCellCoordinates.colIndex &&
        result.coordinates.rowIndex === currentCellCoordinates.rowIndex,
    );

    const findColumnFromCoordinates = (
      colIndex: number,
    ): QueryBuilderTDSResultCellDataType => {
      if (
        !resultState.executionResult ||
        !(resultState.executionResult instanceof TDSExecutionResult)
      ) {
        return undefined;
      }
      return resultState.executionResult.result.columns[colIndex];
    };

    const findResultValueFromCoordinates = (
      resultCoordinate: [number, number],
    ): QueryBuilderTDSResultCellDataType => {
      const rowIndex = resultCoordinate[0];
      const colIndex = resultCoordinate[1];

      if (
        !resultState.executionResult ||
        !(resultState.executionResult instanceof TDSExecutionResult)
      ) {
        return undefined;
      }
      if (params.api.getColumnState()[colIndex]?.sort === 'asc') {
        resultState.executionResult.result.rows.sort((a, b) =>
          getTDSRowRankByColumnInAsc(a, b, colIndex),
        );
      } else if (params.api.getColumnState()[colIndex]?.sort === 'desc') {
        resultState.executionResult.result.rows.sort((a, b) =>
          getTDSRowRankByColumnInAsc(b, a, colIndex),
        );
      }
      return resultState.executionResult.result.rows[rowIndex]?.values[
        colIndex
      ];
    };

    const isCoordinatesSelected = (
      resultCoordinate: QueryBuilderTDSResultCellCoordinate,
    ): boolean =>
      resultState.selectedCells.some(
        (cell) =>
          cell.coordinates.rowIndex === resultCoordinate.rowIndex &&
          cell.coordinates.colIndex === resultCoordinate.colIndex,
      );

    const mouseDown: React.MouseEventHandler = (event) => {
      event.preventDefault();

      if (event.shiftKey) {
        const coordinates = findCoordinatesFromResultValue(
          columnName,
          nodeRowIndex,
        );
        const actualValue = findResultValueFromCoordinates([
          coordinates.rowIndex,
          coordinates.colIndex,
        ]);
        resultState.addSelectedCell({
          value: actualValue,
          columnName: columnName,
          coordinates: coordinates,
        });
        return;
      }

      if (event.button === 0) {
        resultState.setIsSelectingCells(true);
        resultState.setSelectedCells([]);
        const coordinates = findCoordinatesFromResultValue(
          columnName,
          nodeRowIndex,
        );
        const actualValue = findResultValueFromCoordinates([
          coordinates.rowIndex,
          coordinates.colIndex,
        ]);
        resultState.setSelectedCells([
          {
            value: actualValue,
            columnName: columnName,
            coordinates: coordinates,
          },
        ]);
        resultState.setMouseOverCell(resultState.selectedCells[0] ?? null);
      }

      if (event.button === 2) {
        const coordinates = findCoordinatesFromResultValue(
          columnName,
          nodeRowIndex,
        );
        const isInSelected = isCoordinatesSelected(coordinates);
        if (!isInSelected) {
          const actualValue = findResultValueFromCoordinates([
            coordinates.rowIndex,
            coordinates.colIndex,
          ]);
          resultState.setSelectedCells([
            {
              value: actualValue,
              columnName: columnName,
              coordinates: coordinates,
            },
          ]);
          resultState.setMouseOverCell(resultState.selectedCells[0] ?? null);
        }
      }
    };

    const mouseUp: React.MouseEventHandler = (event) => {
      resultState.setIsSelectingCells(false);
    };

    const mouseOver: React.MouseEventHandler = (event) => {
      if (resultState.isSelectingCells) {
        if (resultState.selectedCells.length < 1) {
          return;
        }
        const results = resultState.selectedCells[0];
        if (!results) {
          return;
        }

        const firstCorner = results.coordinates;
        const secondCorner = findCoordinatesFromResultValue(
          columnName,
          nodeRowIndex,
        );

        resultState.setSelectedCells([results]);

        const minRow = Math.min(firstCorner.rowIndex, secondCorner.rowIndex);
        const minCol = Math.min(firstCorner.colIndex, secondCorner.colIndex);
        const maxRow = Math.max(firstCorner.rowIndex, secondCorner.rowIndex);
        const maxCol = Math.max(firstCorner.colIndex, secondCorner.colIndex);

        for (let x = minRow; x <= maxRow; x++) {
          for (let y = minCol; y <= maxCol; y++) {
            const actualValue = findResultValueFromCoordinates([x, y]);

            const valueAndColumnId = {
              value: actualValue,
              columnName: findColumnFromCoordinates(y),
              coordinates: {
                rowIndex: x,
                colIndex: y,
              },
            } as QueryBuilderTDSResultCellData;

            if (
              !resultState.selectedCells.find(
                (result) =>
                  result.coordinates.colIndex === y &&
                  result.coordinates.rowIndex === x,
              )
            ) {
              resultState.addSelectedCell(valueAndColumnId);
            }
          }
        }
      }

      resultState.setMouseOverCell(resultState.selectedCells[0] ?? null);
    };
    const getContextMenuRenderer = (): React.ReactNode => {
      if (fetchStructureImplementation instanceof QueryBuilderTDSState) {
        const copyCellValue = applicationStore.guardUnhandledError(() =>
          applicationStore.clipboardService.copyTextToClipboard(
            fetchStructureImplementation.queryBuilderState.resultState.selectedCells
              .map((cellData) => cellData.value)
              .join(','),
          ),
        );
        const findRowFromRowIndex = (rowIndex: number): string => {
          if (
            !fetchStructureImplementation.queryBuilderState.resultState
              .executionResult ||
            !(
              fetchStructureImplementation.queryBuilderState.resultState
                .executionResult instanceof TDSExecutionResult
            )
          ) {
            return '';
          }
          // try to get the entire row value separated by comma
          // rowData is in format of {columnName: value, columnName1: value, ...., rowNumber:value}
          const valueArr: QueryBuilderTDSResultCellDataType[] = [];
          Object.entries(
            params.api.getRenderedNodes().find((n) => n.rowIndex === rowIndex)
              ?.data as QueryBuilderTDSRowDataType,
          ).forEach((entry) => {
            if (entry[0] !== 'rowNumber') {
              valueArr.push(entry[1]);
            }
          });
          return valueArr.join(',');
        };
        const copyRowValue = applicationStore.guardUnhandledError(() =>
          applicationStore.clipboardService.copyTextToClipboard(
            findRowFromRowIndex(
              fetchStructureImplementation.queryBuilderState.resultState
                .selectedCells[0]?.coordinates.rowIndex ?? 0,
            ),
          ),
        );
        return (
          <QueryBuilderGridResultContextMenu
            data={resultState.mousedOverCell}
            tdsState={fetchStructureImplementation}
            copyCellValueFunc={copyCellValue}
            copyCellRowValueFunc={copyRowValue}
          />
        );
      }
      return null;
    };

    return (
      <ContextMenu
        content={getContextMenuRenderer()}
        disabled={
          !(
            resultState.queryBuilderState.fetchStructureState
              .implementation instanceof QueryBuilderTDSState
          ) ||
          !resultState.queryBuilderState.isQuerySupported ||
          !resultState.mousedOverCell
        }
        menuProps={{ elevation: 7 }}
        className={clsx('query-builder__result__tds-grid', {
          'ag-theme-balham': !darkMode,
          'ag-theme-balham-dark': darkMode,
        })}
      >
        <div
          className={clsx('query-builder__result__values__table__cell', {
            'query-builder__result__values__table__cell--active':
              cellInFilteredResults,
          })}
          onMouseDown={(event) => mouseDown(event)}
          onMouseUp={(event) => mouseUp(event)}
          onMouseOver={(event) => mouseOver(event)}
        >
          {cellValueUrlLink ? (
            <a href={cellValueUrlLink} target="_blank" rel="noreferrer">
              {cellValueUrlLink}
            </a>
          ) : (
            <span>{formattedCellValue()}</span>
          )}
        </div>
      </ContextMenu>
    );
  },
);

export const QueryBuilderTDSSimpleGridResult = observer(
  (props: {
    executionResult: TDSExecutionResult;
    queryBuilderState: QueryBuilderState;
  }) => {
    const { executionResult, queryBuilderState } = props;
    const resultState = queryBuilderState.resultState;
    const darkMode =
      !queryBuilderState.applicationStore.layoutService
        .TEMPORARY__isLightColorThemeEnabled;
    const colDefs = executionResult.result.columns.map(
      (colName) =>
        ({
          minWidth: 50,
          sortable: true,
          resizable: true,
          field: colName,
          flex: 1,
          ...getTDSColumnCustomizations(executionResult, colName),
          cellRenderer: QueryResultCellRenderer,
          cellRendererParams: {
            resultState: resultState,
            tdsExecutionResult: executionResult,
          },
        }) as DataGridColumnDefinition,
    );

    return (
      <div
        data-testid={QUERY_BUILDER_TEST_ID.QUERY_BUILDER_RESULT_VALUES_TDS}
        className="query-builder__result__values__table"
      >
        <div
          className={clsx('query-builder__result__tds-grid', {
            'ag-theme-balham': !darkMode,
            'ag-theme-balham-dark': darkMode,
          })}
        >
          <DataGrid
            rowData={getRowDataFromExecutionResult(executionResult)}
            gridOptions={{
              suppressScrollOnNewData: true,
              getRowId: (data) => data.data.rowNumber,
              rowSelection: 'multiple',
            }}
            // NOTE: when column definition changed, we need to force refresh the cell to make sure the cell renderer is updated
            // See https://stackoverflow.com/questions/56341073/how-to-refresh-an-ag-grid-when-a-change-occurs-inside-a-custom-cell-renderer-com
            onRowDataUpdated={(params) => {
              params.api.refreshCells({ force: true });
            }}
            suppressFieldDotNotation={true}
            suppressContextMenu={false}
            columnDefs={colDefs}
            components={{
              customHeader: CustomHeader,
            }}
          />
        </div>
      </div>
    );
  },
);
