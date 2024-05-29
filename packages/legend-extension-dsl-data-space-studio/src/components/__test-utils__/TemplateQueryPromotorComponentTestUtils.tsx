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

import { type RenderResult, render, waitFor } from '@testing-library/react';
import { guaranteeNonNullable, type PlainObject } from '@finos/legend-shared';
import { createMock, createSpy } from '@finos/legend-shared/test';
import {
  type GraphManagerState,
  Query,
  LightQuery,
  RawLambda,
  PackageableElementExplicitReference,
  type RawMappingModelCoverageAnalysisResult,
  QueryExplicitExecutionContext,
} from '@finos/legend-graph';
import { DepotServerClient } from '@finos/legend-server-depot';
import {
  ApplicationStoreProvider,
  ApplicationStore,
  TEST__BrowserEnvironmentProvider,
} from '@finos/legend-application';
import {
  type QueryBuilderState,
  QUERY_BUILDER_TEST_ID,
} from '@finos/legend-query-builder';
import { DataSpaceTemplateQueryPromotionReviewerStore } from '../../stores/DataSpaceTemplateQueryPromotionReviewerStore.js';
import { Project, SDLCServerClient } from '@finos/legend-server-sdlc';
import {
  LegendStudioFrameworkProvider,
  LegendStudioPluginManager,
  type LegendStudioApplicationStore,
  TEST__getLegendStudioApplicationConfig,
  Core_LegendStudioApplicationPlugin,
} from '@finos/legend-application-studio';
import {
  DataSpaceTemplateQueryPromotionReviewer,
  TemplateQueryPromotionReviewerContent,
} from '../DataSpaceTemplateQueryPromoteReview.js';
import {
  DSL_DataSpace_GraphManagerPreset,
  DSL_DataSpace_PureGraphManagerExtension,
} from '@finos/legend-extension-dsl-data-space/graph';
import type { Entity } from '@finos/legend-storage';
import { Route } from '@finos/legend-application/browser';
import { DATA_SPACE_STUDIO_ROUTE_PATTERN } from '@finos/legend-extension-dsl-data-space/application';

export const TEST__provideMockedTemplateQueryPromotionReviewerStore =
  (customization?: {
    mock?: DataSpaceTemplateQueryPromotionReviewerStore;
    applicationStore?: LegendStudioApplicationStore;
    graphManagerState?: GraphManagerState;
    pluginManager?: LegendStudioPluginManager;
  }): DataSpaceTemplateQueryPromotionReviewerStore => {
    const pluginManager =
      customization?.pluginManager ?? LegendStudioPluginManager.create();
    pluginManager
      .usePresets([new DSL_DataSpace_GraphManagerPreset()])
      .usePlugins([new Core_LegendStudioApplicationPlugin()])
      .install();
    const applicationStore =
      customization?.applicationStore ??
      new ApplicationStore(
        TEST__getLegendStudioApplicationConfig(),
        pluginManager,
      );
    const value =
      customization?.mock ??
      new DataSpaceTemplateQueryPromotionReviewerStore(
        applicationStore,
        new SDLCServerClient({
          env: applicationStore.config.env,
          serverUrl: applicationStore.config.sdlcServerUrl,
          baseHeaders: applicationStore.config.sdlcServerBaseHeaders,
        }),
        new DepotServerClient({
          serverUrl: applicationStore.config.depotServerUrl,
        }),
      );
    const MOCK__TemplateQueryPromotionReviewerStoreProvider = require('../DataSpaceTemplateQueryPromoteReview.js'); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    MOCK__TemplateQueryPromotionReviewerStoreProvider.useTemplateQueryPromotionReviewerStore =
      createMock();
    MOCK__TemplateQueryPromotionReviewerStoreProvider.useTemplateQueryPromotionReviewerStore.mockReturnValue(
      value,
    );
    return value;
  };

