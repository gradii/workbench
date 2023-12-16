import { Inject, Injectable, NgZone } from '@angular/core';
import { NB_DOCUMENT } from '@nebular/theme';

const LOADER_ID = 'uibakery-loader';
const LOADER_HIDE_TRANSITION_CLASS = 'finish';
const LOADER_HIDE_TIMEOUT = 1000;
const LOADER_HIDDEN_CLASS = 'hidden';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private document: Document;

  constructor(@Inject(NB_DOCUMENT) document, private zone: NgZone) {
    this.document = document;
  }

  show() {
    // Running all loader logic outside angular to not trigger change detection.
    this.zone.runOutsideAngular(() => {
      // Loader manipulations performed using Document API because loader lives in body, not in Angular.
      const loader: HTMLElement = this.document.getElementById(LOADER_ID);

      if (!loader) {
        return;
      }

      loader.classList.remove(LOADER_HIDDEN_CLASS);
      loader.classList.remove(LOADER_HIDE_TRANSITION_CLASS);
    });
  }

  hide() {
    // Running all loader logic outside angular to not trigger change detection.
    this.zone.runOutsideAngular(() => {
      // Loader manipulations performed using Document API because loader lives in body, not in Angular.
      const loader: HTMLElement = this.document.getElementById(LOADER_ID);

      if (!loader) {
        return;
      }

      loader.classList.add(LOADER_HIDE_TRANSITION_CLASS);

      // Loader have hide animation, so we need to wait until it ends.
      setTimeout(() => loader.classList.add(LOADER_HIDDEN_CLASS), LOADER_HIDE_TIMEOUT);
    });
  }
}
