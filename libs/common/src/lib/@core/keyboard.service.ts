import { Inject, Injectable } from '@angular/core';
import { NB_DOCUMENT } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PlatformDetectorService } from './platform-detector.service';

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  constructor(@Inject(NB_DOCUMENT) private document, private platformDetectorService: PlatformDetectorService) {
  }

  private keyUp$ = fromEvent(this.document, 'keyup');
  private keyDown$ = fromEvent(this.document, 'keydown');
  readonly copy$ = fromEvent(this.document, 'copy');
  readonly paste$ = fromEvent(this.document, 'paste');
  readonly cut$ = fromEvent(this.document, 'cut');

  undo$ = this.keyDown$.pipe(filter((e: KeyboardEvent) => this.keyWithMulti(e, 'z') && !e.shiftKey));

  redo$ = this.keyDown$.pipe(filter((e: KeyboardEvent) => this.keyWithMulti(e, 'z') && e.shiftKey));

  readonly delete$ = this.keyUp$.pipe(
    filter((e: KeyboardEvent) => {
      const isDeleteAction = e.key === 'Backspace' || e.key === 'Delete';
      return isDeleteAction && this.canRemove(e);
    })
  );

  private keyWithMulti(e: KeyboardEvent, key: string): boolean {
    const multi = this.platformDetectorService.isMac() ? e.metaKey : e.ctrlKey;
    return multi && e.key === key;
  }

  private canRemove(e: KeyboardEvent): boolean {
    const tagName = e.target['tagName'].toLowerCase();
    return !e.target['isContentEditable'] && tagName !== 'input' && tagName !== 'textarea';
  }
}
