import { Injectable, OnDestroy } from '@angular/core';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AnalyticsService, OvenApp } from '@common';

import { fromTools } from '@tools-state/tools.reducer';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { getAppState } from '@tools-state/app/app.selectors';
import { BakeryApp } from '@tools-state/app/app.model';
import { StateComparator } from './state-comparator.service';
import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { DynamicStepSwitchActivationService } from '../dynamic-lesson/dynamic-step-switch-activation.service';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';
import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';

@Injectable()
export class DynamicStepValidatorService implements OnDestroy {
  private destroyed$ = new Subject();
  readonly stepCompleted$ = new Subject();

  constructor(
    private stepFacade: StepFacade,
    private store: Store<fromTools.State>,
    private stateConverter: StateConverterService,
    private validator: StateComparator,
    private stepSwitchActivation: DynamicStepSwitchActivationService,
    private tutorialFacade: TutorialFacade,
    private analytics: AnalyticsService,
    private actions$: Actions
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  installValidator() {
    this.actions$
      .pipe(
        ofType(WorkingAreaActions.ActionTypes.SyncState),
        switchMap(() => combineLatest([this.getAppState(), this.getStep()])),
        filter(([_, step]: [OvenApp, Step]) => !!step.validity),
        map(([state, step]: [OvenApp, Step]) => {
          const isValid: boolean = this.validator.isEqual(state, step);
          return [isValid, step.id];
        }),
        filter(([isValid, _]: [boolean, string]) => isValid),
        takeUntil(this.destroyed$)
      )
      .subscribe(([_, id]) => {
        this.tutorialFacade.getActiveLessonInfo().subscribe(([lessonStep, lessonName]) => {
          this.logNextStep(lessonStep, lessonName);
          this.stepCompleted$.next();
          this.stepSwitchActivation.markStepCompleted(id);
          this.stepFacade.next();
        });
      });
  }

  private getAppState(): Observable<OvenApp> {
    return this.store.pipe(
      select(getAppState),
      map((app: BakeryApp) => this.stateConverter.convertState(app)),
      take(1)
    );
  }

  private getStep(): Observable<Step> {
    return this.stepFacade.step$.pipe(take(1));
  }

  private logNextStep(lessonStep: number, lessonName: string): void {
    const prevTime = this.stepFacade.getPrevNextCallTime().getTime();
    const currTime = new Date().getTime();
    const spentTime = (currTime - prevTime) / 1000;
    this.analytics.logNextStep(lessonName, lessonStep, true, Math.floor(spentTime));
  }
}

