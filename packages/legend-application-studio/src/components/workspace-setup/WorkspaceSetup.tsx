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

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  clsx,
  AssistantIcon,
  compareLabelFn,
  GitBranchIcon,
  CustomSelectorInput,
  LongArrowRightIcon,
  DividerWithText,
  SearchIcon,
  type MuiCardActionConfig,
  FileImportIcon,
  BaseCard,
} from '@finos/legend-art';
import { LEGEND_STUDIO_TEST_ID } from '../../__lib__/LegendStudioTesting.js';
import {
  type WorkspaceSetupPathParams,
  generateEditorRoute,
  LEGEND_STUDIO_ROUTE_PATTERN_TOKEN,
} from '../../__lib__/LegendStudioNavigation.js';
import { flowResult } from 'mobx';
import { useApplicationNavigationContext } from '@finos/legend-application';
import { useParams } from '@finos/legend-application/browser';
import { LEGEND_STUDIO_DOCUMENTATION_KEY } from '../../__lib__/LegendStudioDocumentation.js';
import { CreateProjectModal } from './CreateProjectModal.js';
import { ActivityBarMenu } from '../editor/ActivityBar.js';
import { LEGEND_STUDIO_APPLICATION_NAVIGATION_CONTEXT_KEY } from '../../__lib__/LegendStudioApplicationNavigationContext.js';
import { CreateWorkspaceModal } from './CreateWorkspaceModal.js';
import {
  useLegendStudioApplicationStore,
  useLegendStudioBaseStore,
} from '../LegendStudioFrameworkProvider.js';
import {
  type ProjectOption,
  buildProjectOption,
  getProjectOptionLabelFormatter,
} from './ProjectSelectorUtils.js';
import {
  type WorkspaceOption,
  buildWorkspaceOption,
  formatWorkspaceOptionLabel,
} from './WorkspaceSelectorUtils.js';
import { debounce, guaranteeNonNullable } from '@finos/legend-shared';
import { WorkspaceSetupStore } from '../../stores/workspace-setup/WorkspaceSetupStore.js';
import { DocumentationLink } from '@finos/legend-lego/application';

const WorkspaceSetupStoreContext = createContext<
  WorkspaceSetupStore | undefined
>(undefined);

export const DEFAULT_WORKSPACE_SOURCE = 'HEAD';

export const DocumentationCard: React.FC = () => {
  const applicationStore = useLegendStudioApplicationStore();
  const appDocUrl = applicationStore.documentationService.url;
  const goToDocumentation = (): void => {
    if (appDocUrl) {
      applicationStore.navigationService.navigator.visitAddress(appDocUrl);
    }
  };
  return (
    <BaseCard
      className="workspace-setup__content__card"
      cardMedia={undefined}
      cardName="Review Documentation"
      cardContent="You can also see our showcase projects and use them as
    quickstarts!"
      cardActions={[
        {
          title: 'Explore',
          content: <FileImportIcon />,
          action: goToDocumentation,
        } as MuiCardActionConfig,
      ]}
      isStable={true}
    />
  );
};

export const QuickStartDocumentationCard: React.FC = () => {
  const applicationStore = useLegendStudioApplicationStore();
  const quickStartDocument = applicationStore.documentationService.getDocEntry(
    LEGEND_STUDIO_DOCUMENTATION_KEY.ASSISTANCE_QUICK_START,
  );
  return (
    quickStartDocument && (
      <BaseCard
        className="workspace-setup__content__card"
        cardMedia={undefined}
        cardName={quickStartDocument.title!}
        cardContent={quickStartDocument.markdownText!.value}
        cardActions={[
          {
            title: quickStartDocument.text!,
            content: <FileImportIcon />,
            action: () =>
              applicationStore.navigationService.navigator.visitAddress(
                quickStartDocument.url!,
              ),
          } as MuiCardActionConfig,
        ]}
        isStable={true}
      />
    )
  );
};

