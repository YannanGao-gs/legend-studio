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
  type GraphManagerState,
  ConcreteFunctionDefinition,
  getExpectedArtifactGenerationExtensionOutputPath,
  Service,
} from '@finos/legend-graph';
import type {
  DepotServerClient,
  StoreProjectData,
} from '@finos/legend-server-depot';
import { isNonNullable, type PlainObject } from '@finos/legend-shared';
import {
  type DataSpaceAnalysisResult,
  DataSpaceExecutableAnalysisResult,
  DataSpaceFunctionPointerExecutableInfo,
  DataSpaceServiceExecutableInfo,
  DataSpaceTemplateExecutableInfo,
} from './DataSpaceAnalysis.js';
import {
  type DataSpaceExecutable,
  type DataSpace,
  DataSpaceExecutableTemplate,
  DataSpacePackageableElementExecutable,
} from '../../../graph/metamodel/pure/model/packageableElements/dataSpace/DSL_DataSpace_DataSpace.js';
import { getQueryFromDataspaceExecutable } from '../../DSL_DataSpace_GraphManagerHelper.js';

const DATASPACE_ANALYTICS_FILE_NAME = 'AnalyticsResult.json';
const V1_DATASPACE_ANALYTICS_ARTIFACT_EXTENSION_KEY = 'dataSpace-analytics';

export const retrieveAnalyticsResultCache = async (
  project: StoreProjectData,
  versionId: string,
  dataSpacePath: string,
  depotServerClient: DepotServerClient,
): Promise<PlainObject<DataSpaceAnalysisResult>> =>
  JSON.parse(
    await depotServerClient.getGenerationContentByPath(
      project,
      versionId,
      getExpectedArtifactGenerationExtensionOutputPath(
        dataSpacePath,
        V1_DATASPACE_ANALYTICS_ARTIFACT_EXTENSION_KEY,
        DATASPACE_ANALYTICS_FILE_NAME,
      ),
    ),
  );

export const buildDataSpaceExecutableAnalysisResultFromExecutable = async (
  dataspace: DataSpace,
  executables: DataSpaceExecutable[],
  graphManagerState: GraphManagerState,
): Promise<DataSpaceExecutableAnalysisResult[]> =>
  (
    await Promise.all(
      executables.map(async (ex) => {
        const result = new DataSpaceExecutableAnalysisResult();
        result.title = ex.title;
        result.description = ex.description;
        let info;
        if (ex instanceof DataSpaceExecutableTemplate) {
          info = new DataSpaceTemplateExecutableInfo();
          if (ex.id) {
            info.id = ex.id;
          }
          info.executionContextKey =
            ex.executionContextKey ?? dataspace.defaultExecutionContext.name;
          info.query = await graphManagerState.graphManager.lambdaToPureCode(
            ex.query,
          );
        } else if (ex instanceof DataSpacePackageableElementExecutable) {
          const query = getQueryFromDataspaceExecutable(ex, graphManagerState);
          if (ex.executable.value instanceof Service) {
            info = new DataSpaceServiceExecutableInfo();
            info.id = ex.id ?? ex.executable.value.path;
            info.executionContextKey =
              ex.executionContextKey ?? dataspace.defaultExecutionContext.name;
            if (query) {
              info.query =
                await graphManagerState.graphManager.lambdaToPureCode(query);
            }
          } else if (
            ex.executable.value instanceof ConcreteFunctionDefinition
          ) {
            info = new DataSpaceFunctionPointerExecutableInfo();
            info.id = ex.id ?? ex.executable.value.path;
            info.executionContextKey =
              ex.executionContextKey ?? dataspace.defaultExecutionContext.name;
            if (query) {
              info.query =
                await graphManagerState.graphManager.lambdaToPureCode(query);
            }
          }
        }
        result.info = info;
        return result;
      }),
    )
  ).filter(isNonNullable);
