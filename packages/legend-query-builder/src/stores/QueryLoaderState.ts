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

import {
  DEFAULT_TYPEAHEAD_SEARCH_MINIMUM_SEARCH_LENGTH,
  type GenericLegendApplicationStore,
} from '@finos/legend-application';
import {
  QuerySearchSpecification,
  GRAPH_MANAGER_EVENT,
  type QueryInfo,
  type LightQuery,
  type BasicGraphManagerState,
  type Query,
  type RawLambda,
} from '@finos/legend-graph';
import {
  ActionState,
  type GeneratorFn,
  assertErrorThrown,
  guaranteeNonNullable,
  LogEvent,
} from '@finos/legend-shared';
import { makeObservable, observable, action, flow } from 'mobx';
import type { QueryBuilderState } from './QueryBuilderState.js';
import type {
  CuratedTemplateQuery,
  CuratedTemplateQuerySpecification,
  LoadQueryFilterOption,
  QueryBuilder_LegendApplicationPlugin_Extension,
} from './QueryBuilder_LegendApplicationPlugin_Extension.js';

export const QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT = 50;

export class QueryLoaderState {
  readonly applicationStore: GenericLegendApplicationStore;
  readonly graphManagerState: BasicGraphManagerState;

  readonly searchQueriesState = ActionState.create();
  readonly renameQueryState = ActionState.create();
  readonly deleteQueryState = ActionState.create();
  readonly previewQueryState = ActionState.create();

  readonly decorateSearchSpecification?:
    | ((val: QuerySearchSpecification) => QuerySearchSpecification)
    | undefined;

  readonly loadQuery: (query: LightQuery) => void;
  readonly fetchDefaultQueries?: (() => Promise<LightQuery[]>) | undefined;
  readonly generateDefaultQueriesSummaryText?:
    | ((queries: LightQuery[]) => string)
    | undefined;

  readonly isReadOnly?: boolean | undefined;
  readonly onQueryRenamed?: ((query: LightQuery) => void) | undefined;
  readonly onQueryDeleted?: ((query: string) => void) | undefined;
  readonly handleFetchDefaultQueriesFailure?: (() => void) | undefined;

  queryBuilderState?: QueryBuilderState | undefined;

  searchText = '';
  showCurrentUserQueriesOnly = false; // TODO: if we start having more native filters, we should make them part of `extraFilters`
  extraFilters = new Map<string, boolean>();
  extraFilterOptions: LoadQueryFilterOption[] = [];
  extraQueryFilterOptionsRelatedToTemplateQuery: string[] = [];
  queries: LightQuery[] = [];
  curatedTemplateQuerySepcifications: CuratedTemplateQuerySpecification[] = [];
  selectedLoadQuery: LightQuery | CuratedTemplateQuery | undefined;

  isQueryLoaderDialogOpen = false;
  isCuratedTemplateToggled = false;
  showingDefaultQueries = true;
  showPreviewViewer = false;
  queryPreviewContent?: QueryInfo | { name: string; content: string };

