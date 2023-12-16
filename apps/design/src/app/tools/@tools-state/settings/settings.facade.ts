import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getComponentTreePageSidebarScale, getXRay } from '@tools-state/settings/settings.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { SettingsActions } from '@tools-state/settings/settings.actions';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  readonly componentTreePageSidebarScale$: Observable<number> = this.store.pipe(
    select(getComponentTreePageSidebarScale)
  );

  readonly xray$: Observable<boolean> = this.store.pipe(select(getXRay));

  constructor(private store: Store<fromTools.State>) {
  }

  updateComponentTreePageSidebarScale(scale: number): void {
    this.store.dispatch(SettingsActions.updateComponentTreePageSidebarScale({ scale }));
  }

  toggleXRay(): void {
    this.store.dispatch(SettingsActions.toggleXRay());
  }

  loadSettings(): void {
    this.store.dispatch(SettingsActions.loadSettings());
  }
}
