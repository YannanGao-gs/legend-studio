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
  IllegalStateError,
  assertType,
  isNonNullable,
  getClass,
  addUniqueEntry,
} from '@finos/legend-studio-shared';
import type { TreeData, TreeNodeData } from '@finos/legend-studio-components';
import type { Type } from '../../models/metamodels/pure/model/packageableElements/domain/Type';
import { Enumeration } from '../../models/metamodels/pure/model/packageableElements/domain/Enumeration';
import { Property } from '../../models/metamodels/pure/model/packageableElements/domain/Property';
import {
  Class,
  CLASS_PROPERTY_TYPE,
  getClassPropertyType,
} from '../../models/metamodels/pure/model/packageableElements/domain/Class';
import type { RawGraphFetchTree } from '../../models/metamodels/pure/model/rawValueSpecification/RawGraphFetchTree';
import {
  RawPropertyGraphFetchTree,
  RawRootGraphFetchTree,
} from '../../models/metamodels/pure/model/rawValueSpecification/RawGraphFetchTree';
import {
  OptionalPackageableElementExplicitReference,
  PackageableElementExplicitReference,
} from '../../models/metamodels/pure/model/packageableElements/PackageableElementReference';
import { PropertyExplicitReference } from '../../models/metamodels/pure/model/packageableElements/domain/PropertyReference';
import type { Mapping } from '../../models/metamodels/pure/model/packageableElements/mapping/Mapping';
import type { SetImplementation } from '../../models/metamodels/pure/model/packageableElements/mapping/SetImplementation';
import type { AbstractProperty } from '../../models/metamodels/pure/model/packageableElements/domain/AbstractProperty';
import { DerivedProperty } from '../../models/metamodels/pure/model/packageableElements/domain/DerivedProperty';
import type { PropertyMapping } from '../../models/metamodels/pure/model/packageableElements/mapping/PropertyMapping';
import type { EditorStore } from '../EditorStore';

export class RawGraphFetchTreeNodeData implements TreeNodeData {
  isSelected: boolean | undefined;
  isOpen: boolean | undefined;
  id: string;
  label: string;
  childrenIds: string[] = [];
  type: Type;
  subType?: Class;
  parentId?: string;
  isChecked: boolean;
  isTraversed: () => boolean;
  graphFetchTreeNode: RawGraphFetchTree;
  mapped: boolean;
  setImpl?: SetImplementation;

  constructor(
    id: string,
    label: string,
    type: Type,
    subType: Class | undefined,
    parentId: string | undefined,
    isChecked: boolean,
    isTraversed: () => boolean,
    graphFetchTreeNode: RawGraphFetchTree,
    mapped: boolean,
    setImpl: SetImplementation | undefined,
  ) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.subType = subType;
    this.parentId = parentId;
    this.isChecked = isChecked;
    this.isTraversed = isTraversed;
    this.graphFetchTreeNode = graphFetchTreeNode;
    this.mapped = mapped;
    this.setImpl = setImpl;
  }
}

export class RootGraphFetchTreeNodeData extends RawGraphFetchTreeNodeData {
  declare graphFetchTreeNode: RawRootGraphFetchTree;
}

const GRAPH_FETCH_TREE_ROOT_ID = 'GRAPH_FETCH_TREE_ROOT_ID';

const resolveSetImplementationForPropertyMapping = (
  propertyMapping: PropertyMapping,
): SetImplementation | undefined => {
  if (propertyMapping.isEmbedded) {
    return (propertyMapping as unknown) as SetImplementation;
  } else if (propertyMapping.targetSetImplementation) {
    return propertyMapping.targetSetImplementation;
  }
  return undefined;
};

const getPropertyMappedData = (
  editorStore: EditorStore,
  property: AbstractProperty,
  parentNode: RawGraphFetchTreeNodeData,
): { mapped: boolean; setImpl?: SetImplementation } => {
  // For now, derived properties will be considered mapped if its parent class is mapped.
  // TODO: we probably need to do complex analytics such as to drill down into the body of the derived properties to see if each properties being used are
  // mapped to determine if the dervied property itself is considered mapped.
  if (property instanceof DerivedProperty) {
    return { mapped: parentNode.mapped };
  } else if (property instanceof Property) {
    const parentSetImplementation = parentNode.setImpl;
    if (parentSetImplementation) {
      const propertyMappings = editorStore.graphState.getMappingElementPropertyMappings(
        parentSetImplementation,
      );
      const mappedProperties = propertyMappings
        .filter((p) => !p.isStub)
        .map((p) => p.property.value.name);
      // check if property is mapped
      if (mappedProperties.includes(property.name)) {
        const type = property.genericType.value.rawType;
        const propertyType = getClassPropertyType(type);
        // if class we need to resolve the Set Implementation
        if (propertyType === CLASS_PROPERTY_TYPE.CLASS) {
          const propertyMapping = propertyMappings.find(
            (p) => p.property.value.name === property.name,
          );
          if (propertyMapping) {
            return {
              mapped: true,
              setImpl: resolveSetImplementationForPropertyMapping(
                propertyMapping,
              ),
            };
          }
        }
        return { mapped: true };
      }
    }
  }
  return { mapped: false };
};

