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

import { useApplicationStore } from '@finos/legend-application';
import {
  CODE_EDITOR_LANGUAGE,
  CodeEditor,
} from '@finos/legend-lego/code-editor';
import {
  Dialog,
  Modal,
  ModalTitle,
  clsx,
  SearchIcon,
  TimesIcon,
  DropdownMenu,
  MenuContent,
  MenuContentItem,
  BlankPanelContent,
  PanelLoadingIndicator,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalFooterButton,
  UserIcon,
  LastModifiedIcon,
  MoreVerticalIcon,
  ThinChevronRightIcon,
  InfoCircleIcon,
  BaseTablePagination,
} from '@finos/legend-art';
import { LightQuery, type RawLambda } from '@finos/legend-graph';
import {
  debounce,
  formatDistanceToNow,
  guaranteeNonNullable,
  isNonNullable,
  quantifyList,
  type PlainObject,
} from '@finos/legend-shared';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef, useState, useMemo, useEffect } from 'react';
import {
  QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT,
  type QueryLoaderState,
} from '../stores/QueryLoaderState.js';
import type { CuratedTemplateQuery } from '../stores/QueryBuilder_LegendApplicationPlugin_Extension.js';
import {
  DataGrid,
  type DataGridColumnDefinition,
} from '@finos/legend-lego/data-grid';

const QueryPreviewViewer = observer(
  (props: { queryLoaderState: QueryLoaderState }) => {
    const { queryLoaderState } = props;
    const applicationStore = queryLoaderState.applicationStore;
    const close = (): void => {
      queryLoaderState.setShowPreviewViewer(false);
    };
    return (
      <Dialog
        open={queryLoaderState.showPreviewViewer}
        onClose={close}
        classes={{
          root: 'editor-modal__root-container',
          container: 'editor-modal__container',
          paper: 'editor-modal__content',
        }}
      >
        <Modal
          className="editor-modal"
          darkMode={
            !applicationStore.layoutService.TEMPORARY__isLightColorThemeEnabled
          }
        >
          <ModalHeader
            title={
              guaranteeNonNullable(queryLoaderState.queryPreviewContent).name
            }
          />
          <ModalBody>
            <CodeEditor
              inputValue={
                guaranteeNonNullable(queryLoaderState.queryPreviewContent)
                  .content
              }
              isReadOnly={true}
              language={CODE_EDITOR_LANGUAGE.PURE}
            />
          </ModalBody>
          <ModalFooter>
            <ModalFooterButton onClick={close} text="Close" type="secondary" />
          </ModalFooter>
        </Modal>
      </Dialog>
    );
  },
);

