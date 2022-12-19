import { Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { SettingsActions } from '@tools-state/settings/settings.actions';

import { getComponentTreePageSidebarScale, getXRay } from '@tools-state/settings/settings.selectors';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  readonly componentTreePageSidebarScale$: Observable<number> = getComponentTreePageSidebarScale;

  readonly xray$: Observable<boolean> = getXRay;

  constructor() {
  }

  updateComponentTreePageSidebarScale(scale: number): void {
    dispatch(SettingsActions.updateComponentTreePageSidebarScale(scale));
  }

  toggleXRay(): void {
    dispatch(SettingsActions.toggleXRay());
  }

  loadSettings(): void {
    dispatch(SettingsActions.loadSettings());
  }
}
