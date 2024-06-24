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

import { hashArray, type Hashable } from '@finos/legend-shared';
import { InstanceValue } from './InstanceValue.js';
import type {
  ValueSpecification,
  ValueSpecificationVisitor,
} from './ValueSpecification.js';
import { CORE_HASH_STRUCTURE } from '../../../Core_HashUtils.js';

export class ColumnSpecification implements Hashable {
  name!: string;
  documentation: string | undefined;

  get hashCode(): string {
    return hashArray([
      CORE_HASH_STRUCTURE.RELATION_COL_SPEC,
      this.name,
      this.documentation ?? '',
    ]);
  }
}

export class BasicColumnSpecification
  extends ColumnSpecification
  implements Hashable
{
  func!: ValueSpecification;

  override get hashCode(): string {
    return hashArray([
      CORE_HASH_STRUCTURE.RELATION_COL_SPEC,
      this.name,
      this.documentation ?? '',
      this.func,
    ]);
  }
}

// export class ColumnSpecificationArrayInstance
//   extends InstanceValue
//   implements Hashable
// {
//   override values: ColumnSpecification[] = [];

//   override get hashCode(): string {
//     return hashArray([
//       CORE_HASH_STRUCTURE.RELATION_COL_SPEC_ARRAY,
//       this.genericType?.ownerReference.valueForSerialization ?? '',
//       this.multiplicity,
//       hashArray(this.values),
//     ]);
//   }
//   override accept_ValueSpecificationVisitor<T>(
//     visitor: ValueSpecificationVisitor<T>,
//   ): T {
//     return visitor.visit_TDSColSpecArrayInstance(this);
//   }
// }
