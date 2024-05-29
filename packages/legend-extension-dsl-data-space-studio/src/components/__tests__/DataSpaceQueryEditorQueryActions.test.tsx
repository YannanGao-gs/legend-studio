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

import { test, expect } from '@jest/globals';
import { integrationTest } from '@finos/legend-shared/test';
import {
  create_RawLambda,
  extractElementNameFromPath,
  stub_RawLambda,
  V1_buildExecutionResult,
  V1_serializeExecutionResult,
} from '@finos/legend-graph';
import {
  act,
  fireEvent,
  getByDisplayValue,
  getByText,
  getByTitle,
  waitFor,
} from '@testing-library/react';
import {
  TEST__promoteTemplateQueryEditor,
  TEST__provideMockedTemplateQueryPromotionReviewerStore,
} from '../__test-utils__/TemplateQueryPromotorComponentTestUtils.js';
import { TEST_DATA__promote_template_query_entities } from '../__test-utils__/data/TEST_DATA__PromoteTemplateQuery.js';

test(
  integrationTest('Test Render Promote Curated Template Query Landing Page'),
  async () => {
    const mockedQueryEditorStore =
      TEST__provideMockedTemplateQueryPromotionReviewerStore();
    const projectData = {
      id: 'PROD-2024',
      groupId: 'org.finos.legend.query',
      artifactId: 'legend-query-core-team',
      projectId: 'PROD-2024',
      versions: ['5.0.0'],
      latestVersion: '5.0.0',
    };
    const project = {
      description: 'test project',
      name: 'TestProject',
      projectId: 'PROD-2024',
      webUrl: 'test/',
      latestVersion: '5.0.0',
    };
    const { renderResult } = await TEST__promoteTemplateQueryEditor(
      mockedQueryEditorStore,
      TEST_DATA__promote_template_query_entities,
      projectData,
      project,
      '5.0.0',
      'e2110f5f-6ce7-4d87-a2e7-1f5b6e16f5e1',
      'DataSpaceQuery',
      'domain::COVIDDatapace',
    );
    // console.log(renderResult.baseElement.innerHTML);
    // console.log(renderResult.container.innerHTML);
    // await waitFor(() =>
    //   renderResult.getByText('Promote as Curated Template Query'),
    // );
    await waitFor(() => renderResult.getByText(123));
  },
);
