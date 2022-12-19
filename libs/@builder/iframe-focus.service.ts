import { Inject, Injectable } from '@angular/core';
import { onlyLatestFrom } from '@common/public-api';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BuilderSidebarService } from './builder-sidebar.service';
import { environment } from '@environments';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class IframeFocusService {
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private builderSidebarService: BuilderSidebarService,
    @Inject(DOCUMENT) private document
  ) {
  }

  attach() {
    fromEvent(window, 'blur')
      .pipe(takeUntil(this.destroyed$), onlyLatestFrom(this.builderSidebarService.opened$))
      .subscribe((opened: boolean) => {
        const activeEl = this.document.activeElement;
        if (
          opened &&
          activeEl &&
          activeEl.tagName === 'IFRAME' &&
          activeEl.getAttribute('src') === environment.workbenchUrl
        ) {
          this.builderSidebarService.close();
        }
      });
  }

  detach() {
    this.destroyed$.next();
  }
}