  constructor(
    applicationStore: GenericLegendApplicationStore,
    graphManagerState: BasicGraphManagerState,
    options: {
      decorateSearchSpecification?:
        | ((val: QuerySearchSpecification) => QuerySearchSpecification)
        | undefined;

      loadQuery: (query: LightQuery) => void;
      fetchDefaultQueries?: (() => Promise<LightQuery[]>) | undefined;
      generateDefaultQueriesSummaryText?:
        | ((queries: LightQuery[]) => string)
        | undefined;

      isReadOnly?: boolean | undefined;
      onQueryRenamed?: ((query: LightQuery) => void) | undefined;
      onQueryDeleted?: ((query: string) => void) | undefined;
      handleFetchDefaultQueriesFailure?: (() => void) | undefined;
    },
  ) {
    makeObservable(this, {
      isQueryLoaderDialogOpen: observable,
      queryPreviewContent: observable,
      showingDefaultQueries: observable,
      queries: observable,
      showCurrentUserQueriesOnly: observable,
      showPreviewViewer: observable,
      searchText: observable,
      isCuratedTemplateToggled: observable,
      curatedTemplateQuerySepcifications: observable,
      selectedLoadQuery: observable,
      setSelectedLoadQuery: action,
      setSearchText: action,
      setQueryLoaderDialogOpen: action,
      setQueries: action,
      setShowCurrentUserQueriesOnly: action,
      setShowPreviewViewer: action,
      setIsCuratedTemplateToggled: action,
      searchQueries: flow,
      getPreviewQueryContent: flow,
      deleteQuery: flow,
      renameQuery: flow,
      initialize: flow,
    });

    this.applicationStore = applicationStore;
    this.graphManagerState = graphManagerState;

    this.loadQuery = options.loadQuery;
    this.fetchDefaultQueries = options.fetchDefaultQueries;
    this.generateDefaultQueriesSummaryText =
      options.generateDefaultQueriesSummaryText;
    this.decorateSearchSpecification = options.decorateSearchSpecification;
    this.isReadOnly = options.isReadOnly;
    this.onQueryRenamed = options.onQueryRenamed;
    this.onQueryDeleted = options.onQueryDeleted;
    this.handleFetchDefaultQueriesFailure =
      options.handleFetchDefaultQueriesFailure;
  }

  setIsCuratedTemplateToggled(val: boolean): void {
    this.isCuratedTemplateToggled = val;
  }

  setSelectedLoadQuery(val: LightQuery | CuratedTemplateQuery): void {
    this.selectedLoadQuery = val;
  }

  setSearchText(val: string): void {
    this.searchText = val;
  }

  setQueryLoaderDialogOpen(val: boolean): void {
    this.isQueryLoaderDialogOpen = val;
  }

  setQueries(val: LightQuery[]): void {
    this.queries = val;
  }

  setShowPreviewViewer(val: boolean): void {
    this.showPreviewViewer = val;
  }

  setShowCurrentUserQueriesOnly(val: boolean): void {
    this.showCurrentUserQueriesOnly = val;
  }

  reset(): void {
    this.setShowCurrentUserQueriesOnly(false);
    this.setIsCuratedTemplateToggled(false);
  }

  *initialize(queryBuilderState: QueryBuilderState): GeneratorFn<void> {
    this.queryBuilderState = queryBuilderState;
    this.extraFilterOptions = this.applicationStore.pluginManager
      .getApplicationPlugins()
      .flatMap(
        (plugin) =>
          (
            plugin as QueryBuilder_LegendApplicationPlugin_Extension
          ).getExtraLoadQueryFilterOptions?.() ?? [],
      );
    this.extraQueryFilterOptionsRelatedToTemplateQuery =
      this.applicationStore.pluginManager
        .getApplicationPlugins()
        .flatMap(
          (plugin) =>
            (plugin as QueryBuilder_LegendApplicationPlugin_Extension)
              .getQueryFilterOptionsRelatedToTemplateQuery?.()(
                guaranteeNonNullable(this.queryBuilderState),
              )
              .flat() ?? [],
        );
    const extraFilters = this.extraFilterOptions.map((filterOption) =>
      filterOption.label(guaranteeNonNullable(this.queryBuilderState)),
    );
    extraFilters.forEach(
      (filter) => filter && this.extraFilters.set(filter, false),
    );
    this.curatedTemplateQuerySepcifications =
      this.applicationStore.pluginManager
        .getApplicationPlugins()
        .flatMap(
          (plugin) =>
            (
              plugin as QueryBuilder_LegendApplicationPlugin_Extension
            ).getCuratedTemplateQuerySpecifications?.() ?? [],
        );
  }

