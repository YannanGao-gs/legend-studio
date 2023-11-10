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
  type SnowflakeApp,
  type PackageableConnection,
  ConnectionPointer,
  InMemoryGraphData,
  PackageableElementExplicitReference,
  SnowflakeAppDeploymentConfiguration,
  observe_SnowflakeAppDeploymentConfiguration,
} from '@finos/legend-graph';
import {
  ActionState,
  assertErrorThrown,
  type GeneratorFn,
} from '@finos/legend-shared';
import { makeObservable, action, flow, observable } from 'mobx';
import type { EditorStore } from '../../../EditorStore.js';
import { ElementEditorState } from '../ElementEditorState.js';

export class SnowflakeAppFunctionActivatorEdtiorState extends ElementEditorState {
  readonly activator: SnowflakeApp;
  readonly validateState = ActionState.create();
  readonly deployState = ActionState.create();

  constructor(editorStore: EditorStore, element: SnowflakeApp) {
    super(editorStore, element);

    makeObservable(this, {
      activator: observable,
      reprocess: action,
      updateOwner: action,
      updateAppDescription: action,
      updateApplicationName: action,
      updateConnection: action,
      validate: flow,
      deploy: flow,
    });

    this.activator = element;
  }

  updateConnection(val: PackageableConnection): void {
    if (!this.activator.activationConfiguration) {
      this.activator.activationConfiguration =
        new SnowflakeAppDeploymentConfiguration();
    }
    (
      this.activator
        .activationConfiguration as SnowflakeAppDeploymentConfiguration
    ).activationConnection = new ConnectionPointer(
      PackageableElementExplicitReference.create(val),
    );
    observe_SnowflakeAppDeploymentConfiguration(
      this.activator
        .activationConfiguration as SnowflakeAppDeploymentConfiguration,
    );
  }

  updateOwner(val: string): void {
    this.activator.owner = val;
  }

  updateApplicationName(val: string): void {
    this.activator.applicationName = val;
  }

  updateAppDescription(val: string): void {
    this.activator.description = val;
  }

  *validate(): GeneratorFn<void> {
    this.validateState.inProgress();
    try {
      yield this.editorStore.graphManagerState.graphManager.validateFunctionActivator(
        this.activator,
        new InMemoryGraphData(this.editorStore.graphManagerState.graph),
      );
      this.editorStore.applicationStore.notificationService.notifySuccess(
        `Function activator is valid`,
      );
    } catch (error) {
      assertErrorThrown(error);
      this.editorStore.applicationStore.notificationService.notifyError(error);
    } finally {
      this.validateState.complete();
    }
  }

  *deploy(): GeneratorFn<void> {
    this.deployState.inProgress();
    try {
      yield this.editorStore.graphManagerState.graphManager.publishFunctionActivatorToSandbox(
        this.activator,
        new InMemoryGraphData(this.editorStore.graphManagerState.graph),
      );
    } catch (error) {
      assertErrorThrown(error);
      this.editorStore.applicationStore.notificationService.notifyError(error);
    } finally {
      this.deployState.complete();
    }
  }

  reprocess(
    newElement: SnowflakeApp,
    editorStore: EditorStore,
  ): SnowflakeAppFunctionActivatorEdtiorState {
    return new SnowflakeAppFunctionActivatorEdtiorState(
      editorStore,
      newElement,
    );
  }
}
