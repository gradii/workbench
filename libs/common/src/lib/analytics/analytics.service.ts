import { Inject, Injectable, Optional } from '@angular/core';
import { NbAuthOAuth2JWTToken, NbAuthService } from '@nebular/auth';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { NB_WINDOW } from '@nebular/theme';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { ProjectProperties } from '../models/oven.models';

import { AnalyticsHandler } from './analytics-handler.service';
import { ENVIRONMENT } from '../environment';
import { ExecuteSourceType, Feature } from '../models/communication.models';
import { BreakpointWidth, getBreakpointWidth } from '../models/responsive';

// 'builder' here means all tools except preview because it's simpler for analytics
export type BreakpointChangePlace = 'builder' | 'preview' | 'sharing';

// 'icons' means breakpoint was changed through clicking on the breakpoints-control
type BreakpointChangeType = 'icons' | 'browserResize';

const SIGNUP_FORM_GENERATOR_URL = '/signup-form-generator';

export interface UserInfo {
  fullName?: string;
  role?: string;
  companySize?: string;
  companyIndustry?: string;
  problemToSolve?: string;
  description?: string;
  solution?: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private window: Window;

  constructor(
    @Optional() private authService: NbAuthService,
    private router: Router,
    @Inject(NB_WINDOW) window,
    @Inject(ENVIRONMENT) private environment,
    private handler: AnalyticsHandler
  ) {
    this.window = window;
  }

  init(): void {
    // init analytics, set environment and user props;
    this.listenRouterNavigation();
    this.updateUserProps();
    this.listenAuthorizationStatus();
  }

  logErrorOccurred(error): void {
    this.log('ERROR_OCCURRED', { error });
  }

  logLogIn(res: HttpResponseBase, type: string): void {
    this.log('LOG_IN', { error: this.parseError(res), type });
  }

  logSignUp(emailsAllowed: boolean, res: HttpResponseBase, type: string): void {
    this.log('SIGN_UP', { emailsAllowed, error: this.parseError(res), type });
  }

  logWelcome(user: UserInfo): void {
    this.log('WELCOME', user);
  }

  // this event is same as on the backend
  // but we need it on UI to be able to send to hubspot or google analytics
  // at the same time we don't want to remove backend events as they are more reliable
  logChangePlanUI(previousPlan: string, newPlan: string): void {
    this.log('CHANGE_PLAN_UI', { previousPlan, newPlan });
  }

  // this event is same as on the backend
  // but we need it on UI to be able to send to hubspot or google analytics
  // at the same time we don't want to remove backend events as they are more reliable
  logProjectEditUI(projectId: string, editsCount: number): void {
    this.log('PROJECT_EDIT_UI', { projectId, editsCount });
  }

  logCreateNewProject(templateName: string, props: ProjectProperties, error: string = '', source = 'dashboard'): void {
    this.log('NEW_PROJECT', {
      creationType: 'add',
      templateName,
      error,
      source,
      type: props.type,
      description: props.description
    });
  }

  logDuplicateProject(project: ProjectBrief): void {
    this.log('NEW_PROJECT', { creationType: 'duplicate', type: project.type, description: project.description });
  }

  logDuplicateProjectError(error: string): void {
    this.log('NEW_PROJECT', { creationType: 'duplicate', error });
  }

  logAddComponent(componentName: string, widget: boolean = false): void {
    this.log('ADD_COMPONENT', { componentName, widget });
  }

  logSelectComponent(componentName: string, source: ExecuteSourceType): void {
    this.log('SELECT_COMPONENT', { componentName, source });
  }

  logRemoveComponent(componentName: string, source: ExecuteSourceType): void {
    this.log('REMOVE_COMPONENT', { componentName, source });
  }

  logRemoveComponentsList(componentNames: string[]): void {
    this.log('REMOVE_COMPONENTS_LIST', { componentNames: componentNames.join(', ') });
  }

  logDragAndDrop(componentName: string, source: ExecuteSourceType): void {
    this.log('DRAG_DROP_COMPONENT', { componentName, source });
  }

  logAddPage(pageName: string, projectName: string): void {
    this.log('ADD_PAGE', { pageName, projectName });
  }

  logDeletePage(pageName: string, projectName: string): void {
    this.log('DELETE_PAGE', { pageName, projectName });
  }

  logCopyPage(pageName: string, projectName: string): void {
    this.log('COPY_PAGE', { pageName, projectName });
  }

  logAddSpace(): void {
    this.log('ADD_SPACE');
  }

  logRemoveSpace(source: ExecuteSourceType): void {
    this.log('REMOVE_SPACE', { source });
  }

  logResizeSpace(stick: boolean): void {
    this.log('RESIZE_SPACE', { stick });
  }

  logDivideSpace(divisionType: string): void {
    this.log('DIVIDE_SPACE', { divisionType });
  }