export const RuleEngagementDocumentation: React.FC = () => {
  const applicationStore = useLegendStudioApplicationStore();
  const ruleEngagementDocumentation =
    applicationStore.documentationService.getDocEntry(
      LEGEND_STUDIO_DOCUMENTATION_KEY.ASSISTANCE_RULE_ENGAGEMENT,
    );
  return (
    ruleEngagementDocumentation && (
      <BaseCard
        className="workspace-setup__content__card"
        cardMedia={undefined}
        cardName={ruleEngagementDocumentation.title!}
        cardContent={ruleEngagementDocumentation.markdownText!.value}
        cardActions={[
          {
            title: ruleEngagementDocumentation.text!,
            content: <FileImportIcon />,
            action: () =>
              applicationStore.navigationService.navigator.visitAddress(
                ruleEngagementDocumentation.url!,
              ),
          } as MuiCardActionConfig,
        ]}
        isStable={true}
      />
    )
  );
};

const WorkspaceSetupStoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const applicationStore = useLegendStudioApplicationStore();
  const baseStore = useLegendStudioBaseStore();
  const store = useLocalObservable(
    () => new WorkspaceSetupStore(applicationStore, baseStore.sdlcServerClient),
  );
  return (
    <WorkspaceSetupStoreContext.Provider value={store}>
      {children}
    </WorkspaceSetupStoreContext.Provider>
  );
};

export const useWorkspaceSetupStore = (): WorkspaceSetupStore =>
  guaranteeNonNullable(
    useContext(WorkspaceSetupStoreContext),
    `Can't find workspace setup store in context`,
  );

const withWorkspaceSetupStore = (WrappedComponent: React.FC): React.FC =>
  function WithWorkspaceSetupStore() {
    return (
      <WorkspaceSetupStoreProvider>
        <WrappedComponent />
      </WorkspaceSetupStoreProvider>
    );
  };