export const getRawPropertyGraphFetchTreeNodeData = (
  editorStore: EditorStore,
  property: Property,
  subType: Class | undefined,
  parent: RawGraphFetchTreeNodeData,
): RawGraphFetchTreeNodeData => {
  assertType(
    parent.type,
    Class,
    `Type of parent node for class property node must be 'class'`,
  );
  const mappingData = getPropertyMappedData(editorStore, property, parent);
  const existingPropertyGraphFetchNode = parent.graphFetchTreeNode.subTrees.find(
    (subTree) =>
      subTree instanceof RawPropertyGraphFetchTree &&
      subTree.property.value === property &&
      subTree.subType.value === subType,
  );
  const newPropertyGraphFetchNode = new RawPropertyGraphFetchTree(
    PropertyExplicitReference.create(property),
  ).withSubType(
    OptionalPackageableElementExplicitReference.create<Class>(undefined),
  );
  newPropertyGraphFetchNode.subType.setValue(subType);
  const propertyGraphFetchNode =
    existingPropertyGraphFetchNode ?? newPropertyGraphFetchNode;
  const propertyNode = new RawGraphFetchTreeNodeData(
    `${parent.id}.${property.name}${subType ? subType.path : ''}`,
    property.name,
    property.genericType.value.rawType,
    subType,
    parent.id,
    Boolean(existingPropertyGraphFetchNode),
    (): boolean => Boolean(propertyGraphFetchNode.subTrees.length),
    propertyGraphFetchNode,
    mappingData.mapped,
    mappingData.setImpl,
  );
  const propertyType = subType ?? property.genericType.value.rawType;
  if (propertyType instanceof Class) {
    propertyNode.childrenIds = propertyType
      .getAllProperties()
      .map((p) => `${propertyNode.id}.${p.name}`);
  }
  return propertyNode;
};

export interface RawGraphFetchTreeData
  extends TreeData<RawGraphFetchTreeNodeData> {
  root: RootGraphFetchTreeNodeData;
}

export const getRawGraphFetchTreeData = (
  editorStore: EditorStore,
  type: Type,
  mapping?: Mapping,
): RawGraphFetchTreeData => {
  const rootIds: string[] = [];
  const nodes = new Map<string, RawGraphFetchTreeNodeData>();
  if (type instanceof Class) {
    const rootGraphFetchTreeNode = new RawRootGraphFetchTree(
      PackageableElementExplicitReference.create(type),
    );
    const treeRootNode = new RootGraphFetchTreeNodeData(
      GRAPH_FETCH_TREE_ROOT_ID,
      type.name,
      type,
      undefined,
      undefined,
      true,
      (): boolean => Boolean(rootGraphFetchTreeNode.subTrees.length),
      rootGraphFetchTreeNode,
      true,
      mapping?.getRootSetImplementation(type),
    );
    treeRootNode.isOpen = true;
    nodes.set(treeRootNode.id, treeRootNode);
    addUniqueEntry(rootIds, treeRootNode.id);
    // TODO: as of right now we haven't supported subtype casting for deep/graph fetch tree but if we do, we just need to
    // treat them as property nodes so for example `Account` has props `name` and subtypes `SpecialAccount`
    // the tree algorithm should show 2 children for `Account`
    type
      .getAllProperties()
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort(
        (a, b) =>
          (b instanceof Class ? 2 : b instanceof Enumeration ? 1 : 0) -
          (a instanceof Class ? 2 : a instanceof Enumeration ? 1 : 0),
      )
      .forEach((property) => {
        const propertyTreeNodeData = getRawPropertyGraphFetchTreeNodeData(
          editorStore,
          property,
          undefined,
          treeRootNode,
        );
        addUniqueEntry(treeRootNode.childrenIds, propertyTreeNodeData.id);
        nodes.set(propertyTreeNodeData.id, propertyTreeNodeData);
        const propertyType = property.genericType.value.rawType;
        if (propertyType instanceof Class) {
          propertyType.allSubClasses
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((subClass) => {
              const nodeData = getRawPropertyGraphFetchTreeNodeData(
                editorStore,
                property,
                subClass,
                treeRootNode,
              );
              addUniqueEntry(treeRootNode.childrenIds, nodeData.id);
              nodes.set(nodeData.id, nodeData);
            });
        }
      });
    return { rootIds, nodes, root: treeRootNode };
  } else {
    throw new IllegalStateError(
      `Can't create graph fetch tree for node type other than 'Class'. Got type '${
        getClass(type).name
      }'`,
    );
  }
};

