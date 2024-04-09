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
  type LightQuery,
  type QueryInfo,
  type RawLambda,
  GraphManagerState,
} from '@finos/legend-graph';
import {
  type DepotServerClient,
  StoreProjectData,
  ProjectDependencyCoordinates,
  ProjectVersionEntities,
  resolveVersion,
} from '@finos/legend-server-depot';
import {
  ActionState,
  assertErrorThrown,
  filterByType,
  guaranteeNonNullable,
  LogEvent,
  type GeneratorFn,
  type PlainObject,
} from '@finos/legend-shared';
import { getDataSpace } from '../../graph-manager/DSL_DataSpace_GraphManagerHelper.js';
import {
  generateDataSpaceQuerySetupRoute,
  generateDataSpaceTemplateQueryPromotionRoute,
} from '../../__lib__/query/DSL_DataSpace_LegendQueryNavigation.js';
import {
  type DataSpace,
  DataSpaceExecutableTemplate,
} from '../../graph/metamodel/pure/model/packageableElements/dataSpace/DSL_DataSpace_DataSpace.js';
import { generateGAVCoordinates, type Entity } from '@finos/legend-storage';
import {
  type ProjectConfigurationStatus,
  fetchProjectConfigurationStatus,
  generateEditorRoute,
  LEGEND_STUDIO_APP_EVENT,
  type LegendStudioApplicationStore,
  EditorStore,
  generateReviewRoute,
} from '@finos/legend-application-studio';
import {
  DEFAULT_TAB_SIZE,
  ActionAlertType,
  ActionAlertActionType,
} from '@finos/legend-application';
import {
  makeObservable,
  observable,
  computed,
  action,
  flow,
  flowResult,
} from 'mobx';
import {
  type SDLCServerClient,
  Project,
  WorkspaceType,
  Workspace,
  ProjectConfiguration,
  ProjectDependency,
  UpdateProjectConfigurationCommand,
  EntityChangeType,
} from '@finos/legend-server-sdlc';

const projectDependencyToProjectCoordinates = (
  projectDependency: ProjectDependency,
): ProjectDependencyCoordinates =>
  new ProjectDependencyCoordinates(
    guaranteeNonNullable(projectDependency.groupId),
    guaranteeNonNullable(projectDependency.artifactId),
    projectDependency.versionId,
  );

const DEFAULT_WORKSPACE_NAME_PREFIX = 'promote-as-template-query';

export class DataSpaceTemplateQueryPromotionReviewerStore {
  readonly applicationStore: LegendStudioApplicationStore;
  readonly sdlcServerClient: SDLCServerClient;
  readonly depotServerClient: DepotServerClient;
  readonly graphManagerState: GraphManagerState;
  readonly initState = ActionState.create();
  readonly promoteState = ActionState.create();
  readonly loadQueryState = ActionState.create();
  readonly loadWorkspacesState = ActionState.create();
  editorStore: EditorStore;
  currentQuery?: LightQuery | undefined;
  currentQueryInfo?: QueryInfo | undefined;
  currentQueryProject?: StoreProjectData | undefined;
  currentProject?: Project | undefined;
  currentProjectConfiguration?: ProjectConfiguration;
  currentProjectConfigurationStatus?: ProjectConfigurationStatus | undefined;
  dependencyEntities: Entity[] = [];
  groupWorkspaces: Workspace[] = [];
  isAutoConfigurationEnabled = false;
  workspaceName = '';
  dataSpacePath!: string;
  dataSpace: DataSpace | undefined;
  templateQueryTitle = 'template';
  templateQueryDescription = '';

