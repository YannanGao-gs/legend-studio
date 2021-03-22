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

import { observable, action, computed, makeObservable } from 'mobx';
import {
  hashArray,
  IllegalStateError,
  addUniqueEntry,
  deleteEntry,
} from '@finos/legend-studio-shared';
import type { Hashable } from '@finos/legend-studio-shared';
import { CORE_HASH_STRUCTURE } from '../../../../../MetaModelConst';
import type { ClassView } from './ClassView';
import type { PropertyView } from './PropertyView';
import type { PackageableElementVisitor } from '../../../model/packageableElements/PackageableElement';
import { PackageableElement } from '../../../model/packageableElements/PackageableElement';
import type { GeneralizationView } from './GeneralizationView';
import type { AssociationView } from './AssociationView';

export class Diagram extends PackageableElement implements Hashable {
  classViews: ClassView[] = [];
  associationViews: AssociationView[] = [];
  generalizationViews: GeneralizationView[] = [];
  propertyViews: PropertyView[] = [];

  constructor(name: string) {
    super(name);

    makeObservable(this, {
      classViews: observable,
      associationViews: observable,
      generalizationViews: observable,
      propertyViews: observable,
      setClassViews: action,
      addClassView: action,
      deleteClassView: action,
      setAssociationViews: action,
      deleteAssociationView: action,
      setGeneralizationViews: action,
      addGeneralizationView: action,
      deleteGeneralizationView: action,
      setPropertyViews: action,
      addPropertyView: action,
      deletePropertyView: action,
      hashCode: computed({ keepAlive: true }),
    });
  }

  setClassViews(val: ClassView[]): void {
    this.classViews = val;
  }
  addClassView(val: ClassView): void {
    addUniqueEntry(this.classViews, val);
  }
  deleteClassView(val: ClassView): void {
    deleteEntry(this.classViews, val);
  }
  setAssociationViews(val: AssociationView[]): void {
    this.associationViews = val;
  }
  deleteAssociationView(val: AssociationView): void {
    deleteEntry(this.associationViews, val);
  }
  setGeneralizationViews(val: GeneralizationView[]): void {
    this.generalizationViews = val;
  }
  addGeneralizationView(val: GeneralizationView): void {
    addUniqueEntry(this.generalizationViews, val);
  }
  deleteGeneralizationView(val: GeneralizationView): void {
    deleteEntry(this.generalizationViews, val);
  }
  setPropertyViews(val: PropertyView[]): void {
    this.propertyViews = val;
  }
  addPropertyView(val: PropertyView): void {
    addUniqueEntry(this.propertyViews, val);
  }
  deletePropertyView(val: PropertyView): void {
    deleteEntry(this.propertyViews, val);
  }

  getClassView = (sourceViewId: string): ClassView | undefined =>
    this.classViews.find((c) => c.id === sourceViewId);

  get hashCode(): string {
    if (this._isDisposed) {
      throw new IllegalStateError(`Element '${this.path}' is already disposed`);
    }
    if (this._isImmutable) {
      throw new IllegalStateError(
        `Readonly element '${this.path}' is modified`,
      );
    }
    return hashArray([
      CORE_HASH_STRUCTURE.DIAGRAM,
      super.hashCode,
      hashArray(this.classViews),
      // TODO: association views
      hashArray(this.generalizationViews),
      hashArray(this.propertyViews),
    ]);
  }

  accept_PackageableElementVisitor<T>(
    visitor: PackageableElementVisitor<T>,
  ): T {
    return visitor.visit_Diagram(this);
  }
}