  *searchQueries(searchText: string): GeneratorFn<void> {
    if (
      searchText.length < DEFAULT_TYPEAHEAD_SEARCH_MINIMUM_SEARCH_LENGTH &&
      !this.showCurrentUserQueriesOnly &&
      Array.from(this.extraFilters.values()).every((value) => value === false)
    ) {
      // if no search text is specified, use fetch the default queries
      if (!searchText) {
        this.showingDefaultQueries = true;
        this.searchQueriesState.inProgress();
        this.queries = [];
        try {
          if (!this.fetchDefaultQueries) {
            return;
          }
          this.queries = (yield this.fetchDefaultQueries()) as LightQuery[];
          this.searchQueriesState.pass();
        } catch (error) {
          this.searchQueriesState.fail();
          assertErrorThrown(error);
          this.applicationStore.logService.error(
            LogEvent.create(GRAPH_MANAGER_EVENT.GET_QUERY_FAILURE),
            error,
          );
          this.handleFetchDefaultQueriesFailure?.();
        }
      }

      // skip otherwise
      return;
    }

    // search using the search term
    this.showingDefaultQueries = false;
    this.searchQueriesState.inProgress();
    try {
      let searchSpecification =
        QuerySearchSpecification.createDefault(searchText);
      searchSpecification.limit = QUERY_LOADER_TYPEAHEAD_SEARCH_LIMIT + 1;
      searchSpecification.showCurrentUserQueriesOnly =
        this.showCurrentUserQueriesOnly;
      if (this.queryBuilderState) {
        Array.from(this.extraFilters.entries()).forEach(([key, value]) => {
          if (value) {
            const filterOption = this.extraFilterOptions.find(
              (option) =>
                option.label(guaranteeNonNullable(this.queryBuilderState)) ===
                key,
            );
            if (filterOption) {
              searchSpecification = filterOption.filterFunction(
                searchSpecification,
                guaranteeNonNullable(this.queryBuilderState),
              );
            }
          }
        });
      }
      searchSpecification =
        this.decorateSearchSpecification?.(searchSpecification) ??
        searchSpecification;
      this.queries = (yield this.graphManagerState.graphManager.searchQueries(
        searchSpecification,
      )) as LightQuery[];
      this.searchQueriesState.pass();
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.notificationService.notifyError(error);
      this.searchQueriesState.fail();
    }
  }

  *renameQuery(queryId: string, name: string): GeneratorFn<void> {
    this.renameQueryState.inProgress();
    try {
      const query = (yield this.graphManagerState.graphManager.renameQuery(
        queryId,
        name,
      )) as Query;
      this.onQueryRenamed?.(query);
      this.applicationStore.notificationService.notifySuccess(
        'Renamed query successfully',
      );
      this.renameQueryState.pass();
      this.searchQueries(this.searchText); // trigger a search to refresh the query list
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.notificationService.notifyError(error);
      this.renameQueryState.fail();
    }
  }

  *deleteQuery(queryId: string): GeneratorFn<void> {
    this.deleteQueryState.inProgress();
    try {
      yield this.graphManagerState.graphManager.deleteQuery(queryId);
      this.onQueryDeleted?.(queryId);
      this.applicationStore.notificationService.notifySuccess(
        'Deleted query successfully',
      );
      this.deleteQueryState.pass();
      this.searchQueries(this.searchText); // trigger a search to refresh the query list
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.notificationService.notifyError(error);
      this.deleteQueryState.fail();
    }
  }

  *getPreviewQueryContent(
    queryId: string | undefined,
    template?: {
      queryName: string;
      queryContent: RawLambda;
    },
  ): GeneratorFn<void> {
    this.previewQueryState.inProgress();
    try {
      if (queryId) {
        const queryInfo =
          (yield this.graphManagerState.graphManager.getQueryInfo(
            queryId,
          )) as QueryInfo;
        this.queryPreviewContent = queryInfo;
        this.queryPreviewContent.content =
          (yield this.graphManagerState.graphManager.prettyLambdaContent(
            queryInfo.content,
          )) as string;
      } else if (template) {
        this.queryPreviewContent = {
          name: template.queryName,
          content: '',
        } as QueryInfo;
        this.queryPreviewContent.content =
          (yield this.graphManagerState.graphManager.lambdaToPureCode(
            template.queryContent,
            true,
          )) as string;
      }
      this.previewQueryState.pass();
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.notificationService.notifyError(error);
      this.previewQueryState.fail();
    }
  }
}
