import { Inject, Injectable } from '@angular/core';
import { NB_DOCUMENT, NB_WINDOW } from '@nebular/theme';
import { onlyLatestFrom } from '@common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BuilderSidebarService } from './builder-sidebar.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IframeFocusService {
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private builderSidebarService: BuilderSidebarService,
    @Inject(NB_WINDOW) private window,
    @Inject(NB_DOCUMENT) private document
  ) {
  }

  attach() {
    fromEvent(this.window, 'blur')
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