export const WorkspaceSetup = withWorkspaceSetupStore(
  observer(() => {
    const params = useParams<WorkspaceSetupPathParams>();
    const projectId = params[LEGEND_STUDIO_ROUTE_PATTERN_TOKEN.PROJECT_ID];
    const workspaceId = params[LEGEND_STUDIO_ROUTE_PATTERN_TOKEN.WORKSPACE_ID];
    const groupWorkspaceId =
      params[LEGEND_STUDIO_ROUTE_PATTERN_TOKEN.GROUP_WORKSPACE_ID];
    const setupStore = useWorkspaceSetupStore();
    const applicationStore = useLegendStudioApplicationStore();
    const [projectSearchText, setProjectSearchText] = useState('');

    const toggleAssistant = (): void =>
      applicationStore.assistantService.toggleAssistant();

    // projects
    const projectOptions = setupStore.projects
      .map(buildProjectOption)
      .sort(compareLabelFn);
    const selectedProjectOption = setupStore.currentProject
      ? buildProjectOption(setupStore.currentProject)
      : null;

    const onProjectChange = (val: ProjectOption | null): void => {
      if (val) {
        flowResult(setupStore.changeProject(val.value)).catch(
          applicationStore.alertUnhandledError,
        );
      } else {
        setupStore.resetProject();
      }
    };
    const showCreateProjectModal = (): void =>
      setupStore.setShowCreateProjectModal(true);

    // project search text
    const debouncedLoadProjects = useMemo(
      () =>
        debounce((input: string): void => {
          flowResult(setupStore.loadProjects(input)).catch(
            applicationStore.alertUnhandledError,
          );
        }, 500),
      [applicationStore, setupStore],
    );
    const onProjectSearchTextChange = (value: string): void => {
      if (value !== projectSearchText) {
        setProjectSearchText(value);
        debouncedLoadProjects.cancel();
        debouncedLoadProjects(value);
      }
    };

    // workspaces
    const workspaceOptions = setupStore.workspaces
      .map(buildWorkspaceOption)
      .sort(compareLabelFn);
    const selectedWorkspaceOption = setupStore.currentWorkspace
      ? buildWorkspaceOption(setupStore.currentWorkspace)
      : null;

    const onWorkspaceChange = (val: WorkspaceOption | null): void => {
      if (val) {
        setupStore.changeWorkspace(val.value);
        if (!setupStore.currentProjectConfigurationStatus?.isConfigured) {
          applicationStore.notificationService.notifyIllegalState(
            `Can't edit current workspace as the current project is not configured`,
          );
        }
      } else {
        setupStore.resetWorkspace();
      }
    };
    const showCreateWorkspaceModal = (): void =>
      setupStore.setShowCreateWorkspaceModal(true);

    const handleProceed = (): void => {
      if (setupStore.currentProject && setupStore.currentWorkspace) {
        applicationStore.navigationService.navigator.goToLocation(
          generateEditorRoute(
            setupStore.currentProject.projectId,
            setupStore.currentWorkspace.source,
            setupStore.currentWorkspace.workspaceId,
            setupStore.currentWorkspace.workspaceType,
          ),
        );
      }
    };

    useEffect(() => {
      flowResult(
        setupStore.initialize(projectId, workspaceId, groupWorkspaceId),
      ).catch(applicationStore.alertUnhandledError);
    }, [
      setupStore,
      applicationStore,
      projectId,
      workspaceId,
      groupWorkspaceId,
    ]);

    useEffect(() => {
      flowResult(setupStore.loadProjects('')).catch(
        applicationStore.alertUnhandledError,
      );
    }, [setupStore, applicationStore]);

    useApplicationNavigationContext(
      LEGEND_STUDIO_APPLICATION_NAVIGATION_CONTEXT_KEY.SETUP,
    );

    return (
      <div className="app__page">
        <div className="workspace-setup">
          <div className="workspace-setup__body">
            <div className="activity-bar">
              <ActivityBarMenu />
            </div>
            <div
              className="workspace-setup__content"
              data-testid={LEGEND_STUDIO_TEST_ID.SETUP__CONTENT}
            >
              <div className="workspace-setup__content__body">
                <div className="workspace-setup__content__main">
                  <div className="workspace-setup__title">
                    <div className="workspace-setup__logo">
                      <img
                        src="/favicon.ico"
                        className="workspace-setup__logo__icon"
                      />
                    </div>
                    <div className="workspace-setup__title__header">
                      Welcome to Legend Studio
                      <DocumentationLink
                        documentationKey={
                          LEGEND_STUDIO_DOCUMENTATION_KEY.SETUP_WORKSPACE
                        }
                      />
                    </div>
                  </div>
                  <form
                    className="workspace-setup__form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleProceed();
                    }}
                  >
                    <div className="workspace-setup__selector">
                      <div className="workspace-setup__selector__header">
                        Search for project
                      </div>
                      <div className="workspace-setup__selector__content">
                        <div
                          className="workspace-setup__selector__content__icon"
                          title="project"
                        >
                          <SearchIcon className="workspace-setup__selector__content__icon--project" />
                        </div>
                        <CustomSelectorInput
                          className="workspace-setup__selector__content__input"
                          options={projectOptions}
                          isLoading={setupStore.loadProjectsState.isInProgress}
                          onInputChange={onProjectSearchTextChange}
                          inputValue={projectSearchText}
                          onChange={onProjectChange}
                          value={selectedProjectOption}
                          placeholder="Search for project..."
                          isClearable={true}
                          escapeClearsValue={true}
                          darkMode={true}
                          formatOptionLabel={getProjectOptionLabelFormatter(
                            applicationStore,
                            setupStore.currentProjectConfigurationStatus,
                          )}
                        />
                      </div>
                    </div>
                    <div className="workspace-setup__selector">
                      <div className="workspace-setup__selector__header">
                        Choose a workspace
                      </div>
                      <div className="workspace-setup__selector__content">
                        <div
                          className="workspace-setup__selector__content__icon"
                          title="workspace"
                        >
                          <GitBranchIcon className="workspace-setup__selector__content__icon--workspace" />
                        </div>
                        <CustomSelectorInput
                          className="workspace-setup__selector__content__input"
                          options={workspaceOptions}
                          disabled={
                            !setupStore.currentProject ||
                            !setupStore.currentProjectConfigurationStatus ||
                            !setupStore.currentProjectConfigurationStatus
                              .isConfigured ||
                            setupStore.loadProjectsState.isInProgress ||
                            setupStore.loadWorkspacesState.isInProgress
                          }
                          isLoading={
                            setupStore.loadWorkspacesState.isInProgress
                          }
                          onChange={onWorkspaceChange}
                          formatOptionLabel={formatWorkspaceOptionLabel}
                          value={selectedWorkspaceOption}
                          placeholder={
                            setupStore.loadWorkspacesState.isInProgress
                              ? 'Loading workspaces...'
                              : !setupStore.currentProject
                              ? 'In order to choose a workspace, a project must be chosen'
                              : workspaceOptions.length
                              ? 'Choose an existing workspace'
                              : 'You have no workspaces. Please create one to proceed...'
                          }
                          isClearable={true}
                          escapeClearsValue={true}
                          darkMode={true}
                        />
                      </div>
                    </div>
                  </form>
                  <form
                    className="workspace-setup__form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleProceed();
                    }}
                  >
                    <div className="workspace-setup__buttons">
                      <button
                        className="workspace-setup__go-btn btn--dark"
                        onClick={handleProceed}
                        disabled={
                          !setupStore.currentProject ||
                          !setupStore.currentProjectConfigurationStatus ||
                          !setupStore.currentProjectConfigurationStatus
                            .isConfigured ||
                          !setupStore.currentWorkspace ||
                          setupStore.createWorkspaceState.isInProgress ||
                          setupStore.createOrImportProjectState.isInProgress
                        }
                      >
                        <div className="workspace-setup__go-btn__label">Go</div>
                        <LongArrowRightIcon className="workspace-setup__go-btn__icon" />
                      </button>
                    </div>
                  </form>
                  <div className="workspace-setup__actions">
                    <DividerWithText className="workspace-setup__divider">
                      OR
                    </DividerWithText>
                    <div className="workspace-setup__buttons">
                      <button
                        className="workspace-setup__new-btn"
                        onClick={showCreateProjectModal}
                        title="Create a Project"
                      >
                        Create New Project
                      </button>
                      <button
                        className="workspace-setup__new-btn"
                        onClick={showCreateWorkspaceModal}
                        disabled={
                          !setupStore.currentProject ||
                          !setupStore.currentProjectConfigurationStatus ||
                          !setupStore.currentProjectConfigurationStatus
                            .isConfigured
                        }
                      >
                        Create New Workspace
                      </button>
                    </div>
                  </div>
                </div>
                <div className="workspace-setup__content__cards">
                  <QuickStartDocumentationCard />
                  <RuleEngagementDocumentation />
                  <DocumentationCard />
                </div>
                {/* NOTE: We do this to reset the initial state of the modals */}
                {setupStore.showCreateProjectModal && <CreateProjectModal />}
                {setupStore.showCreateWorkspaceModal &&
                  setupStore.currentProject && (
                    <CreateWorkspaceModal
                      selectedProject={setupStore.currentProject}
                    />
                  )}
              </div>
            </div>
          </div>
          <div
            data-testid={LEGEND_STUDIO_TEST_ID.STATUS_BAR}
            className="editor__status-bar"
          >
            <div className="editor__status-bar__left"></div>
            <div className="editor__status-bar__right">
              <button
                className={clsx(
                  'editor__status-bar__action editor__status-bar__action__toggler',
                  {
                    'editor__status-bar__action__toggler--active':
                      !applicationStore.assistantService.isHidden,
                  },
                )}
                onClick={toggleAssistant}
                tabIndex={-1}
                title="Toggle assistant"
              >
                <AssistantIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }),
);
