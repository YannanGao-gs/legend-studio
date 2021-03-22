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

/**
 * This stub transition is used when we need to disable transition for `material-ui` components
 * See https://stackoverflow.com/questions/61139778/react-material-ui-tooltips-disable-animation
 */
export const StubTransition: React.FC<{
  children?: React.ReactElement;
}> = (props) => props.children ?? null;
