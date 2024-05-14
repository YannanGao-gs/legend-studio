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
  DepotScope,
  LATEST_VERSION_ALIAS,
  type DepotServerClient,
  type StoredEntity,
} from '@finos/legend-server-depot';
import type { GraphManagerState, RawLambda } from '@finos/legend-graph';
import { type GenericLegendApplicationStore } from '@finos/legend-application';
import { action, flow, makeObservable, observable } from 'mobx';
import {
  type QueryBuilderConfig,
  QueryBuilderState,
  QueryBuilderDataBrowserWorkflow,
} from '@finos/legend-query-builder';
import type { ProjectGAVCoordinates } from '@finos/legend-storage';
import {
  ActionState,
  assertErrorThrown,
  guaranteeNonNullable,
  UnsupportedOperationError,
  type GeneratorFn,
} from '@finos/legend-shared';
import {
  extractDataSpaceInfo,
  type DataSpaceInfo,
} from '@finos/legend-extension-dsl-data-space/application';
import { DATA_SPACE_ELEMENT_CLASSIFIER_PATH } from '@finos/legend-extension-dsl-data-space/graph';
import {
  QueryBuilderActionConfig_QueryApplication,
  QueryEditorStore,
  createViewProjectHandler,
  createViewSDLCProjectHandler,
  type QueryPersistConfiguration,
} from '../QueryEditorStore.js';
import { generateDataSpaceQueryCreatorRoute } from '../../__lib__/DSL_DataSpace_LegendQueryNavigation.js';
import { renderDataSpaceQuerySetupSetupPanelContent } from '../../components/data-space/DataSpaceQuerySetup.js';
import { DataSpaceAdvancedSearchState } from '@finos/legend-extension-dsl-data-space/application-query';

export class DataSpaceQuerySetupState extends QueryBuilderState {
  editorStore: QueryEditorStore;
  readonly depotServerClient: DepotServerClient;
  readonly loadDataSpacesState = ActionState.create();
  readonly onDataSpaceChange: (val: DataSpaceInfo) => void;
  readonly viewProject: (
    groupId: string,
    artifactId: string,
    versionId: string,
    entityPath: string | undefined,
  ) => void;
  readonly viewSDLCProject: (
    groupId: string,
    artifactId: string,
    entityPath: string | undefined,
  ) => Promise<void>;

  override TEMPORARY__setupPanelContentRenderer = (): React.ReactNode =>
    renderDataSpaceQuerySetupSetupPanelContent(this);

  dataSpaces: DataSpaceInfo[] = [];
  showRuntimeSelector = false;
  advancedSearchState?: DataSpaceAdvancedSearchState | undefined;

  constructor(
    editorStore: QueryEditorStore,
    applicationStore: GenericLegendApplicationStore,
    graphManagerState: GraphManagerState,
    depotServerClient: DepotServerClient,
    onDataSpaceChange: (val: DataSpaceInfo) => void,
    viewProject: (
      groupId: string,
      artifactId: string,
      versionId: string,
      entityPath: string | undefined,
    ) => void,
    viewSDLCProject: (
      groupId: string,
      artifactId: string,
      entityPath: string | undefined,
    ) => Promise<void>,
    config: QueryBuilderConfig | undefined,
  ) {
    super(
      applicationStore,
      graphManagerState,
      QueryBuilderDataBrowserWorkflow.INSTANCE,
      config,
    );

    makeObservable(this, {
      dataSpaces: observable,
      advancedSearchState: observable,
      showAdvancedSearchPanel: action,
      hideAdvancedSearchPanel: action,
      loadDataSpaces: flow,
    });

    this.editorStore = editorStore;
    this.actionConfig = new QueryBuilderActionConfig_QueryApplication(
      editorStore,
    );
    this.depotServerClient = depotServerClient;
    this.onDataSpaceChange = onDataSpaceChange;
    this.viewProject = viewProject;
    this.viewSDLCProject = viewSDLCProject;
  }

  override get isResultPanelHidden(): boolean {
    return true;
  }

  override get sideBarClassName(): string | undefined {
    return 'query-builder__setup__data-space-setup';
  }

  showAdvancedSearchPanel(): void {
    this.advancedSearchState = new DataSpaceAdvancedSearchState(
      this.applicationStore,
      this.graphManagerState,
      this.depotServerClient,
      {
        viewProject: this.viewProject,
        viewSDLCProject: this.viewSDLCProject,
      },
    );
  }

  hideAdvancedSearchPanel(): void {
    this.advancedSearchState = undefined;
  }

  *loadDataSpaces(): GeneratorFn<void> {
    this.loadDataSpacesState.inProgress();
    try {
      this.dataSpaces = (
        (yield this.depotServerClient.getEntitiesByClassifier(
          DATA_SPACE_ELEMENT_CLASSIFIER_PATH,
          {
            scope: DepotScope.RELEASES,
          },
        )) as StoredEntity[]
      ).map((storedEntity) => extractDataSpaceInfo(storedEntity, false));
      this.loadDataSpacesState.pass();
    } catch (error) {
      assertErrorThrown(error);
      this.loadDataSpacesState.fail();
      this.applicationStore.notificationService.notifyError(error);
    }
  }
}

export class DataSpaceQuerySetupStore extends QueryEditorStore {
  override get isViewProjectActionDisabled(): boolean {
    return true;
  }

  getProjectInfo(): ProjectGAVCoordinates {
    throw new UnsupportedOperationError();
  }

  getPersistConfiguration(
    lambda: RawLambda,
    options?: { update?: boolean | undefined },
  ): QueryPersistConfiguration {
    throw new UnsupportedOperationError();
  }

  async initializeQueryBuilderState(): Promise<QueryBuilderState> {
    const queryBuilderState = new DataSpaceQuerySetupState(
      this,
      this.applicationStore,
      this.graphManagerState,
      this.depotServerClient,
      (dataSpaceInfo: DataSpaceInfo) => {
        if (dataSpaceInfo.defaultExecutionContext) {
          this.applicationStore.navigationService.navigator.goToLocation(
            generateDataSpaceQueryCreatorRoute(
              guaranteeNonNullable(dataSpaceInfo.groupId),
              guaranteeNonNullable(dataSpaceInfo.artifactId),
              LATEST_VERSION_ALIAS, //always default to latest
              dataSpaceInfo.path,
              dataSpaceInfo.defaultExecutionContext,
              undefined,
              undefined,
            ),
          );
        } else {
          this.applicationStore.notificationService.notifyWarning(
            `Can't switch data space: default execution context not specified`,
          );
        }
      },
      createViewProjectHandler(this.applicationStore),
      createViewSDLCProjectHandler(
        this.applicationStore,
        this.depotServerClient,
      ),
      this.applicationStore.config.options.queryBuilderConfig,
    );

    return queryBuilderState;
  }

  override *buildGraph(): GeneratorFn<void> {
    // do nothing
  }
}
