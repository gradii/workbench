import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformDetectorService {
  isWindows(): boolean {
    return navigator.platform.toLowerCase().indexOf('win') > -1;
  }

  isMac(): boolean {
    return navigator.platform.toLowerCase().indexOf('mac') > -1;
  }

  isFirefox(): boolean {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  ifEdge(): boolean {
    return navigator.userAgent.toLowerCase().indexOf('edge') > -1;
  }
}
