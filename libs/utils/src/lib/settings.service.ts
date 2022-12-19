import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Settings {
  settings: /*SettingsModels.Settings*/ any = {
    recent: [],
    canCollectData: false,
    installNodeManually: false,
    enableDetailedStatus: true,
    isConnectUser: false,
    channel: 'latest',
    disableAnimations: true,
    isWsl: false,
    isWindows: false,
    useNvm: false
  };

  isWindows() {
    return this.settings.isWindows;
  }

  isWsl() {
    return this.settings.isWsl;
  }
}
