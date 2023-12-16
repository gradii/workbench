import { Injectable } from '@angular/core';
import { AnalyticsService, OvenApp } from '@common';
import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { DownloadActions } from '@tools-state/download/download.actions';
import { BakeryApp } from '@tools-state/app/app.model';
import { getAppState } from '@tools-state/app/app.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { DownloadService } from '@tools-state/download/download.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { CommunicationService } from '@shared/communication/communication.service';
import { getActiveProjectName } from '@tools-state/project/project.selectors';
import { calcPagesNumber } from '@tools-state/download/download-util';

const downloadResultAppearedDelay = 3000;

@Injectable()
export class DownloadEffects {
  private timeout;

  constructor(
    private actions$: Actions,
    private store: Store<fromTools.State>,
    private stateConverter: StateConverterService,
    private communication: CommunicationService,
    private downloadService: DownloadService,
    private analytics: AnalyticsService
  ) {
  }

  @Effect()
  download = this.actions$.pipe(
    ofType(DownloadActions.ActionTypes.Download),
    withLatestFrom(this.store.pipe(select(getAppState))),
    tap(() => {
      this.store.dispatch(new DownloadActions.ClearDownloadState());
      // in case we requested download multiple times one after another
      // we need to clear out previous timeout results
      // otherwise they will overlap
      clearTimeout(this.timeout);
    }),
    map(([action, app]: [DownloadActions.Download, BakeryApp]) => [action, this.stateConverter.convertState(app)]),
    withLatestFrom(this.store.pipe(select(getActiveProjectName))),
    mergeMap(([[action, app], name]: [[DownloadActions.Download, OvenApp], string]) =>
      // We have to handle error directly on the generateApplication stream, because another way even handled
      // error will kill the stream and we'll not be able to handle next download attempts
      this.downloadService.generateApplication(app, name, false, action.source).pipe(
        map(() => {
          this.timeout = setTimeout(
            () => this.store.dispatch(new DownloadActions.ClearDownloadState()),
            downloadResultAppearedDelay
          );
          return new DownloadActions.DownloadSuccess();
        }),
        catchError((error: Error) => {
          const pagesNumber = calcPagesNumber(app);
          this.analytics.logDownloadCode(name, pagesNumber, `0 Kb`, action.source, error.message);
          this.timeout = setTimeout(
            () => this.store.dispatch(new DownloadActions.ClearDownloadState()),
            downloadResultAppearedDelay
          );
          return of(new DownloadActions.DownloadError());
        })
      )
    )
  );
}
