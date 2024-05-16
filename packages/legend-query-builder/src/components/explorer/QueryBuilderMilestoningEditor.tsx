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

import { observer } from 'mobx-react-lite';
import type { QueryBuilderState } from '../../stores/QueryBuilderState.js';
import { useCallback } from 'react';
import {
  type ValueSpecification,
  type VariableExpression,
  GenericType,
  GenericTypeExplicitReference,
  observe_PrimitiveInstanceValue,
  PrimitiveInstanceValue,
  PRIMITIVE_TYPE,
  PrimitiveType,
  MILESTONING_END_DATE_PARAMETER_NAME,
  MILESTONING_START_DATE_PARAMETER_NAME,
} from '@finos/legend-graph';
import { guaranteeNonNullable } from '@finos/legend-shared';
import { useDrop } from 'react-dnd';
import {
  Dialog,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterButton,
  ModalHeader,
  PanelEntryDropZonePlaceholder,
  PanelFormBooleanField,
  PanelFormSection,
} from '@finos/legend-art';
import { generateDefaultValueForPrimitiveType } from '../../stores/QueryBuilderValueSpecificationHelper.js';
import {
  BasicValueSpecificationEditor,
  type QueryBuilderVariableDragSource,
  QUERY_BUILDER_VARIABLE_DND_TYPE,
} from '../shared/BasicValueSpecificationEditor.js';
import { instanceValue_setValues } from '../../stores/shared/ValueSpecificationModifierHelper.js';
import { VariableSelector } from '../shared/QueryBuilderVariableSelector.js';

const MilestoningParameterEditor = observer(
  (props: {
    queryBuilderState: QueryBuilderState;
    parameter: ValueSpecification;
    setParameter: (val: ValueSpecification) => void;
  }) => {
    const { queryBuilderState, parameter, setParameter } = props;
    const handleDrop = useCallback(
      (item: QueryBuilderVariableDragSource): void => {
        setParameter(item.variable);
      },
      [setParameter],
    );
    const [{ isDragOver }, dropConnector] = useDrop<
      QueryBuilderVariableDragSource,
      void,
      { isDragOver: boolean }
    >(
      () => ({
        accept: [QUERY_BUILDER_VARIABLE_DND_TYPE],
        drop: (item, monitor): void => {
          if (!monitor.didDrop()) {
            handleDrop(item);
          }
        },
        collect: (monitor): { isDragOver: boolean } => ({
          isDragOver: monitor.isOver({
            shallow: true,
          }),
        }),
      }),
      [handleDrop],
    );
    const resetMilestoningParameter = (): void => {
      const param = observe_PrimitiveInstanceValue(
        new PrimitiveInstanceValue(
          GenericTypeExplicitReference.create(
            new GenericType(PrimitiveType.STRICTDATE),
          ),
        ),
        queryBuilderState.observerContext,
      );
      instanceValue_setValues(
        param,
        [generateDefaultValueForPrimitiveType(PRIMITIVE_TYPE.STRICTDATE)],
        queryBuilderState.observerContext,
      );
      setParameter(param);
    };

    return (
      <div ref={dropConnector} className="query-builder__variable-editor">
        <PanelEntryDropZonePlaceholder
          isDragOver={isDragOver}
          label="Change Milestoning Parameter Value"
        >
          <BasicValueSpecificationEditor
            valueSpecification={parameter}
            graph={queryBuilderState.graphManagerState.graph}
            obseverContext={queryBuilderState.observerContext}
            setValueSpecification={(val: ValueSpecification): void =>
              setParameter(val)
            }
            typeCheckOption={{
              expectedType: PrimitiveType.DATE,
            }}
            resetValue={resetMilestoningParameter}
            isConstant={queryBuilderState.constantState.isValueSpecConstant(
              parameter,
            )}
          />
        </PanelEntryDropZonePlaceholder>
      </div>
    );
  },
);