const walkPropertySubTreeAndBuild = (
  editorStore: EditorStore,
  property: Property,
  subType: Class | undefined,
  parent: RawGraphFetchTreeNodeData,
  nodes: Map<string, RawGraphFetchTreeNodeData>,
): RawGraphFetchTreeNodeData => {
  const existingPropertyGraphFetchNode = parent.graphFetchTreeNode.subTrees.find(
    (subTree) =>
      subTree instanceof RawPropertyGraphFetchTree &&
      subTree.property.value === property &&
      subTree.subType.value === subType,
  );
  const newPropertyGraphFetchNode = new RawPropertyGraphFetchTree(
    PropertyExplicitReference.create(property),
  ).withSubType(
    OptionalPackageableElementExplicitReference.create<Class>(undefined),
  );
  newPropertyGraphFetchNode.subType.setValue(subType);
  const propertyGraphFetchNode =
    existingPropertyGraphFetchNode ?? newPropertyGraphFetchNode;
  const mappingData = getPropertyMappedData(editorStore, property, parent);
  const propertyNode = new RawGraphFetchTreeNodeData(
    `${parent.id}.${property.name}${subType ? subType.path : ''}`,
    property.name,
    property.genericType.value.rawType,
    subType,
    parent.id,
    Boolean(existingPropertyGraphFetchNode),
    (): boolean => Boolean(propertyGraphFetchNode.subTrees.length),
    propertyGraphFetchNode,
    mappingData.mapped,
    mappingData.setImpl,
  );
  // walk and build property trees recursively
  const propertyType = subType ?? property.genericType.value.rawType;
  if (propertyType instanceof Class) {
    propertyNode.childrenIds = propertyType
      .getAllProperties()
      .map((p) => `${propertyNode.id}.${p.name}`);
    if (propertyNode.isTraversed()) {
      propertyType
        .getAllProperties()
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort(
          (a, b) =>
            (b instanceof Class ? 2 : b instanceof Enumeration ? 1 : 0) -
            (a instanceof Class ? 2 : a instanceof Enumeration ? 1 : 0),
        )
        .forEach((p) => {
          const pGraphFetchNode = walkPropertySubTreeAndBuild(
            editorStore,
            p,
            undefined,
            propertyNode,
            nodes,
          );
          nodes.set(pGraphFetchNode.id, pGraphFetchNode);
          addUniqueEntry(propertyNode.childrenIds, pGraphFetchNode.id);
        });
    }
  }
  return propertyNode;
};

/**
 * Build graph fetch tree data from an existing graph fetch tree root
 */
export const buildRawGraphFetchTreeData = (
  editorStore: EditorStore,
  rootGraphFetchTree: RawRootGraphFetchTree,
  mapping?: Mapping,
): RawGraphFetchTreeData => {
  const rootIds: string[] = [];
  const nodes = new Map<string, RawGraphFetchTreeNodeData>();
  const treeRootNode = new RootGraphFetchTreeNodeData(
    GRAPH_FETCH_TREE_ROOT_ID,
    rootGraphFetchTree.class.value.name,
    rootGraphFetchTree.class.value,
    undefined,
    undefined,
    true,
    (): boolean => Boolean(rootGraphFetchTree.subTrees.length),
    rootGraphFetchTree,
    true,
    mapping?.getRootSetImplementation(rootGraphFetchTree.class.value),
  );
  treeRootNode.isOpen = true;
  nodes.set(treeRootNode.id, treeRootNode);
  addUniqueEntry(rootIds, treeRootNode.id);
  rootGraphFetchTree.class.value
    .getAllProperties()
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort(
      (a, b) =>
        (b instanceof Class ? 2 : b instanceof Enumeration ? 1 : 0) -
        (a instanceof Class ? 2 : a instanceof Enumeration ? 1 : 0),
    )
    .forEach((property) => {
      const propertyTreeNodeData = walkPropertySubTreeAndBuild(
        editorStore,
        property,
        undefined,
        treeRootNode,
        nodes,
      );
      addUniqueEntry(treeRootNode.childrenIds, propertyTreeNodeData.id);
      nodes.set(propertyTreeNodeData.id, propertyTreeNodeData);
      const propertyType = property.genericType.value.rawType;
      if (propertyType instanceof Class) {
        propertyType.allSubClasses
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((subClass) => {
            const nodeData = walkPropertySubTreeAndBuild(
              editorStore,
              property,
              subClass,
              treeRootNode,
              nodes,
            );
            addUniqueEntry(treeRootNode.childrenIds, nodeData.id);
            nodes.set(nodeData.id, nodeData);
          });
      }
    });
  return { rootIds, nodes, root: treeRootNode };
};

/**
 * Given a node, a graph fetch tree and a mapping, we select (by checking off) all the properties in the node
 * that have been mapped through the root setImplementation class
 */
export const selectMappedGraphFetchProperties = (
  graphFetchTree: RawGraphFetchTreeData,
  node: RawGraphFetchTreeNodeData,
): void => {
  const childNodes = node.childrenIds
    .map((nodeId) => graphFetchTree.nodes.get(nodeId))
    .filter(isNonNullable);
  childNodes.forEach((childNode) => {
    if (childNode.mapped) {
      const isChecking = !childNode.isChecked;
      if (isChecking) {
        let currentNode = childNode;
        while (currentNode.parentId) {
          const parentNode = graphFetchTree.nodes.get(currentNode.parentId);
          if (parentNode) {
            parentNode.graphFetchTreeNode.addSubTree(
              currentNode.graphFetchTreeNode,
            );
            currentNode = parentNode;
          } else {
            break;
          }
        }
      }
      childNode.isChecked = true;
    }
  });
};
