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
  AbstractPlugin,
  type AbstractPluginManager,
} from '../application/AbstractPluginManager.js';

export interface QueryBuilderPluginManager extends AbstractPluginManager {
  getQueryBuilderPlugins(): QueryBuilderPlugin[];
  registerQueryBuilderPlugin(plugin: QueryBuilderPlugin): void;
}

export type AdvancedMenuEditorRenderer = (
  isReadOnly: boolean,
) => React.ReactNode | undefined;

export abstract class QueryBuilderPlugin extends AbstractPlugin {
  install(pluginManager: QueryBuilderPluginManager): void {
    pluginManager.registerQueryBuilderPlugin(this);
  }

  /**
   * Get the list of options for the advanced menu
   */
  abstract getExtraAdvancedMenuClassifiers(): string[];

  /**
   * Get the list of renderers for the editor for the advanced menu
   */
  abstract getExtraAdvancedMenuEditorRenderers(): AdvancedMenuEditorRenderer[];
}