const BiTemporalMilestoningEditor = observer(
  (props: {
    queryBuilderState: QueryBuilderState;
    settingOptions?: {
      businessDate: ValueSpecification | undefined;
      setBusinessDate: (val: ValueSpecification) => void;
      processingDate: ValueSpecification | undefined;
      setProcessingDate: (val: ValueSpecification) => void;
    };
  }) => {
    const { queryBuilderState, settingOptions } = props;
    return (
      <>
        <PanelFormSection>
          <div className="panel__content__form__section__header__label">
            Processing Date
          </div>
          <MilestoningParameterEditor
            queryBuilderState={queryBuilderState}
            parameter={guaranteeNonNullable(
              settingOptions
                ? settingOptions.processingDate
                : queryBuilderState.milestoningState.processingDate,
            )}
            setParameter={(val: ValueSpecification): void =>
              settingOptions
                ? settingOptions.setProcessingDate(val)
                : queryBuilderState.milestoningState.setProcessingDate(val)
            }
          />
        </PanelFormSection>
        <PanelFormSection>
          <div className="panel__content__form__section__header__label">
            Business Date
          </div>
          <MilestoningParameterEditor
            queryBuilderState={queryBuilderState}
            parameter={guaranteeNonNullable(
              settingOptions
                ? settingOptions.businessDate
                : queryBuilderState.milestoningState.businessDate,
            )}
            setParameter={(val: ValueSpecification): void =>
              settingOptions
                ? settingOptions.setBusinessDate(val)
                : queryBuilderState.milestoningState.setBusinessDate(val)
            }
          />
        </PanelFormSection>
      </>
    );
  },
);

const BusinessTemporalMilestoningEditor = observer(
  (props: {
    queryBuilderState: QueryBuilderState;
    settingOptions?: {
      businessDate: ValueSpecification | undefined;
      setBusinessDate: (val: ValueSpecification) => void;
    };
  }) => {
    const { queryBuilderState, settingOptions } = props;

    return (
      <PanelFormSection>
        <div className="panel__content__form__section__header__label">
          Business Date
        </div>
        <MilestoningParameterEditor
          key="BusinessDate"
          queryBuilderState={queryBuilderState}
          parameter={guaranteeNonNullable(
            settingOptions
              ? settingOptions.businessDate
              : queryBuilderState.milestoningState.businessDate,
          )}
          setParameter={(val: ValueSpecification): void =>
            settingOptions
              ? settingOptions.setBusinessDate(val)
              : queryBuilderState.milestoningState.setBusinessDate(val)
          }
        />
      </PanelFormSection>
    );
  },
);

const ProcessingTemporalMilestoningEditor = observer(
  (props: {
    queryBuilderState: QueryBuilderState;
    settingOptions?: {
      processingDate: ValueSpecification | undefined;
      setProcessingDate: (val: ValueSpecification) => void;
    };
  }) => {
    const { queryBuilderState, settingOptions } = props;
    return (
      <PanelFormSection>
        <div className="panel__content__form__section__header__label">
          Processing Date
        </div>
        <MilestoningParameterEditor
          key="BusinessDate"
          queryBuilderState={queryBuilderState}
          parameter={guaranteeNonNullable(
            settingOptions
              ? settingOptions.processingDate
              : queryBuilderState.milestoningState.processingDate,
          )}
          setParameter={(val: ValueSpecification): void =>
            settingOptions
              ? settingOptions.setProcessingDate(val)
              : queryBuilderState.milestoningState.setProcessingDate(val)
          }
        />
      </PanelFormSection>
    );
  },
);

const TemporalMilestoningEditor: React.FC<{
  queryBuilderState: QueryBuilderState;
  settingOptions?: {
    businessDate: ValueSpecification | undefined;
    setBusinessDate: (val: ValueSpecification) => void;
    processingDate: ValueSpecification | undefined;
    setProcessingDate: (val: ValueSpecification) => void;
  };
}> = (props) => {
  const { queryBuilderState, settingOptions } = props;
  const processingDate = settingOptions
    ? settingOptions.processingDate
    : queryBuilderState.milestoningState.processingDate;
  const businessDate = settingOptions
    ? settingOptions.businessDate
    : queryBuilderState.milestoningState.businessDate;

  if (processingDate && businessDate) {
    return (
      <BiTemporalMilestoningEditor queryBuilderState={queryBuilderState} />
    );
  } else if (businessDate) {
    return (
      <BusinessTemporalMilestoningEditor
        queryBuilderState={queryBuilderState}
      />
    );
  } else if (processingDate) {
    return (
      <ProcessingTemporalMilestoningEditor
        queryBuilderState={queryBuilderState}
      />
    );
  } else {
    return null;
  }
};

