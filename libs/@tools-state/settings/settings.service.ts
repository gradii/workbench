import { Inject, Injectable } from '@angular/core';

import { Settings } from '@tools-state/settings/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private window: Window;
  private key = '@uibakery/settings';

  constructor() {
    this.window = window;
  }

  getSettings(): Settings {
    return JSON.parse(this.window.localStorage.getItem(this.key));
  }

  persistSettings(settings: Settings): void {
    this.window.localStorage.setItem(this.key, JSON.stringify(settings));
  }
}
