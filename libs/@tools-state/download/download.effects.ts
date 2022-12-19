import { Injectable } from '@angular/core';
import { AnalyticsService, KitchenApp } from '@common/public-api';
import { createEffect, dispatch, ofType } from '@ngneat/effects';
import { CommunicationService } from '@shared/communication/communication.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { PuffApp } from '@tools-state/app/app.model';
import { getAppState } from '@tools-state/app/app.selectors';
import { calcPagesNumber } from '@tools-state/download/download-util';

import { DownloadActions } from '@tools-state/download/download.actions';
import { DownloadService } from '@tools-state/download/download.service';
import { getActiveProjectName } from '@tools-state/project/project.selectors';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

const downloadResultAppearedDelay = 3000;

@Injectable()
export class DownloadEffects {
  private timeout;

  constructor(
    private stateConverter: StateConverterService,
    private communication: CommunicationService,
    private downloadService: DownloadService,
    private analytics: AnalyticsService
  ) {
  }

  download = createEffect(actions => actions.pipe(
    ofType(DownloadActions.Download),
    withLatestFrom(getAppState),
    tap(() => {
      dispatch(DownloadActions.ClearDownloadState());
      // in case we requested download multiple times one after another
      // we need to clear out previous timeout results
      // otherwise they will overlap
      clearTimeout(this.timeout);
    }),
    map(([action, app]: [any, PuffApp]) => [action, this.stateConverter.convertState(app)]),
    withLatestFrom(getActiveProjectName),
    mergeMap(([[action, app], name]: [[any, KitchenApp], string]) =>
      // We have to handle error directly on the generateApplication stream, because another way even handled
      // error will kill the stream and we'll not be able to handle next download attempts
      this.downloadService.generateApplication(app, name, false, action.source).pipe(
        map(() => {
          this.timeout = setTimeout(
            () => dispatch(DownloadActions.ClearDownloadState()),
            downloadResultAppearedDelay
          );
          return DownloadActions.DownloadSuccess();
        }),
        catchError((error: Error) => {
          const pagesNumber = calcPagesNumber(app);
          this.analytics.logDownloadCode(name, pagesNumber, `0 Kb`, action.source, error.message);
          this.timeout = setTimeout(
            () => dispatch(DownloadActions.ClearDownloadState()),
            downloadResultAppearedDelay
          );
          return of(DownloadActions.DownloadError());
        })
      )
    )
  ));
}
