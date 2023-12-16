import { TemplateActions } from '@account-state/template/template.actions';
import { TemplateService } from '@account-state/template/template.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, finalize, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { DownloadService } from '@tools-state/download/download.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { Template, TemplateBag } from '@account-state/template/template.model';
import { OvenApp } from '@common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { fromTemplate } from '@account-state/template/template.reducer';

@Injectable()
export class TemplateEffects {
  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private downloadService: DownloadService,
    private stateConverter: StateConverterService,
    private router: Router,
    private store: Store<fromTemplate.State>
  ) {
  }

  loadTemplateList = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplateActions.ActionTypes.LoadTemplateList),
      mergeMap(() =>
        this.templateService.loadTemplateList().pipe(
          map((templateList: Template[]) => TemplateActions.loadTemplateListSuccess({ templateList })),
          catchError(() => of(TemplateActions.loadTemplateListFailed()))
        )
      )
    )
  );

  loadTemplateCode = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplateActions.ActionTypes.LoadTemplateCode),
      exhaustMap(({ id, name, source }: Template & { source: string }) => {
        return this.templateService.loadTemplateBag(id).pipe(
          switchMap((templateBag: TemplateBag) => {
            const app: OvenApp = this.stateConverter.convertState(templateBag.app);
            return this.downloadService.generateApplication(app, name, true, source).pipe(
              finalize(() => {
                this.store.dispatch(TemplateActions.clearTemplateCodeLoad());
              }),
              takeUntil(this.router.events)
            );
          }),
          map(() => TemplateActions.loadTemplateCodeSuccess()),
          catchError(() => of(TemplateActions.loadTemplateCodeFailed()))
        );
      })
    )
  );
}
