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
  createModelSchema,
  custom,
  deserialize,
  list,
  optional,
  primitive,
  serialize,
} from 'serializr';
import { V1_GenericType } from '../../../model/packageableElements/type/V1_GenericType.js';
import { V1_PackageableType } from '../../../model/valueSpecification/raw/V1_PackageableElementPtr.js';
import type { V1_Type } from '../../../model/packageableElements/type/V1_Type.js';
import {
  customList,
  isString,
  UnsupportedOperationError,
  usingConstantValueSchema,
  type PlainObject,
} from '@finos/legend-shared';
import { V1_Multiplicity } from '../../../model/packageableElements/domain/V1_Multiplicity.js';
import { V1_multiplicityModelSchema } from './V1_CoreSerializationHelper.js';
import { matchFunctionName } from '../../../../../../../graph/MetaModelUtils.js';
import { CORE_PURE_PATH } from '../../../../../../../graph/MetaModelConst.js';
import {
  V1_RawGenricType,
  V1_RawRawType,
} from '../../../model/rawValueSpecification/V1_RawVariable.js';

export enum V1_Type_Type {
  PackageableType = 'packageableType',
  RelationType = 'relationType',
}

export const V1_PackageableTypeSchema = createModelSchema(V1_PackageableType, {
  _type: usingConstantValueSchema(V1_Type_Type.PackageableType),
  fullPath: primitive(),
});

export function V1_deserializeType(json: PlainObject<V1_Type>): V1_Type {
  switch (json._type) {
    case V1_Type_Type.PackageableType:
      return deserialize(V1_PackageableTypeSchema, json);
    default:
      throw new UnsupportedOperationError(
        `Can't deserialize v1 type: '${json._type}'`,
      );
  }
}

export function V1_serializeType(json: V1_Type): PlainObject<V1_Type> {
  if (json instanceof V1_PackageableType) {
    return serialize(V1_PackageableTypeSchema, json);
  }

  throw new UnsupportedOperationError(`Can't deserialize v1_type'`);
}

export const V1_GenericTypeModelSchema = createModelSchema(V1_GenericType, {
  multiplicityArguments: customList(
    (val: V1_Multiplicity) => serialize(V1_multiplicityModelSchema, val),
    (val) => deserialize(V1_multiplicityModelSchema, val),
    {
      INTERNAL__forceReturnEmptyInTest: true,
    },
  ),
  rawType: custom(
    (val) => V1_serializeType(val),
    (val) => V1_deserializeType(val),
  ),
  typeVariableValues: optional(list(primitive())),
  typeArguments: optional(list(primitive())),
});

export const V1_deserializeGenericType = (
  val: PlainObject<V1_GenericType> | string,
  customResult?: boolean,
): V1_GenericType => {
  // backward compatible
  if (isString(val)) {
    const genericType = new V1_GenericType();
    const packageableType = new V1_PackageableType();
    packageableType.fullPath = val;
    genericType.rawType = packageableType;
    if (customResult && matchFunctionName(val, CORE_PURE_PATH.TABULAR_RESULT)) {
      genericType.multiplicityArguments = [new V1_Multiplicity(1, undefined)];
      const _anytype = new V1_PackageableType();
      _anytype.fullPath = CORE_PURE_PATH.ANY;
      const arGenType = new V1_GenericType();
      arGenType.rawType = _anytype;
      genericType.typeArguments = [arGenType];
    }
    return genericType;
  }
  return deserialize(V1_GenericTypeModelSchema, val);
};

export const V1_RawRawTypeSchemaModel = createModelSchema(V1_RawRawType, {
  fullPath: primitive(),
});

export const V1_RawGenricTypeSchemaModel = createModelSchema(V1_RawGenricType, {
  rawType: usingConstantValueSchema(V1_RawRawTypeSchemaModel),
});

export const V1_deserializeRawGenericType = (
  val: PlainObject<V1_GenericType> | string,
): V1_RawGenricType => {
  // backward compatible
  if (isString(val)) {
    const genericType = new V1_RawGenricType();
    const packageableType = new V1_RawRawType();
    packageableType.fullPath = val;
    genericType.rawType = packageableType;
    return genericType;
  }
  return deserialize(V1_RawGenricTypeSchemaModel, val);
};
