import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Injectable, NgZone } from '@angular/core';
import { NbLayoutScrollService, NbPlatform } from '@nebular/theme';
import { merge, Observable } from 'rxjs';

// nebular overrides ScrollDispatcher in a wrong way
// it's ignore angular scroll detection for cdkScrollable directive
@Injectable()
export class ScrollDispatcherAdapter extends ScrollDispatcher {
  constructor(ngZone: NgZone, platform: NbPlatform, private scrollService: NbLayoutScrollService) {
    super(ngZone, platform);
  }

  scrolled(auditTimeInMs?: number): Observable<CdkScrollable | void> {
    return merge(super.scrolled(auditTimeInMs), this.scrollService.onScroll());
  }
}