  constructor(
    applicationStore: LegendStudioApplicationStore,
    sdlcServerClient: SDLCServerClient,
    depotServerClient: DepotServerClient,
  ) {
    makeObservable(this, {
      editorStore: observable,
      currentQuery: observable,
      currentQueryInfo: observable,
      currentQueryProject: observable,
      currentProject: observable,
      currentProjectConfiguration: observable,
      currentProjectConfigurationStatus: observable,
      isAutoConfigurationEnabled: observable,
      dataSpace: observable,
      groupWorkspaces: observable,
      workspaceName: observable,
      templateQueryTitle: observable,
      templateQueryDescription: observable,
      isWorkspaceNameValid: computed,
      isTemplateQueryTitleValid: computed,
      setIsAutoConfigurationEnabled: action,
      setWorkspaceName: action,
      setTemplateQueryTitle: action,
      setTemplateQueryDescription: action,
      initialize: flow,
      loadQuery: flow,
      loadProject: flow,
      promoteAsTemplateQuery: flow,
    });

    this.applicationStore = applicationStore;
    this.sdlcServerClient = sdlcServerClient;
    this.depotServerClient = depotServerClient;
    this.graphManagerState = new GraphManagerState(
      applicationStore.pluginManager,
      applicationStore.logService,
    );
    this.editorStore = new EditorStore(
      applicationStore,
      sdlcServerClient,
      depotServerClient,
    );
  }

  setIsAutoConfigurationEnabled(val: boolean): void {
    this.isAutoConfigurationEnabled = val;
  }

  setWorkspaceName(val: string): void {
    this.workspaceName = val;
  }

  setTemplateQueryTitle(val: string): void {
    this.templateQueryTitle = val;
  }

  setTemplateQueryDescription(val: string): void {
    this.templateQueryDescription = val;
  }

  get isWorkspaceNameValid(): boolean {
    return !this.groupWorkspaces.some(
      (ws) => ws.workspaceId === this.workspaceName,
    );
  }

  get isTemplateQueryTitleValid(): boolean {
    return !this.dataSpace?.executables
      ?.filter(filterByType(DataSpaceExecutableTemplate))
      .map((et) => et.title)
      .includes(this.templateQueryTitle);
  }

  *initialize(
    queryId: string | undefined,
    dataSpacePath: string,
  ): GeneratorFn<void> {
    if (!this.initState.isInInitialState) {
      return;
    }
    try {
      this.initState.inProgress();
      yield this.graphManagerState.graphManager.initialize(
        {
          env: this.applicationStore.config.env,
          tabSize: DEFAULT_TAB_SIZE,
          clientConfig: {
            baseUrl: this.applicationStore.config.engineServerUrl,
            queryBaseUrl: this.applicationStore.config.engineQueryServerUrl,
            enableCompression: true,
          },
        },
        {
          tracerService: this.applicationStore.tracerService,
        },
      );
      yield this.graphManagerState.initializeSystem();
      // reset
      this.graphManagerState.resetGraph();
      // build dependencies
      const dependencyManager =
        this.graphManagerState.graphManager.createDependencyManager();
      this.graphManagerState.graph.dependencyManager = dependencyManager;
      yield this.graphManagerState.graphManager.buildDependencies(
        this.graphManagerState.coreModel,
        this.graphManagerState.systemModel,
        dependencyManager,
        new Map(),
        this.graphManagerState.dependenciesBuildState,
        {},
      );
      this.dataSpacePath = dataSpacePath;
      if (queryId) {
        let query: LightQuery | undefined;
        try {
          query = (yield this.graphManagerState.graphManager.getLightQuery(
            queryId,
          )) as LightQuery;
        } catch {
          query = undefined;
        }
        if (query) {
          yield flowResult(this.loadQuery(query));
        } else {
          this.applicationStore.navigationService.navigator.updateCurrentLocation(
            generateDataSpaceQuerySetupRoute(),
          );
        }
      }
      if (this.currentQuery) {
        this.currentQueryProject = StoreProjectData.serialization.fromJson(
          (yield this.depotServerClient.getProject(
            this.currentQuery.groupId,
            this.currentQuery.artifactId,
          )) as PlainObject<StoreProjectData>,
        );
        const projectData = (yield Promise.all([
          this.depotServerClient.getVersionEntities(
            this.currentQuery.groupId,
            this.currentQuery.artifactId,
            this.currentQuery.versionId,
          ),
          this.sdlcServerClient.getConfiguration(
            'PROD-29851090', // ----------------------------------------------------------    this.currentQueryProject.projectId,-----------------------------------------------------
            undefined,
          ),
        ])) as [Entity[], PlainObject<ProjectConfiguration>];

        const [currentProjectEntities, currentProjectConfiguration] = [
          projectData[0],
          ProjectConfiguration.serialization.fromJson(projectData[1]),
        ];
        this.currentProjectConfiguration = currentProjectConfiguration;
        const dependencyEntities = (
          (yield this.depotServerClient.collectDependencyEntities(
            (
              [
                ...currentProjectConfiguration.projectDependencies,
              ] as ProjectDependency[]
            )
              .map(projectDependencyToProjectCoordinates)
              .map((p) => ProjectDependencyCoordinates.serialization.toJson(p)),
            true,
            true,
          )) as PlainObject<ProjectVersionEntities>[]
        )
          .map((p) => ProjectVersionEntities.serialization.fromJson(p))
          .flatMap((info) => info.entities);
        this.dependencyEntities = dependencyEntities;
        yield this.graphManagerState.graphManager.buildGraph(
          this.graphManagerState.graph,
          [...dependencyEntities, ...currentProjectEntities],
          this.graphManagerState.graphBuildState,
        );

        this.dataSpace = getDataSpace(
          dataSpacePath,
          this.graphManagerState.graph,
        );
        this.initState.pass();
      }
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.logService.error(
        LogEvent.create(LEGEND_STUDIO_APP_EVENT.GENERIC_FAILURE),
        error,
      );
      this.applicationStore.alertService.setBlockingAlert({
        message: `Can't initialize template query promotion reviewer store`,
      });
      this.initState.fail();
    }
  }