const AllVersionsInRangelMilestoningParametersEditor = observer(
  (props: {
    queryBuilderState: QueryBuilderState;
    settingOptions?: {
      startDate: ValueSpecification | undefined;
      setStartDate: (val: ValueSpecification) => void;
      endDate: ValueSpecification | undefined;
      setEndDate: (val: ValueSpecification) => void;
    };
  }) => {
    const { queryBuilderState, settingOptions } = props;

    return (
      <div className="query-builder__milestoning-panel__all-versions-in-range-editor">
        <PanelFormSection>
          <div className="panel__content__form__section__header__label">
            Start Date
          </div>
          <MilestoningParameterEditor
            queryBuilderState={queryBuilderState}
            parameter={guaranteeNonNullable(
              settingOptions
                ? settingOptions.startDate
                : queryBuilderState.milestoningState.startDate,
            )}
            setParameter={
              settingOptions
                ? settingOptions.setStartDate
                : queryBuilderState.milestoningState.setStartDate
            }
          />
        </PanelFormSection>
        <PanelFormSection>
          <div className="panel__content__form__section__header__label">
            End Date
          </div>
          <MilestoningParameterEditor
            queryBuilderState={queryBuilderState}
            parameter={guaranteeNonNullable(
              settingOptions
                ? settingOptions.endDate
                : queryBuilderState.milestoningState.endDate,
            )}
            setParameter={
              settingOptions
                ? settingOptions.setEndDate
                : queryBuilderState.milestoningState.setEndDate
            }
          />
        </PanelFormSection>
      </div>
    );
  },
);

