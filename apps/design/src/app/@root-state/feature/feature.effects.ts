import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';
import { AccessFeature } from '@common';

import { FeatureActions } from '@root-state/feature/feature.actions';
import { UpgradeService } from '@core/upgrade/upgrade.service';

@Injectable()
export class FeatureEffects {
  constructor(private actions$: Actions, private upgradeService: UpgradeService) {
  }

  @Effect({ dispatch: false })
  accessWidget$ = this.actions$.pipe(
    ofType(FeatureActions.ActionTypes.ACCESS_FEATURE),
    filter(({ feature }: AccessFeature) => feature === 'widget'),
    tap(({ element }: AccessFeature) => this.upgradeService.accessWidgetRequest(element))
  );

  @Effect({ dispatch: false })
  accessProjectTemplate$ = this.actions$.pipe(
    ofType(FeatureActions.ActionTypes.ACCESS_FEATURE),
    filter(({ feature }: AccessFeature) => feature === 'template'),
    tap(({ element }: AccessFeature) => this.upgradeService.accessTemplateRequest(element))
  );
}