  logChangeLayout(newLayout: string, changeType: string): void {
    this.log('CHANGE_LAYOUT', { newLayout, changeType });
  }

  logChangeComponentConfig(componentName: string, configName: string, configNewParameter: string): void {
    this.log('CHANGE_COMPONENT_CONFIG', { componentName, configName, configNewParameter });
  }

  logOpenDownloadPopup(): void {
    this.log('OPEN_DOWNLOAD_POPUP');
  }

  logDownloadSample(): void {
    this.log('DOWNLOAD_SAMPLE');
  }

  logDownloadCode(
    projectName: string,
    pagesNumber: number,
    fileSize: string,
    source: string,
    error: string = ''
  ): void {
    this.log('DOWNLOAD_CODE', { projectName, pagesNumber, fileSize, error, source });
  }

  logPreviewProject(projectName: string): void {
    this.log('PREVIEW_PROJECT', { projectName });
  }

  logShareProject(enabled: boolean, error: string = ''): void {
    this.log('SHARE_PROJECT', { enabled, error });
  }

  logViewShareProject(breakpointWidth: BreakpointWidth) {
    const screenSize = getBreakpointWidth(breakpointWidth);
    this.log('VIEW_SHARE_PROJECT', { screenSize });
  }

  logPrimarySelected(type: string, colorCode: string): void {
    this.log('PRIMARY_SELECTED', { type, colorCode });
  }

  logRegenerateColors(): void {
    this.log('REGENERATE_COLORS');
  }

  logLockColor(lockedColorType: string, lockedColorCode: string): void {
    this.log('LOCK_COLOR', { lockedColorType, lockedColorCode });
  }

  logBackgroundChange(colorCode: string): void {
    this.log('BACKGROUND_CHANGED', { colorCode });
  }

  logChangeShadow(enabled: boolean): void {
    this.log('CHANGE_SHADOW', { enabled });
  }

  logChangeBorderRadius(radius: number, measurement: string): void {
    this.log('CHANGE_BORDER_RADIUS', { radius, measurement });
  }

  logUpgradeRequest(type: Feature, element?: string): void {
    this.log('UPGRADE_REQUEST', { type, element });
  }

  logFontChanged(fontName: string): void {
    this.log('FONT_CHANGED', { fontName });
  }

  logOpenVideoTutorial(): void {
    this.log('OPEN_VIDEO_TUTORIAL');
  }

  logCloseVideoTutorial(): void {
    this.log('CLOSE_VIDEO_TUTORIAL');
  }

  logVideoTutorialWatched15(): void {
    this.log('VIDEO_TUTORIAL_15SEC');
  }

  logVideoTutorialChange(title: string): void {
    this.log('VIDEO_TUTORIAL_CHANGE', { title });
  }

  logModelVersionMismatch(): void {
    this.log('MODEL_VERSION_MISMATCH');
  }

  logImportPages(count): void {
    this.log('PAGE_IMPORT', { count });
  }

  logChangeBreakpoint(
    breakpointWidth: BreakpointWidth,
    place: BreakpointChangePlace,
    type: BreakpointChangeType
  ): void {
    const screenSize = getBreakpointWidth(breakpointWidth);
    this.log('CHANGE_SCREEN_SIZE', { screenSize, place, type });
  }

  logFormBuilderOpenTab(tabName: string): void {
    this.log('OPEN_TAB', { TAB_NAME: tabName });
  }

  logFormBuilderConfigFields(fieldGroupName: string): void {
    this.log('CONFIG_FIELDS', { FIELD_GROUP_NAME: fieldGroupName });
  }

  logFormBuilderConfigColors(): void {
    this.log('CONFIG_COLORS');
  }

  logFormBuilderOpenDownloadForm(): void {
    this.log('OPEN_DOWNLOAD_FORM');
  }

  logFormBuilderDownloadForm(): void {
    this.log('DOWNLOAD_FORM');
  }

  logFormBuilderContinueEditing(): void {
    this.log('CONTINUE_EDITING');
  }

  logFormBuilderSignUpUIBakery(): void {
    this.log('SIGN_UP_UIBAKERY');
  }

  logFormBuilderChooseTemplate(templateName: string, templateId: string): void {
    this.log('CHOOSE_TEMPLATE', { TEMPLATE_NAME: templateName, TEMPLATE_ID: templateId });
  }

  logFormBuilderSkip(popupName: 'editing' | 'download'): void {
    this.log('SKIP', { POPUP_NAME: popupName });
  }

  logExperiment(name: string, option: string): void {
    this.log('EXPERIMENT', { name, option });
  }

  logSkipLesson(lessonName: string, lessonStep: number): void {
    this.log('SKIP_LESSON', { lessonName, lessonStep });
  }

