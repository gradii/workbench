import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { AnalyticsService, onlyLatestFrom, OvenSettings } from '@common';
import { select, Store } from '@ngrx/store';

import { SettingsActions } from '@tools-state/settings/settings.actions';
import { SettingsService } from '@tools-state/settings/settings.service';
import { Settings } from '@tools-state/settings/settings.model';
import { fromSettings } from '@tools-state/settings/settings.reducer';
import { getSettingsState, getXRay } from '@tools-state/settings/settings.selectors';
import { CommunicationService } from '@shared/communication/communication.service';

const defaultSettings: Settings = {
  componentTreePagesSidebarScale: 0.3,
  xray: true
};

@Injectable()
export class SettingsEffects {
  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadSettings),
      map(() => {
        const settings: Settings = this.settingsService.getSettings() || defaultSettings;
        return SettingsActions.loadSettingsSuccess({ settings });
      })
    )
  );

  updateSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.updateComponentTreePageSidebarScale, SettingsActions.toggleXRay),
        onlyLatestFrom(this.store.pipe(select(getSettingsState))),
        tap((settings: Settings) => this.settingsService.persistSettings(settings))
      ),
    { dispatch: false }
  );

  syncSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.toggleXRay, SettingsActions.loadSettingsSuccess),
        onlyLatestFrom(this.store.pipe(select(getSettingsState))),
        map((settings: Settings) => this.createOvenSettings(settings)),
        tap((settings: OvenSettings) => this.communicationService.syncSettings(settings))
      ),
    { dispatch: false }
  );

  toggleXray$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.toggleXRay),
        onlyLatestFrom(this.store.pipe(select(getXRay))),
        tap((xray: boolean) => this.analytics.logXrayChanged(xray))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromSettings.State>,
    private communicationService: CommunicationService,
    private settingsService: SettingsService,
    private analytics: AnalyticsService
  ) {
  }

  private createOvenSettings(settings: Settings): OvenSettings {
    return { xray: settings.xray };
  }
}