export const TEST__promoteTemplateQueryEditor = async (
  MOCK__editorStore: DataSpaceTemplateQueryPromotionReviewerStore,
  entities: PlainObject<Entity>[],
  projectData: {
    id: string;
    groupId: string;
    artifactId: string;
    projectId: string;
    versions: string[];
    latestVersion: string;
  },
  project: PlainObject<Project>,
  versionId: string,
  queryId: string,
  queryName: string,
  dataspacePath: string,
): Promise<{
  renderResult: RenderResult;
}> => {
  const graphManagerExtension = MOCK__editorStore.graphManagerExtension;

  await graphManagerExtension.graphManager.initialize({
    env: 'test',
    tabSize: 2,
    clientConfig: {},
  });

  const ProjectConfigurationStatusReport = {
    projectConfigured: false,
    reviewIds: [],
  };
  const projectConfiguration = {
    projectId: projectData.projectId,
    groupId: projectData.groupId,
    artifactId: projectData.artifactId,
    projectStructureVersion: {
      version: versionId,
    },
  };

  const lightQuery = new LightQuery();
  lightQuery.name = queryName;
  lightQuery.id = queryId;
  lightQuery.versionId = versionId;
  lightQuery.groupId = projectData.groupId;
  lightQuery.artifactId = projectData.artifactId;
  lightQuery.owner = 'test-artifact';
  lightQuery.isCurrentUserQuery = true;

  const query = new Query();
  query.name = queryName;
  query.id = queryId;
  query.versionId = versionId;
  query.groupId = projectData.groupId;
  query.artifactId = projectData.artifactId;
  query.owner = 'test-artifact';
  query.isCurrentUserQuery = true;

  const queryInfo = {
    name: queryName,
    id: queryId,
    versionId: versionId,
    groupId: projectData.groupId,
    artifactId: projectData.artifactId,
    executionContext: { dataSpacePath: dataspacePath },
    content: '',
  };

  createSpy(
    MOCK__editorStore.depotServerClient,
    'getProject',
  ).mockResolvedValue(projectData);
  createSpy(
    MOCK__editorStore.depotServerClient,
    'getVersionEntities',
  ).mockResolvedValue(entities);
  createSpy(
    MOCK__editorStore.sdlcServerClient,
    'getConfiguration',
  ).mockResolvedValue(projectConfiguration);
  createSpy(graphManagerExtension.graphManager, 'getQuery').mockResolvedValue(
    query,
  );
  createSpy(
    graphManagerExtension.graphManager,
    'getQueryInfo',
  ).mockResolvedValue(queryInfo);
  createSpy(MOCK__editorStore.sdlcServerClient, 'getProject').mockResolvedValue(
    project,
  );
  createSpy(
    MOCK__editorStore.sdlcServerClient,
    'projectConfigurationStatus',
  ).mockResolvedValue(ProjectConfigurationStatusReport);
  createSpy(
    MOCK__editorStore.sdlcServerClient,
    'getGroupWorkspaces',
  ).mockResolvedValue([]);
  createSpy(
    graphManagerExtension.graphManager,
    'getLightQuery',
  ).mockResolvedValue(lightQuery);

  // MOCK__editorStore.initialize = createMock();

  const renderResult = render(
    <ApplicationStoreProvider store={MOCK__editorStore.applicationStore}>
      <TEST__BrowserEnvironmentProvider>
        <LegendStudioFrameworkProvider>
          {/* <Route
            path={[DATA_SPACE_STUDIO_ROUTE_PATTERN.PROMOTE_TEMPLATE_QUERY]}
          >
            <TemplateQueryPromotionReviewerContent />
          </Route> */}
          {/* <TemplateQueryPromotionReviewerContent /> */}
          {/* <DataSpaceTemplateQueryPromotionReviewer /> */}
          <>123</>
        </LegendStudioFrameworkProvider>
      </TEST__BrowserEnvironmentProvider>
    </ApplicationStoreProvider>,
  );

  return {
    renderResult,
  };
};
