import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import {
  debounceTime,
  delay,
  mergeMap,
  skipUntil,
  tap,
  throttleTime,
  withLatestFrom,
  catchError
} from 'rxjs/operators';
import { onlyLatestFrom } from '@common';

import { BakeryApp } from '@tools-state/app/app.model';
import { getAppState } from '@tools-state/app/app.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { PageActions } from '@tools-state/page/page.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { CommunicationService } from '@shared/communication/communication.service';
import { ProjectService } from '@shared/project.service';

const debounceDelay = 1000;
const thumbnailDelay = 3000;
const thumbnailThrottle = 120000;

@Injectable()
export class ProjectEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromTools.State>,
    private stateConverter: StateConverterService,
    private communication: CommunicationService,
    private projectService: ProjectService
  ) {
  }

  @Effect({ dispatch: false })
  updateProjectModel = this.actions$.pipe(
    ofType(
      ProjectActions.ActionTypes.UpdateProject,
      HistoryActions.ActionTypes.Forward,
      HistoryActions.ActionTypes.Back
    ),
    debounceTime(debounceDelay),
    onlyLatestFrom(this.store.select(getActiveProjectId)),
    withLatestFrom(this.store.select(getAppState)),
    mergeMap(([projectId, model]: [string, BakeryApp]) =>
      this.projectService.updateProjectModel(projectId, model).pipe(
        catchError(e => {
          console.error('model syncing failed', e);
          return EMPTY;
        })
      )
    )
  );

  @Effect({ dispatch: false })
  makeThumbnail = this.actions$.pipe(
    skipUntil(this.actions$.pipe(ofType(WorkingAreaActions.ActionTypes.FinishLoading), delay(thumbnailDelay))),
    ofType(WorkingAreaActions.ActionTypes.SyncState, PageActions.ActionTypes.SetActivePage),
    // wait until changes rendered
    delay(thumbnailDelay),
    throttleTime(thumbnailThrottle),
    tap(() => this.communication.makeThumbnail())
  );

  @Effect({ dispatch: false })
  persistThumbnail = this.actions$.pipe(
    ofType(ProjectActions.ActionTypes.PersistThumbnail),
    withLatestFrom(this.store.select(getActiveProjectId)),
    mergeMap(([action, projectId]: [ProjectActions.PersistThumbnail, string]) =>
      this.projectService.updateProjectThumbnail(projectId, action.image)
    )
  );
}
