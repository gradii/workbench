import { Injectable } from '@angular/core';
import { AnalyticsService, KitchenSettings, onlyLatestFrom } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';
import { CommunicationService } from '@shared/communication/communication.service';

import { SettingsActions } from '@tools-state/settings/settings.actions';
import { Settings } from '@tools-state/settings/settings.model';
import { getSettingsState, getXRay } from '@tools-state/settings/settings.selectors';
import { SettingsService } from '@tools-state/settings/settings.service';
import { map, tap } from 'rxjs/operators';

const defaultSettings: Settings = {
  componentTreePagesSidebarScale: 0.3,
  xray: true
};

@Injectable()
export class SettingsEffects {
  loadSettings$ = createEffect((actions) =>
    actions.pipe(
      ofType(SettingsActions.loadSettings),
      map(() => {
        const settings: Settings = this.settingsService.getSettings() || defaultSettings;
        return SettingsActions.loadSettingsSuccess(settings);
      })
    )
  );

  updateSettings$ = createEffect(
    (actions) =>
      actions.pipe(
        ofType(SettingsActions.updateComponentTreePageSidebarScale, SettingsActions.toggleXRay),
        onlyLatestFrom(getSettingsState),
        tap((settings: Settings) => this.settingsService.persistSettings(settings))
      ),
    { dispatch: false }
  );

  syncSettings$ = createEffect(
    (actions) =>
      actions.pipe(
        ofType(SettingsActions.toggleXRay, SettingsActions.loadSettingsSuccess),
        onlyLatestFrom(getSettingsState),
        map((settings: Settings) => this.createKitchenSettings(settings)),
        tap((settings: KitchenSettings) => this.communicationService.syncSettings(settings))
      ),
    { dispatch: false }
  );

  toggleXray$ = createEffect(
    (actions) =>
      actions.pipe(
        ofType(SettingsActions.toggleXRay),
        onlyLatestFrom(getXRay),
        tap((xray: boolean) => this.analytics.logXrayChanged(xray))
      ),
    { dispatch: false }
  );

  constructor(
    private communicationService: CommunicationService,
    private settingsService: SettingsService,
    private analytics: AnalyticsService
  ) {
  }

  private createKitchenSettings(settings: Settings): KitchenSettings {
    return { xray: settings.xray };
  }
}
