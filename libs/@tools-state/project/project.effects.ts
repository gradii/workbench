import { Injectable } from '@angular/core';
import { onlyLatestFrom } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';
import { CommunicationService } from '@shared/communication/communication.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { ProjectService } from '@shared/project.service';

import { PuffApp } from '@tools-state/app/app.model';
import { getAppState } from '@tools-state/app/app.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { PageActions } from '@tools-state/page/page.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { EMPTY } from 'rxjs';
import {
  catchError, debounceTime, delay, mergeMap, skipUntil, tap, throttleTime, withLatestFrom
} from 'rxjs/operators';

const debounceDelay     = 1000;
const thumbnailDelay    = 3000;
const thumbnailThrottle = 120000;

@Injectable()
export class ProjectEffects {
  constructor(
    private stateConverter: StateConverterService,
    private communication: CommunicationService,
    private projectService: ProjectService
  ) {
  }

  updateProjectModel = createEffect((actions) => actions.pipe(
    ofType(
      ProjectActions.UpdateProject,
      HistoryActions.Forward,
      HistoryActions.Back
    ),
    debounceTime(debounceDelay),
    onlyLatestFrom(getActiveProjectId),
    withLatestFrom(getAppState),
    mergeMap(([projectId, model]: [string, PuffApp]) =>
      this.projectService.updateProjectModel(projectId, model).pipe(
        catchError(e => {
          console.error('model syncing failed', e);
          return EMPTY;
        })
      )
    )
  ), { dispatch: false });

  makeThumbnail = createEffect((actions) => actions.pipe(
    skipUntil(actions.pipe(ofType(WorkingAreaActions.FinishLoading), delay(thumbnailDelay))),
    ofType(WorkingAreaActions.SyncState, PageActions.SetActivePage),
    // wait until changes rendered
    delay(thumbnailDelay),
    throttleTime(thumbnailThrottle),
    tap(() => this.communication.makeThumbnail())
  ), { dispatch: false });

  persistThumbnail = createEffect((actions) => actions.pipe(
    ofType(ProjectActions.PersistThumbnail),
    withLatestFrom(getActiveProjectId),
    mergeMap(([action, projectId]) =>
      this.projectService.updateProjectThumbnail(projectId, action.thumbnail)
    )
  ), { dispatch: false });
}
