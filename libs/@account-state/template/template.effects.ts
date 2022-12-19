import { TemplateActions } from '@account-state/template/template.actions';
import { Template, TemplateBag } from '@account-state/template/template.model';
import { TemplateService } from '@account-state/template/template.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KitchenApp } from '@common/public-api';
import { createEffect, dispatch, ofType } from '@ngneat/effects';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { DownloadService } from '@tools-state/download/download.service';
import { of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class TemplateEffects {
  constructor(
    private templateService: TemplateService,
    private downloadService: DownloadService,
    private stateConverter: StateConverterService,
    private router: Router
  ) {
  }

  loadTemplateList = createEffect((actions) =>
    actions.pipe(
      ofType(TemplateActions.LoadTemplateList),
      mergeMap(() =>
        this.templateService.loadTemplateList().pipe(
          map((templateList: Template[]) => TemplateActions.LoadTemplateListSuccess(templateList)),
          catchError(() => of(TemplateActions.LoadTemplateListFailed()))
        )
      )
    )
  );

  loadTemplateCode = createEffect((actions) =>
    actions.pipe(
      ofType(TemplateActions.LoadTemplateCode),
      exhaustMap(({ id, name, source }: Template & { source: string }) => {
        return this.templateService.loadTemplateBag(id).pipe(
          switchMap((templateBag: TemplateBag) => {
            const app: KitchenApp = this.stateConverter.convertState(templateBag.app);
            return this.downloadService.generateApplication(app, name, true, source).pipe(
              finalize(() => {
                dispatch(TemplateActions.ClearTemplateCode());
              }),
              takeUntil(this.router.events)
            );
          }),
          map(() => TemplateActions.LoadTemplateCodeSuccess()),
          catchError(() => of(TemplateActions.LoadTemplateCodeFailed()))
        );
      })
    )
  );
}