export const MilestoningParametersEditorContent = observer(
  (props: {
    queryBuilderState: QueryBuilderState;
    settingOptions?: {
      businessDate: ValueSpecification | undefined;
      setBusinessDate: (val: ValueSpecification | undefined) => void;
      processingDate: ValueSpecification | undefined;
      setProcessingDate: (val: ValueSpecification | undefined) => void;
      isAllVersionsEnabled: boolean;
      setIsAllVersionsEnabled: (val: boolean) => void;
      isAllVersionsInRangeEnabled: boolean;
      setIsAllVersionsInRangeEnabled: (val: boolean) => void;
      startDate: ValueSpecification | undefined;
      setStartDate: (val: ValueSpecification) => void;
      endDate: ValueSpecification | undefined;
      setEndDate: (val: ValueSpecification) => void;
    };
  }) => {
    const { queryBuilderState, settingOptions } = props;
    const milestoningState = queryBuilderState.milestoningState;
    const isCompatibleMilestoningParameter = (
      variable: VariableExpression,
    ): boolean =>
      variable.genericType?.value.rawType.name === PRIMITIVE_TYPE.STRICTDATE ||
      variable.genericType?.value.rawType.name === PRIMITIVE_TYPE.LATESTDATE ||
      variable.genericType?.value.rawType.name === PRIMITIVE_TYPE.DATE ||
      variable.genericType?.value.rawType.name === PRIMITIVE_TYPE.DATETIME;

    const isAllVersionsEnabled = settingOptions
      ? settingOptions.isAllVersionsEnabled
      : milestoningState.isAllVersionsEnabled;

    const isAllVersionsInRangeEnabled = settingOptions
      ? settingOptions.isAllVersionsInRangeEnabled
      : milestoningState.isAllVersionsInRangeEnabled;

    return (
      <>
        {milestoningState.isCurrentClassMilestoned && (
          <PanelFormBooleanField
            isReadOnly={false}
            value={isAllVersionsEnabled}
            name="all Versions"
            prompt="Query All Milestoned Versions of the Root Class"
            update={(value: boolean | undefined): void => {
              if (settingOptions) {
                settingOptions.setIsAllVersionsEnabled(Boolean(value));
                settingOptions.setBusinessDate(undefined);
                settingOptions.setProcessingDate(undefined);
                milestoningState.clearGetAllParameters();
              } else {
                milestoningState.setAllVersions(value);
              }
            }}
          />
        )}
        {isAllVersionsEnabled &&
          milestoningState.isCurrentClassSupportsVersionsInRange && (
            <>
              <PanelFormBooleanField
                isReadOnly={false}
                value={isAllVersionsInRangeEnabled}
                name=" All Versions In Range"
                prompt="Optionally apply a date range to get All Versions for"
                update={(value: boolean | undefined): void => {
                  if (settingOptions) {
                    settingOptions.setIsAllVersionsInRangeEnabled(
                      Boolean(value),
                    );
                    settingOptions.setStartDate(
                      queryBuilderState.milestoningState.buildMilestoningParameter(
                        MILESTONING_START_DATE_PARAMETER_NAME,
                      ),
                    );
                    settingOptions.setEndDate(
                      queryBuilderState.milestoningState.buildMilestoningParameter(
                        MILESTONING_END_DATE_PARAMETER_NAME,
                      ),
                    );
                  } else {
                    milestoningState.setAllVersionsInRange(value);
                  }
                }}
              />
              {isAllVersionsInRangeEnabled && (
                <>
                  {settingOptions ? (
                    <AllVersionsInRangelMilestoningParametersEditor
                      queryBuilderState={queryBuilderState}
                      settingOptions={{
                        startDate: settingOptions.startDate,
                        setStartDate: settingOptions.setStartDate,
                        endDate: settingOptions.endDate,
                        setEndDate: settingOptions.setEndDate,
                      }}
                    />
                  ) : (
                    <AllVersionsInRangelMilestoningParametersEditor
                      queryBuilderState={queryBuilderState}
                    />
                  )}
                </>
              )}
            </>
          )}
        {settingOptions ? (
          <TemporalMilestoningEditor
            queryBuilderState={queryBuilderState}
            settingOptions={{
              businessDate: settingOptions.businessDate,
              setBusinessDate: settingOptions.setBusinessDate,
              processingDate: settingOptions.processingDate,
              setProcessingDate: settingOptions.setProcessingDate,
            }}
          />
        ) : (
          <TemporalMilestoningEditor queryBuilderState={queryBuilderState} />
        )}
        <PanelFormSection>
          <div className="panel__content__form__section__header__label">
            List of compatible milestoning parameters
          </div>
        </PanelFormSection>
        <div className="panel__content__form__section__list__items">
          <VariableSelector
            queryBuilderState={queryBuilderState}
            filterBy={isCompatibleMilestoningParameter}
          />
        </div>
      </>
    );
  },
);

export const MilestoningParametersEditor = observer(
  (props: { queryBuilderState: QueryBuilderState }) => {
    const { queryBuilderState } = props;
    const applicationStore = queryBuilderState.applicationStore;
    const milestoningState = queryBuilderState.milestoningState;
    const close = (): void => milestoningState.setShowMilestoningEditor(false);
    return (
      <Dialog
        open={milestoningState.showMilestoningEditor}
        onClose={close}
        classes={{
          root: 'editor-modal__root-container',
          container: 'editor-modal__container',
          paper: 'editor-modal__content',
        }}
      >
        <Modal
          darkMode={
            !applicationStore.layoutService.TEMPORARY__isLightColorThemeEnabled
          }
          className="editor-modal query-builder__variables__modal"
        >
          <ModalHeader title="Milestoning Parameters" />
          <ModalBody className="query-builder__variables__modal__body">
            <MilestoningParametersEditorContent
              queryBuilderState={queryBuilderState}
            />
          </ModalBody>
          <ModalFooter>
            <ModalFooterButton text="Close" onClick={close} type="secondary" />
          </ModalFooter>
        </Modal>
      </Dialog>
    );
  },
);
