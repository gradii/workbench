import { Injectable } from '@angular/core';
import { AccessFeature } from '@common/public-api';
import { UpgradeService } from '@core/upgrade/upgrade.service';
import { createEffect, ofType } from '@ngneat/effects';

import { FeatureActions } from '@root-state/feature/feature.actions';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class FeatureEffects {
  constructor(
    private upgradeService: UpgradeService
  ) {
  }

  accessWidget$ = createEffect(actions => actions.pipe(
    ofType(FeatureActions.AccessFeature),
    filter(({ feature }: AccessFeature) => feature === 'widget'),
    tap(({ element }: AccessFeature) => this.upgradeService.accessWidgetRequest(element))
  ));

  accessProjectTemplate$ = createEffect(actions => actions.pipe(
    ofType(FeatureActions.AccessFeature),
    filter(({ feature }: AccessFeature) => feature === 'template'),
    tap(({ element }: AccessFeature) => this.upgradeService.accessTemplateRequest(element))
  ));
}