  *loadQuery(query: LightQuery): GeneratorFn<void> {
    this.currentQuery = query;

    try {
      this.loadQueryState.inProgress();
      this.currentQueryInfo =
        (yield this.graphManagerState.graphManager.getQueryInfo(
          query.id,
        )) as QueryInfo;
      this.currentQueryProject = StoreProjectData.serialization.fromJson(
        (yield this.depotServerClient.getProject(
          this.currentQuery.groupId,
          this.currentQuery.artifactId,
        )) as PlainObject<StoreProjectData>,
      );
      this.setWorkspaceName(`${DEFAULT_WORKSPACE_NAME_PREFIX}-${query.id}`);
      this.applicationStore.navigationService.navigator.updateCurrentLocation(
        generateDataSpaceTemplateQueryPromotionRoute(
          this.currentQuery.groupId,
          this.currentQuery.artifactId,
          this.currentQuery.versionId,
          this.dataSpacePath,
          query.id,
        ),
      );
      const currentProject = Project.serialization.fromJson(
        (yield this.sdlcServerClient.getProject(
          // ----------------------------------------------------------   /this.currentQueryProject.projectId,,-----------------------------------------------------
          'PROD-29851090',
        )) as PlainObject<Project>,
      );
      yield flowResult(this.loadProject(currentProject));
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.notificationService.notifyError(error);
    } finally {
      this.loadQueryState.complete();
    }
  }

  *loadProject(project: Project): GeneratorFn<void> {
    this.currentProject = project;
    this.currentProjectConfigurationStatus = undefined;
    // NOTE: no need to enable auto-configuration if the query's project is selected
    this.setIsAutoConfigurationEnabled(
      project.projectId !== this.currentQueryProject?.projectId,
    );
    this.loadWorkspacesState.inProgress();
    try {
      this.currentProjectConfigurationStatus =
        (yield fetchProjectConfigurationStatus(
          project.projectId,
          undefined,
          this.applicationStore,
          this.sdlcServerClient,
        )) as ProjectConfigurationStatus;

      const workspacesInConflictResolutionIds = (
        (yield this.sdlcServerClient.getWorkspacesInConflictResolutionMode(
          project.projectId,
          undefined,
        )) as Workspace[]
      ).map((workspace) => workspace.workspaceId);
      this.groupWorkspaces = (
        (yield this.sdlcServerClient.getGroupWorkspaces(
          project.projectId,
        )) as PlainObject<Workspace>[]
      )
        .map((v) => Workspace.serialization.fromJson(v))
        .filter(
          (workspace) =>
            // NOTE we don't handle workspaces that only have conflict resolution but no standard workspace
            // since that indicates bad state of the SDLC server
            !workspacesInConflictResolutionIds.includes(
              workspace.workspaceId,
            ) && workspace.workspaceType === WorkspaceType.GROUP,
        );
      this.loadWorkspacesState.pass();
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.logService.error(
        LogEvent.create(LEGEND_STUDIO_APP_EVENT.SDLC_MANAGER_FAILURE),
        error,
      );
      this.applicationStore.notificationService.notifyError(error);
      this.loadWorkspacesState.fail();
    }
  }