export const QueryLoader = observer(
  (props: { queryLoaderState: QueryLoaderState; loadActionLabel: string }) => {
    const { queryLoaderState, loadActionLabel } = props;
    const applicationStore = useApplicationStore();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const queryRenameInputRef = useRef<HTMLInputElement>(null);
    const results = queryLoaderState.queries;
    const curatedTemplateQueries =
      queryLoaderState.curatedTemplateQuerySepcifications
        .map((s) =>
          queryLoaderState.queryBuilderState
            ? s.getCuratedTemplateQueries(queryLoaderState.queryBuilderState)
            : [],
        )
        .flat();
    const loadCuratedTemplateQuery =
      queryLoaderState.curatedTemplateQuerySepcifications
        // already using an arrow function suggested by @typescript-eslint/unbound-method
        // eslint-disable-next-line
        .map((s) => () => s.loadCuratedTemplateQuery)
        .filter(isNonNullable)[0];

    const [isMineOnly, setIsMineOnly] = useState(false);
    const [showQueryNameEditInput, setShowQueryNameEditInput] = useState<
      number | undefined
    >();
    useEffect(() => {
      queryRenameInputRef.current?.focus();
      queryRenameInputRef.current?.select();
    }, [showQueryNameEditInput]);
    const [queryNameInputValue, setQueryNameInputValue] = useState<string>('');
    const showEditQueryNameInput =
      (value: string, idx: number): (() => void) =>
      (): void => {
        setQueryNameInputValue(value);
        setShowQueryNameEditInput(idx);
      };
    const hideEditQueryNameInput = (): void => {
      setShowQueryNameEditInput(undefined);
      setQueryNameInputValue('');
    };
    const changeQueryNameInputValue: React.ChangeEventHandler<
      HTMLInputElement
    > = (event) => setQueryNameInputValue(event.target.value);

    // search text
    const debouncedLoadQueries = useMemo(
      () =>
        debounce((input: string): void => {
          flowResult(queryLoaderState.searchQueries(input)).catch(
            applicationStore.alertUnhandledError,
          );
        }, 500),
      [applicationStore.alertUnhandledError, queryLoaderState],
    );
    const onSearchTextChange: React.ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      if (event.target.value !== queryLoaderState.searchText) {
        queryLoaderState.setSearchText(event.target.value);
        debouncedLoadQueries.cancel();
        debouncedLoadQueries(event.target.value);
      }
    };
    const clearQuerySearching = (): void => {
      queryLoaderState.setSearchText('');
      debouncedLoadQueries.cancel();
      debouncedLoadQueries('');
    };
    const toggleShowCurrentUserQueriesOnly = (): void => {
      queryLoaderState.setShowCurrentUserQueriesOnly(
        !queryLoaderState.showCurrentUserQueriesOnly,
      );
      setIsMineOnly(!isMineOnly);
      debouncedLoadQueries.cancel();
      debouncedLoadQueries(queryLoaderState.searchText);
    };
    const toggleExtraFilters = (key: string): void => {
      queryLoaderState.extraFilters.set(
        key,
        !queryLoaderState.extraFilters.get(key),
      );
      debouncedLoadQueries.cancel();
      debouncedLoadQueries(queryLoaderState.searchText);
    };
    const toggleCuratedTemplate = (): void => {
      Array.from(queryLoaderState.extraFilters).map(([key, value]) =>
        queryLoaderState.extraFilters.set(key, false),
      );
      queryLoaderState.setShowCurrentUserQueriesOnly(false);
      setIsMineOnly(false);
      queryLoaderState.extraQueryFilterOptionsRelatedToTemplateQuery.forEach(
        (op) =>
          queryLoaderState.extraFilters.set(
            op,
            !queryLoaderState.isCuratedTemplateToggled,
          ),
      );
      queryLoaderState.showingDefaultQueries =
        queryLoaderState.isCuratedTemplateToggled;
      queryLoaderState.setIsCuratedTemplateToggled(
        !queryLoaderState.isCuratedTemplateToggled,
      );
    };
    useEffect(() => {
      flowResult(queryLoaderState.searchQueries('')).catch(
        applicationStore.alertUnhandledError,
      );
    }, [applicationStore, queryLoaderState]);

    useEffect(() => {
      searchInputRef.current?.focus();
    }, [queryLoaderState]);

    // actions
    const renameQuery =
      (query: LightQuery): (() => void) =>
      (): void => {
        if (!queryLoaderState.isReadOnly) {
          flowResult(
            queryLoaderState.renameQuery(query.id, queryNameInputValue),
          )
            .catch(applicationStore.alertUnhandledError)
            .finally(() => hideEditQueryNameInput());
        }
      };

    const deleteQuery =
      (query: LightQuery): (() => void) =>
      (): void => {
        if (!queryLoaderState.isReadOnly) {
          flowResult(queryLoaderState.deleteQuery(query.id)).catch(
            applicationStore.alertUnhandledError,
          );
        }
      };

    const showPreview = (
      queryId: string | undefined,
      template?: {
        queryName: string;
        queryContent: RawLambda;
      },
    ): void => {
      flowResult(
        queryLoaderState.getPreviewQueryContent(queryId, template),
      ).catch(applicationStore.alertUnhandledError);
      queryLoaderState.setShowPreviewViewer(true);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    // const rowData = (res: LightQuery[]): PlainObject[] =>
    //   res.map((query, idx) => {
    //     const row: PlainObject = {};
    //     row.Name = (
    //       <>
    //         {showQueryNameEditInput === idx ? (
    //           <div className="query-loader__result__title__editor">
    //             <input
    //               className="query-loader__result__title__editor__input input--dark"
    //               spellCheck={false}
    //               ref={queryRenameInputRef}
    //               value={queryNameInputValue}
    //               onChange={changeQueryNameInputValue}
    //               onKeyDown={(event) => {
    //                 if (event.code === 'Enter') {
    //                   event.stopPropagation();
    //                   renameQuery(query)();
    //                 } else if (event.code === 'Escape') {
    //                   event.stopPropagation();
    //                   hideEditQueryNameInput();
    //                 }
    //               }}
    //               onBlur={() => hideEditQueryNameInput()}
    //               // avoid clicking on the input causing the call to load query
    //               onClick={(event) => event.stopPropagation()}
    //             />
    //           </div>
    //         ) : (
    //           <div className="query-loader__result__title" title={query.name}>
    //             {query.name}
    //           </div>
    //         )}
    //       </>
    //     );
    //     row.Author = (
    //       <div className="table query-loader__results__table__owner">
    //         <div
    //           className={clsx(
    //             'query-loader__result__description__author__icon',
    //             {
    //               'query-loader__result__description__author__icon--owner':
    //                 query.isCurrentUserQuery,
    //             },
    //           )}
    //         >
    //           <UserIcon />
    //         </div>
    //         <div className="query-loader__result__description__author__name">
    //           {query.isCurrentUserQuery ? (
    //             <div
    //               title={query.owner}
    //               className="query-loader__result__description__owner"
    //             >
    //               Me
    //             </div>
    //           ) : (
    //             query.owner
    //           )}
    //         </div>
    //       </div>
    //     );
    //     row['Last Modified'] = (
    //       <div className="query-loader__result__description__date">
    //         {query.lastUpdatedAt
    //           ? formatDistanceToNow(new Date(query.lastUpdatedAt), {
    //               includeSeconds: true,
    //               addSuffix: true,
    //             })
    //           : '(unknown)'}
    //       </div>
    //     );
    //     row['More Actions'] = (
    //       <DropdownMenu
    //         className="query-loader__result__actions-menu"
    //         title="More Actions..."
    //         content={
    //           <MenuContent>
    //             <MenuContentItem onClick={(): void => showPreview(query.id)}>
    //               Show Query Preview
    //             </MenuContentItem>
    //             {!queryLoaderState.isReadOnly && (
    //               <MenuContentItem
    //                 disabled={!query.isCurrentUserQuery}
    //                 onClick={deleteQuery(query)}
    //               >
    //                 Delete
    //               </MenuContentItem>
    //             )}
    //             {!queryLoaderState.isReadOnly && (
    //               <MenuContentItem
    //                 disabled={!query.isCurrentUserQuery}
    //                 onClick={showEditQueryNameInput(query.name, idx)}
    //               >
    //                 Rename
    //               </MenuContentItem>
    //             )}
    //           </MenuContent>
    //         }
    //         menuProps={{
    //           anchorOrigin: {
    //             vertical: 'bottom',
    //             horizontal: 'left',
    //           },
    //           transformOrigin: {
    //             vertical: 'top',
    //             horizontal: 'left',
    //           },
    //           elevation: 7,
    //         }}
    //       >
    //         <MoreVerticalIcon />
    //       </DropdownMenu>
    //     );
    //     return row;
    //   });

    return (
      <div className="query-loader">
        <div className="query-loader__header">
          <div className="query-loader__search">
            <div className="query-loader__search__input__container">
              <input
                ref={searchInputRef}
                className={clsx('query-loader__search__input input--dark', {
                  'query-loader__search__input--searching':
                    queryLoaderState.searchText,
                })}
                onChange={onSearchTextChange}
                value={queryLoaderState.searchText}
                placeholder="Search for queries by name or ID"
              />
              {!queryLoaderState.searchText ? (
                <div className="query-loader__search__input__search__icon">
                  <SearchIcon />
                </div>
              ) : (
                <>
                  <button
                    className="query-loader__search__input__clear-btn"
                    tabIndex={-1}
                    onClick={clearQuerySearching}
                    title="Clear"
                  >
                    <TimesIcon />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="query-loader__filter">
            <div className="query-loader__filter__toggler">
              <button
                className={clsx('query-loader__filter__toggler__btn', {
                  'query-loader__filter__toggler__btn--toggled': isMineOnly,
                })}
                onClick={toggleShowCurrentUserQueriesOnly}
                disabled={queryLoaderState.isCuratedTemplateToggled}
                title={
                  queryLoaderState.isCuratedTemplateToggled
                    ? 'current fitler is disabled when `Curated Template Query` is on'
                    : 'click to add filter'
                }
                tabIndex={-1}
              >
                Mine Only
              </button>
              {queryLoaderState.extraFilterOptions.length > 0 && (
                <div className="query-loader__filter__extra__filters">
                  {Array.from(queryLoaderState.extraFilters.entries()).map(
                    ([key, value]) => (
                      <button
                        key={key}
                        className={clsx('query-loader__filter__toggler__btn', {
                          'query-loader__filter__toggler__btn--toggled': value,
                        })}
                        disabled={queryLoaderState.isCuratedTemplateToggled}
                        title={
                          queryLoaderState.isCuratedTemplateToggled
                            ? 'current fitler is disabled when `Curated Template Query` is on'
                            : 'click to add filter'
                        }
                        onClick={(): void => toggleExtraFilters(key)}
                        tabIndex={-1}
                      >
                        {key}
                      </button>
                    ),
                  )}
                </div>
              )}
              {queryLoaderState.extraQueryFilterOptionsRelatedToTemplateQuery
                .length > 0 && (
                <div className="query-loader__filter__extra__filters">
                  <button
                    className={clsx('query-loader__filter__toggler__btn', {
                      'query-loader__filter__toggler__btn--toggled':
                        queryLoaderState.isCuratedTemplateToggled,
                    })}
                    onClick={toggleCuratedTemplate}
                    tabIndex={-1}
                  >
                    Curated Template Query
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="query-loader__content">
          <PanelLoadingIndicator
            isLoading={
              queryLoaderState.searchQueriesState.isInProgress ||
              queryLoaderState.renameQueryState.isInProgress ||
              queryLoaderState.deleteQueryState.isInProgress ||
              queryLoaderState.previewQueryState.isInProgress
            }
          />

          <div className="query-loader__results">
            {queryLoaderState.searchQueriesState.hasCompleted && (
              <>
                <div className="query-loader__results__summary">
                  {queryLoaderState.showingDefaultQueries ? (
                    queryLoaderState.generateDefaultQueriesSummaryText?.(
                      results,
                    ) ?? 'Refine your search to get better matches'
                  ) : !queryLoaderState.isCuratedTemplateToggled ? (
                    results.length >= QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT ? (
                      <>
                        {`Found ${QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT}+ matches`}{' '}
                        <InfoCircleIcon
                          title="Some queries are not listed, refine your search to get better matches"
                          className="query-loader__results__summary__info"
                        />
                      </>
                    ) : (
                      `Found ${quantifyList(results, 'match', 'matches')}`
                    )
                  ) : curatedTemplateQueries.length >=
                    QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT ? (
                    <>
                      {`Found ${QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT}+ matches`}{' '}
                      <InfoCircleIcon
                        title="Some queries are not listed, refine your search to get better matches"
                        className="query-loader__results__summary__info"
                      />
                    </>
                  ) : (
                    `Found ${quantifyList(
                      curatedTemplateQueries,
                      'match',
                      'matches',
                    )}`
                  )}
                </div>

                {/* <div className="query-builder__result__values__table"> */}
                {/* <div
                    className={clsx('query-builder__result__tds-grid', {
                      'ag-theme-balham':
                        applicationStore.layoutService
                          .TEMPORARY__isLightColorThemeEnabled,
                      'ag-theme-balham-dark':
                        !applicationStore.layoutService
                          .TEMPORARY__isLightColorThemeEnabled,
                    })}
                  >
                    <DataGrid
                      rowData={rowData(
                        rowsPerPage > 0
                          ? results.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage,
                            )
                          : results,
                      )}
                      gridOptions={{
                        suppressScrollOnNewData: true,
                        getRowId: (data) => data.data.rowNumber,
                      }}
                      // NOTE: when column definition changed, we need to force refresh the cell to make sure the cell renderer is updated
                      // See https://stackoverflow.com/questions/56341073/how-to-refresh-an-ag-grid-when-a-change-occurs-inside-a-custom-cell-renderer-com
                      onRowDataUpdated={(params) => {
                        params.api.refreshCells({ force: true });
                      }}
                      suppressFieldDotNotation={true}
                      columnDefs={[
                        'Name',
                        'Author',
                        'Last Modified',
                        'More Actions',
                      ].map(
                        (colName) =>
                          ({
                            minWidth: 50,
                            sortable: true,
                            resizable: true,
                            field: colName,
                            flex: 1,
                            // cellRenderer: QueryResultCellRenderer,
                            // cellRendererParams: {
                            //   tdsExecutionResult: executionResult,
                            // },
                          }) as DataGridColumnDefinition,
                      )}
                    />
                  </div> */}
                {/* </div> */}
                <table className="table query-loader__results__table">
                  <thead>
                    <tr>
                      <th className="table__cell--left">Name</th>
                      <th className="table__cell--left">Author</th>
                      <th className="table__cell--left">Last Modified</th>
                      <th className="table__cell--left">More Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? results.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : results
                    ).map((query, idx) => (
                      <tr key={query.name}>
                        <td>
                          {showQueryNameEditInput === idx ? (
                            <div className="query-loader__result__title__editor">
                              <input
                                className="query-loader__result__title__editor__input input--dark"
                                spellCheck={false}
                                ref={queryRenameInputRef}
                                value={queryNameInputValue}
                                onChange={changeQueryNameInputValue}
                                onKeyDown={(event) => {
                                  if (event.code === 'Enter') {
                                    event.stopPropagation();
                                    renameQuery(query)();
                                  } else if (event.code === 'Escape') {
                                    event.stopPropagation();
                                    hideEditQueryNameInput();
                                  }
                                }}
                                onBlur={() => hideEditQueryNameInput()}
                                // avoid clicking on the input causing the call to load query
                                onClick={(event) => event.stopPropagation()}
                              />
                            </div>
                          ) : (
                            <div
                              className="query-loader__result__title"
                              title={query.name}
                            >
                              {query.name}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="table query-loader__results__table__owner">
                            <div
                              className={clsx(
                                'query-loader__result__description__author__icon',
                                {
                                  'query-loader__result__description__author__icon--owner':
                                    query.isCurrentUserQuery,
                                },
                              )}
                            >
                              <UserIcon />
                            </div>
                            <div className="query-loader__result__description__author__name">
                              {query.isCurrentUserQuery ? (
                                <div
                                  title={query.owner}
                                  className="query-loader__result__description__owner"
                                >
                                  Me
                                </div>
                              ) : (
                                query.owner
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="query-loader__result__description__date">
                            {query.lastUpdatedAt
                              ? formatDistanceToNow(
                                  new Date(query.lastUpdatedAt),
                                  {
                                    includeSeconds: true,
                                    addSuffix: true,
                                  },
                                )
                              : '(unknown)'}
                          </div>
                        </td>
                        <td>
                          <DropdownMenu
                            className="query-loader__result__actions-menu"
                            title="More Actions..."
                            content={
                              <MenuContent>
                                <MenuContentItem
                                  onClick={(): void => showPreview(query.id)}
                                >
                                  Show Query Preview
                                </MenuContentItem>
                                {!queryLoaderState.isReadOnly && (
                                  <MenuContentItem
                                    disabled={!query.isCurrentUserQuery}
                                    onClick={deleteQuery(query)}
                                  >
                                    Delete
                                  </MenuContentItem>
                                )}
                                {!queryLoaderState.isReadOnly && (
                                  <MenuContentItem
                                    disabled={!query.isCurrentUserQuery}
                                    onClick={showEditQueryNameInput(
                                      query.name,
                                      idx,
                                    )}
                                  >
                                    Rename
                                  </MenuContentItem>
                                )}
                              </MenuContent>
                            }
                            menuProps={{
                              anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                              },
                              transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                              },
                              elevation: 7,
                            }}
                          >
                            <MoreVerticalIcon />
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <BaseTablePagination
                        rows={results}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: 'All', value: -1 },
                        ]}
                        count={results.length}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
                {queryLoaderState.queryBuilderState &&
                  queryLoaderState.isCuratedTemplateToggled &&
                  loadCuratedTemplateQuery &&
                  curatedTemplateQueries
                    .slice(0, QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT)
                    .map((templateQuery, idx) => (
                      <div
                        className="query-loader__result"
                        title={`Click to ${loadActionLabel}...`}
                        key={templateQuery.title}
                        onClick={() => {
                          loadCuratedTemplateQuery()(
                            templateQuery,
                            guaranteeNonNullable(
                              queryLoaderState.queryBuilderState,
                            ),
                          );
                          queryLoaderState.setQueryLoaderDialogOpen(false);
                        }}
                      >
                        <div className="query-loader__result__content">
                          <div
                            className="query-loader__result__title"
                            title={templateQuery.title}
                          >
                            {templateQuery.title}
                          </div>
                          <div className="query-loader__result__description">
                            {templateQuery.description}
                          </div>
                        </div>
                        <DropdownMenu
                          className="query-loader__result__actions-menu"
                          title="More Actions..."
                          content={
                            <MenuContent>
                              <MenuContentItem
                                onClick={(): void =>
                                  showPreview(undefined, {
                                    queryContent: templateQuery.query,
                                    queryName: templateQuery.title,
                                  })
                                }
                              >
                                Show Query Preview
                              </MenuContentItem>
                            </MenuContent>
                          }
                          menuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            elevation: 7,
                          }}
                        >
                          <MoreVerticalIcon />
                        </DropdownMenu>
                        <div className="query-loader__result__arrow">
                          <ThinChevronRightIcon />
                        </div>
                      </div>
                    ))}
              </>
            )}
            {!queryLoaderState.searchQueriesState.hasCompleted && (
              <BlankPanelContent>Loading queries...</BlankPanelContent>
            )}
          </div>
          {queryLoaderState.showPreviewViewer &&
            queryLoaderState.queryPreviewContent && (
              <QueryPreviewViewer queryLoaderState={queryLoaderState} />
            )}
        </div>
      </div>
    );
  },
);

export const QueryLoaderDialog = observer(
  (props: {
    queryLoaderState: QueryLoaderState;
    title: string;
    loadActionLabel?: string | undefined;
  }) => {
    const { queryLoaderState, title, loadActionLabel } = props;
    const applicationStore = queryLoaderState.applicationStore;

    const loadCuratedTemplateQuery =
      queryLoaderState.curatedTemplateQuerySepcifications
        // already using an arrow function suggested by @typescript-eslint/unbound-method
        // eslint-disable-next-line
        .map((s) => () => s.loadCuratedTemplateQuery)
        .filter(isNonNullable)[0];

    const close = (): void => {
      queryLoaderState.setQueryLoaderDialogOpen(false);
      queryLoaderState.reset();
    };

    return (
      <Dialog
        open={queryLoaderState.isQueryLoaderDialogOpen}
        onClose={close}
        classes={{
          root: 'query-loader__dialog',
          container: 'query-loader__dialog__container',
        }}
        PaperProps={{
          classes: { root: 'query-loader__dialog__body' },
        }}
      >
        <Modal
          darkMode={
            !applicationStore.layoutService.TEMPORARY__isLightColorThemeEnabled
          }
          className="query-loader__dialog__body"
        >
          <ModalHeader
            className="query-loader__dialog__header__title"
            title={title}
          />
          <ModalBody className="query-loader__dialog__body__content">
            <QueryLoader
              queryLoaderState={queryLoaderState}
              loadActionLabel={loadActionLabel ?? title.toLowerCase()}
            />
          </ModalBody>
          <ModalFooter>
            <ModalFooterButton
              onClick={() => {
                if (queryLoaderState.selectedLoadQuery) {
                  if (
                    queryLoaderState.selectedLoadQuery instanceof LightQuery
                  ) {
                    queryLoaderState.loadQuery(
                      queryLoaderState.selectedLoadQuery,
                    );
                  } else {
                    if (loadCuratedTemplateQuery) {
                      loadCuratedTemplateQuery()(
                        queryLoaderState.selectedLoadQuery as CuratedTemplateQuery,
                        guaranteeNonNullable(
                          queryLoaderState.queryBuilderState,
                        ),
                      );
                    }
                  }
                }
              }}
              text="Load"
            />
            <ModalFooterButton onClick={close} text="Close" type="secondary" />
          </ModalFooter>
        </Modal>
      </Dialog>
    );
  },
);