  logTutorialStarted(): void {
    this.log('TUTORIAL_STARTED');
  }

  logTutorialProgressOpened(): void {
    this.log('TUTORIAL_PROGRESS_OPENED');
  }

  logNextStep(lessonName: string, lessonStep: number, automatic: boolean, spentTime: number): void {
    this.log('NEXT_STEP', { lessonName, lessonStep, automatic: automatic ? 'Y' : 'N', spentTime });
  }

  logPrevStep(lessonName: string, lessonStep: number): void {
    this.log('PREVIOUS_STEP', { lessonName, lessonStep });
  }

  logFinishTutorial(): void {
    this.log('FINISH_TUTORIAL');
  }

  logXrayChanged(state: boolean): void {
    this.log('XRAY_CHANGED', { state: state ? 'on' : 'off' });
  }

  logPaymentCardPopupOpened(): void {
    this.log('PAYMENT_CARD_POPUP');
  }

  logSubscriptionReason(reason: string, currentPlan: string): void {
    this.log('SUBSCRIPTION_REASON', { reason, currentPlan });
  }

  logActionOpen(id: string, name: string, stepsCount: number): void {
    this.log('ACTION_OPEN', { id, name, stepsCount });
  }

  logActionClone(id: string, name: string, stepsCount: number): void {
    this.log('ACTION_CLONE', { id, name, stepsCount });
  }

  logActionSave(id: string, name: string, stepsCount: number): void {
    this.log('ACTION_SAVE', { id, name, stepsCount });
  }

  logActionDelete(id: string, name: string, stepsCount: number): void {
    this.log('ACTION_DELETE', { id, name, stepsCount });
  }

  logActionAssign(id: string, name: string, trigger: string, actionName: string): void {
    this.log('ACTION_ASSIGN', { id, name, trigger, actionName });
  }

  logActionExecuted(id: string, name: string, success: boolean, error?: string): void {
    this.log('ACTION_EXECUTED', { id, name, success, error });
  }

  logActionStepExecuted(id: string, type: string, actionName: string, error?: string): void {
    this.log('ACTION_STEP_EXECUTED', { id, type, actionName, error });
  }

  logDataVarAssign(componentName: string, varName: string, componentPropName: string): void {
    this.log('DATA_VAR_ASSIGN', { componentName, varName, componentPropName });
  }

  logDataVarUnAssign(componentName: string, varName: string): void {
    this.log('DATA_VAR_UNASSIGN', { componentName, varName });
  }

  logDataVarSelect(stepType: string, varName: string): void {
    this.log('DATA_VAR_SELECT', { stepType, varName });
  }

  logDataVarCreate(name: string, type: string, defaultValue: string): void {
    this.log('DATA_VAR_CREATE', { name, type, defaultValue });
  }

  logActionStepOpen(actionName: string, workflowId: string, type: string, stepId: string): void {
    this.log('ACTION_STEP_OPEN', { actionName, workflowId, type, stepId });
  }

  private listenRouterNavigation(): void {
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.logPageView(event.urlAfterRedirects));
  }

  private logPageView(url: string): void {
    if (this.environment.formBuilder) {
      /**
       * because we use proxy in SignUpFormBuilder,
       * in the analytics we have '/' instead of '/signup-form-generator',
       * because FormBuilder app run at '/' router (see app-routing.module.ts)
       * and we need to rewrite it to valid path.
       */
      url = SIGNUP_FORM_GENERATOR_URL + url;
    }
    this.log('PAGE_VIEW', { url });
  }

  private log(type: string, params: any = {}): void {
    const props = this.removeEmptyProps(params);
    this.handler.log(type, { ...props, appEnvironment: this.environment.name });
  }

  private parseError(res: HttpResponseBase): string {
    return res.ok ? '' : (res as HttpErrorResponse).message;
  }

  private removeEmptyProps(event: any) {
    for (const key of Object.keys(event)) {
      if (!event[key]) {
        delete event[key];
      }
    }

    return event;
  }

  private updateUserProps(): void {
    this.handler.setEnvironment(this.environment.name);
  }

  private listenAuthorizationStatus(): void {
    if (this.authService) {
      this.authService
        .onTokenChange()
        .pipe(
          distinctUntilChanged(),
          // ignore google auth as we will exchange this token for a bakery token and will receive this tokenChange
          // event once again later
          filter(item => item.getOwnerStrategyName() !== 'google')
        )
        .subscribe((token: NbAuthOAuth2JWTToken) => this.logUserProperties(token));
    }
  }

  private logUserProperties(token: NbAuthOAuth2JWTToken): void {
    if (token && token.isValid()) {
      const { sub: email, fullName } = token.getAccessTokenPayload();
      this.handler.setUserId({ id: email, fullName, appEnvironment: this.environment.name });
    }
  }
}
