import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AclService, AnalyticsService } from '@common';
import { map, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';

import { StepSwitchActivation } from './step-switch-activation';
import { Step, StepAction } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';
import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';
import { SaveContinueService } from '../save-continue-dialog/save-continue.service';
import { LessonFacade } from '@tools-state/tutorial-lesson/lesson.facade';

const prevAction: StepAction = { action: 'prev' };
const nextAction: StepAction = { action: 'next' };

const defaultActions: StepAction[] = [prevAction, nextAction];

@Component({
  selector: 'ub-step-switch-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-step-switch [actions]="actions$ | async" (performAction)="performAction$.next($event)"> </ub-step-switch>
  `
})
export class StepSwitchContainerComponent implements OnInit, OnDestroy {
  performAction$ = new Subject<StepAction>();
  actions$: Observable<StepAction[]> = combineLatest([
    this.stepFacade.step$,
    this.stepSwitchActivation.withPrev$,
    this.stepSwitchActivation.withNext$,
    this.aclService.canCreateProject()
  ]).pipe(
    map(([step, prev, next, canCreateProject]: [Step, boolean, boolean, boolean]) => {
      return this.createActions(step, prev, next, canCreateProject);
    })
  );

  private destroyed$ = new Subject<void>();

  constructor(
    private stepFacade: StepFacade,
    private tutorialFacade: TutorialFacade,
    private stepSwitchActivation: StepSwitchActivation,
    private analytics: AnalyticsService,
    private router: Router,
    private saveContinueService: SaveContinueService,
    private aclService: AclService
  ) {
  }

  ngOnInit(): void {
    this.subscribeOnSwitch();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private subscribeOnSwitch(): void {
    this.performAction$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((action: StepAction | null) => this.performAction(action));
  }

  private performAction(stepAction: StepAction): void {
    const { action } = stepAction;

    if (action === 'prev') {
      this.performPrevAction();
    }

    if (action === 'next') {
      this.performNextAction();
    }

    if (action === 'continue-editing') {
      this.performContinueEditingAction();
    }

    if (action === 'create-new-project') {
      this.performCreateNewProjectAction();
    }

    if (action === 'goto-projects') {
      this.performGotoProjectsAction();
    }
  }

  private performPrevAction(): void {
    this.tutorialFacade.getActiveLessonInfo().subscribe(([lessonStep, lessonName]) => {
      this.analytics.logPrevStep(lessonName, lessonStep);
      this.stepFacade.prev();
    });
  }

  private performNextAction(): void {
    this.tutorialFacade.getActiveLessonInfo().subscribe(([lessonStep, lessonName]) => {
      this.logNextStep(lessonStep, lessonName);
      this.stepFacade.next();
    });
  }

  private performContinueEditingAction(): void {
    this.tutorialFacade.finish();
    this.saveContinueService.open();
    this.tutorialFacade.logFinishTutorial();
  }

  private performCreateNewProjectAction(): void {
    this.tutorialFacade.finish();
    this.router.navigate(['/projects'], { queryParams: { 'create-new-project': true } });
    this.tutorialFacade.logFinishTutorial();
  }

  private performGotoProjectsAction(): void {
    this.tutorialFacade.finish();
    this.router.navigate(['/projects']);
    this.tutorialFacade.logFinishTutorial();
  }

  private logNextStep(lessonStep: number, lessonName: string): void {
    const prevTime = this.stepFacade.getPrevNextCallTime().getTime();
    const currTime = new Date().getTime();
    const spentTime = (currTime - prevTime) / 1000;
    this.analytics.logNextStep(lessonName, lessonStep, false, Math.floor(spentTime));
  }

  private createActions(step: Step, prev: boolean, next: boolean, canCreateProject: boolean): StepAction[] {
    return this.resolveInitialActions(step).filter((action: StepAction) => {
      if (!prev && action.action === 'prev') {
        return false;
      }

      if (!next && action.action === 'next') {
        return false;
      }

      if (action.projectSlotRequired && !canCreateProject) {
        return false;
      }

      if (action.showWhenNoProjectSlots && canCreateProject) {
        return false;
      }

      return true;
    });
  }

  private resolveInitialActions(step: Step): StepAction[] {
    return step.actions || defaultActions;
  }
}