  *promoteAsTemplateQuery(): GeneratorFn<void> {
    const query = this.currentQuery;
    const project = this.currentProject;
    if (
      this.promoteState.isInProgress ||
      !query ||
      !this.currentQueryInfo ||
      !this.currentProjectConfiguration ||
      !project ||
      !this.workspaceName ||
      !this.templateQueryTitle ||
      !this.dataSpace ||
      !this.isWorkspaceNameValid ||
      !this.isTemplateQueryTitleValid
    ) {
      return;
    }

    try {
      this.promoteState.inProgress();
      // 1. prepare project entities
      this.applicationStore.alertService.setBlockingAlert({
        message: `Fetching and updating project...`,
        prompt: 'Please do not close the application',
        showLoading: true,
      });
      const dataSpaceExecutableTemplate = new DataSpaceExecutableTemplate();
      dataSpaceExecutableTemplate.title = this.templateQueryTitle;
      dataSpaceExecutableTemplate.description = this.templateQueryDescription;
      dataSpaceExecutableTemplate.executionContextKey = guaranteeNonNullable(
        this.dataSpace.executionContexts.filter(
          (ec) =>
            ec.mapping.value.path ===
              guaranteeNonNullable(this.currentQueryInfo).mapping &&
            ec.defaultRuntime.value.path ===
              guaranteeNonNullable(this.currentQueryInfo).runtime,
        )[0]?.name,
        'can`t find a corresponding executatin key based on query`s mapping and runtime in dataspace',
      );
      dataSpaceExecutableTemplate.query =
        (yield this.graphManagerState.graphManager.pureCodeToLambda(
          this.currentQueryInfo.content,
        )) as RawLambda;
      this.dataSpace.executables = this.dataSpace.executables
        ? [...this.dataSpace.executables, dataSpaceExecutableTemplate]
        : [dataSpaceExecutableTemplate];

      // 2. auto-configure the project
      // here, the goal is to identify and add the query's project as a dependency
      const dependenciesToAdd: ProjectDependency[] = [];
      if (this.isAutoConfigurationEnabled) {
        const projectGA = generateGAVCoordinates(
          this.currentQueryInfo.groupId,
          this.currentQueryInfo.artifactId,
          undefined,
        );
        const dependencyToAdd = new ProjectDependency(
          projectGA,
          // NOTE: here we could end up adding a snapshot dependency, which is fine
          // since this workspace would end up being blocked in review process by SDLC
          resolveVersion(this.currentQueryInfo.versionId),
        );
        if (
          !this.currentProjectConfiguration.projectDependencies.find(
            (dep) => dep.projectId === projectGA,
          )
        ) {
          // NOTE: if a dependency with the same GA coordinate already existed, there are 2 cases:
          // 1. Its version is the same as the version of the query's project: nothing to be done here
          // 2. Its version is not the same as the version of the query's project: this is a conflict, we will not be able to add
          //    the query's project version as a new dependency, i.e. we will give up auto-configuration
          dependenciesToAdd.push(dependencyToAdd);
        }
      }

      // 3. check if the graph compiles properly
      this.applicationStore.alertService.setBlockingAlert({
        message: `Checking workspace compilation status...`,
        prompt: 'Please do not close the application',
        showLoading: true,
      });

      const dependenciesToAddEntities = (
        (yield this.depotServerClient.collectDependencyEntities(
          [...dependenciesToAdd]
            .map(projectDependencyToProjectCoordinates)
            .map((p) => ProjectDependencyCoordinates.serialization.toJson(p)),
          true,
          true,
        )) as PlainObject<ProjectVersionEntities>[]
      )
        .map((p) => ProjectVersionEntities.serialization.fromJson(p))
        .flatMap((info) => info.entities);

      const graphGrammar =
        (yield this.graphManagerState.graphManager.graphToPureCode(
          this.graphManagerState.graph,
        )) as string;
      const updatedProjectEntities =
        (yield this.graphManagerState.graphManager.pureCodeToEntities(
          graphGrammar,
        )) as Entity[];

      let compilationFailed = false;
      try {
        yield this.graphManagerState.graphManager.compileEntities([
          ...this.dependencyEntities,
          ...dependenciesToAddEntities,
          ...updatedProjectEntities,
        ]);
      } catch {
        compilationFailed = true;
      }

      // 4. proceed to setup the workspace
      const setupWorkspace = async (): Promise<void> => {
        let workspace: Workspace | undefined;
        try {
          this.applicationStore.alertService.setBlockingAlert({
            message: `Creating workspace...`,
            prompt: 'Please do not close the application',
            showLoading: true,
          });

          // i. create workspace
          workspace = Workspace.serialization.fromJson(
            await this.sdlcServerClient.createWorkspace(
              project.projectId,
              undefined,
              this.workspaceName,
              WorkspaceType.GROUP,
            ),
          );

          // ii. add dependencies if needed
          if (dependenciesToAdd.length) {
            this.applicationStore.alertService.setBlockingAlert({
              message: `Adding dependencies...`,
              prompt: 'Please do not close the application',
              showLoading: true,
            });
            const projectConfigurationUpdateCommand =
              new UpdateProjectConfigurationCommand(
                guaranteeNonNullable(this.currentProjectConfiguration).groupId,
                guaranteeNonNullable(
                  this.currentProjectConfiguration,
                ).artifactId,
                guaranteeNonNullable(
                  this.currentProjectConfiguration,
                ).projectStructureVersion,
                'promote-as-template-query: add dependencies',
              );
            projectConfigurationUpdateCommand.projectDependenciesToAdd =
              dependenciesToAdd;
            await this.sdlcServerClient.updateConfiguration(
              project.projectId,
              workspace,
              UpdateProjectConfigurationCommand.serialization.toJson(
                projectConfigurationUpdateCommand,
              ),
            );
          }

          // iii. update dataspace
          const dataspaceEntity =
            this.graphManagerState.graphManager.elementToEntity(
              guaranteeNonNullable(this.dataSpace),
            );

          this.applicationStore.alertService.setBlockingAlert({
            message: `Generating code commit...`,
            prompt: 'Please do not close the application',
            showLoading: true,
          });
          await this.sdlcServerClient.performEntityChanges(
            project.projectId,
            workspace,
            {
              message:
                'promote-as-template-query: promote query as a template query to dataspace',
              entityChanges: [
                {
                  classifierPath: dataspaceEntity.classifierPath,
                  entityPath: dataspaceEntity.path,
                  content: dataspaceEntity.content,
                  type: EntityChangeType.MODIFY,
                },
              ],
            },
          );

          // iv create review
          this.applicationStore.alertService.setBlockingAlert({
            message: `Generating code review...`,
            prompt: 'Please do not close the application',
            showLoading: true,
          });
          await flowResult(
            this.editorStore.initialize(
              // ----------------------------------------------------------   /project.projectId,-----------------------------------------------------
              'PROD-29851090',
              undefined,
              workspace.workspaceId,
              workspace.workspaceType,
            ),
          );
          const workspaceReviewState = this.editorStore.workspaceReviewState;
          const workspaceContainsSnapshotDependencies =
            this.editorStore.projectConfigurationEditorState
              .containsSnapshotDependencies;
          const isCreateReviewDisabled =
            Boolean(workspaceReviewState.workspaceReview) ||
            workspaceContainsSnapshotDependencies ||
            !workspaceReviewState.canCreateReview ||
            workspaceReviewState.sdlcState.isActiveProjectSandbox;
          workspaceReviewState.reviewTitle =
            'code review - promote query as a template query to dataspace';
          if (!isCreateReviewDisabled) {
            await flowResult(
              workspaceReviewState.createWorkspaceReview(
                workspaceReviewState.reviewTitle,
              ),
            );
          }

          // iv. complete, redirect user to the service query editor screen
          this.applicationStore.alertService.setBlockingAlert(undefined);
          this.promoteState.pass();
          this.applicationStore.alertService.setActionAlertInfo({
            message: `Successfully promoted query into dataspace '${this.dataSpacePath}'. Now your template query can be found in workspace '${this.workspaceName}' of project '${project.name}' (${project.projectId})`,
            prompt: compilationFailed
              ? `The workspace might not compile at the moment, please make sure to fix the issue and submit a review to make the dataspace part of the project to complete template query promotion`
              : `Please make sure to get the generated code-review reviewed and approved`,
            type: ActionAlertType.STANDARD,
            actions: compilationFailed
              ? [
                  {
                    label: 'Open Workspace',
                    type: ActionAlertActionType.PROCEED,
                    handler: (): void => {
                      this.applicationStore.navigationService.navigator.goToLocation(
                        generateEditorRoute(
                          project.projectId,
                          undefined,
                          this.workspaceName,
                          WorkspaceType.GROUP,
                        ),
                      );
                    },
                    default: true,
                  },
                ]
              : [
                  {
                    label: 'Open Code Review',
                    type: ActionAlertActionType.PROCEED,
                    handler: (): void => {
                      if (workspaceReviewState.workspaceReview) {
                        this.applicationStore.navigationService.navigator.visitAddress(
                          this.applicationStore.navigationService.navigator.generateAddress(
                            generateReviewRoute(
                              workspaceReviewState.workspaceReview.projectId,
                              workspaceReviewState.workspaceReview.id,
                            ),
                          ),
                        );
                      }
                    },
                    default: true,
                  },
                  {
                    label: 'Open Workspace',
                    type: ActionAlertActionType.PROCEED,
                    handler: (): void => {
                      this.applicationStore.navigationService.navigator.goToLocation(
                        generateEditorRoute(
                          project.projectId,
                          undefined,
                          this.workspaceName,
                          WorkspaceType.GROUP,
                        ),
                      );
                    },
                  },
                ],
          });
        } catch (error) {
          assertErrorThrown(error);
          this.applicationStore.alertService.setBlockingAlert(undefined);
          this.applicationStore.notificationService.notifyError(
            `Can't set up workspace: ${error.message}`,
          );
          if (workspace) {
            await this.sdlcServerClient.deleteWorkspace(
              project.projectId,
              workspace,
            );
          }
          this.promoteState.fail();
        }
      };

      this.applicationStore.alertService.setBlockingAlert(undefined);
      if (compilationFailed) {
        this.applicationStore.alertService.setActionAlertInfo({
          message: `We have found compilation issues with the workspace. Your query can still be promoted, but you would need to fix compilation issues afterwards`,
          prompt: `Do you still want to proceed to promote the query as a template query?`,
          type: ActionAlertType.STANDARD,
          actions: [
            {
              label: `Proceed`,
              type: ActionAlertActionType.PROCEED_WITH_CAUTION,
              handler: (): void => {
                setupWorkspace().catch(
                  this.applicationStore.alertUnhandledError,
                );
              },
            },
            {
              label: 'Abort',
              type: ActionAlertActionType.PROCEED,
              handler: (): void => {
                this.promoteState.fail();
              },
              default: true,
            },
          ],
        });
      } else {
        yield setupWorkspace();
      }

      this.promoteState.pass();
    } catch (error) {
      assertErrorThrown(error);
      this.applicationStore.alertService.setBlockingAlert(undefined);
      this.applicationStore.notificationService.notifyError(error);
      this.promoteState.fail();
    }
  }
}
